import { createHmac } from "node:crypto";
import nodemailer from "nodemailer";

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  // Honeypot — must be empty
  website?: string;
  // Mosparo spam-protection tokens
  mosparoSubmitToken?: string;
  mosparoValidationToken?: string;
}

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactPayload>(event);

  // Honeypot: silently succeed for bots
  if (body?.website && body.website.trim() !== "") {
    return { ok: true };
  }

  const name = (body?.name || "").trim();
  const email = (body?.email || "").trim();
  const subject = (body?.subject || "").trim();
  const message = (body?.message || "").trim();

  if (!name || name.length > 200) {
    throw createError({ statusCode: 400, statusMessage: "Ungültiger Name." });
  }
  if (!email || !isValidEmail(email) || email.length > 200) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ungültige E-Mail-Adresse.",
    });
  }
  if (!message || message.length < 5 || message.length > 5000) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nachricht ist zu kurz oder zu lang.",
    });
  }

  const config = useRuntimeConfig();

  // Mosparo verification (11-step manual verification per official docs)
  // https://documentation.mosparo.io/de/docs/integration/custom
  if (config.public.mosparoUrl) {
    const submitToken = (body?.mosparoSubmitToken || "").trim();
    const validationToken = (body?.mosparoValidationToken || "").trim();

    if (!submitToken || !validationToken) {
      throw createError({
        statusCode: 400,
        statusMessage: "Sicherheitsüberprüfung fehlt.",
      });
    }

    // privateKey is used for HMAC signatures, publicKey for Basic Auth.
    // Fallback to process.env directly because Coolify env vars marked
    // "Available at Runtime" only are NOT baked into runtimeConfig at build time
    // (Nuxt only overrides at runtime via NUXT_* prefix convention).
    const privateKey =
      (config.mosparoPrivateKey as string) ||
      (config.mosparoApiSecret as string) ||
      process.env.MOSPARO_PRIVATE_KEY ||
      process.env.MOSPARO_API_SECRET ||
      "";
    const publicKey =
      (config.public.mosparoPublicKey as string) ||
      (config.mosparoApiKey as string) ||
      process.env.MOSPARO_PUBLIC_KEY ||
      process.env.MOSPARO_API_KEY ||
      "";

    if (!privateKey || !publicKey) {
      throw createError({
        statusCode: 500,
        statusMessage: `Mosparo ist nicht korrekt konfiguriert. (privateKey: ${privateKey ? "ok" : "fehlt"}, publicKey: ${publicKey ? "ok" : "fehlt"})`,
      });
    }

    // Step 3: Prepare form data (use field names matching the form's name attribute)
    const rawFormData: Record<string, string> = {
      name,
      email,
      subject,
      message,
    };
    // Replace CRLF with LF
    const preparedFormData: Record<string, string> = {};
    for (const [k, v] of Object.entries(rawFormData)) {
      preparedFormData[k] = v.replace(/\r\n/g, "\n");
    }

    // Step 4: Hash each field value with SHA256 and sort alphabetically
    const { createHash } = await import("node:crypto");
    const hashedFormData: Record<string, string> = {};
    const sortedKeys = Object.keys(preparedFormData).sort();
    for (const k of sortedKeys) {
      hashedFormData[k] = createHash("sha256")
        .update(preparedFormData[k]!)
        .digest("hex");
    }

    // Step 5: formDataSignature = HMAC-SHA256(JSON(hashedFormData), privateKey)
    const jsonHashedFormData = JSON.stringify(hashedFormData);
    const formDataSignature = createHmac("sha256", privateKey)
      .update(jsonHashedFormData)
      .digest("hex");

    // Step 6: validationSignature = HMAC-SHA256(validationToken, privateKey)
    const validationSignature = createHmac("sha256", privateKey)
      .update(validationToken)
      .digest("hex");

    // Step 7: verificationSignature = HMAC-SHA256(validationSignature + formDataSignature, privateKey)
    const verificationSignature = createHmac("sha256", privateKey)
      .update(validationSignature + formDataSignature)
      .digest("hex");

    // Step 8: Build request data
    const apiEndpoint = "/api/v1/verification/verify";
    const requestData = {
      submitToken,
      validationSignature,
      formSignature: formDataSignature,
      formData: hashedFormData,
    };

    // Step 9: requestSignature = HMAC-SHA256(apiEndpoint + JSON(requestData), privateKey)
    const jsonRequestData = JSON.stringify(requestData);
    const requestSignature = createHmac("sha256", privateKey)
      .update(apiEndpoint + jsonRequestData)
      .digest("hex");

    // Step 10: POST to mosparo with Basic Auth (publicKey:requestSignature)
    const authHeader = Buffer.from(`${publicKey}:${requestSignature}`).toString(
      "base64",
    );

    let verifyRes: Response;
    try {
      verifyRes = await fetch(`${config.public.mosparoUrl}${apiEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: jsonRequestData,
      });
    } catch (e: any) {
      throw createError({
        statusCode: 502,
        statusMessage: `Mosparo nicht erreichbar: ${e?.message || "Unbekannt"}`,
      });
    }

    if (!verifyRes.ok) {
      const errText = await verifyRes.text().catch(() => "");
      throw createError({
        statusCode: 400,
        statusMessage: `Sicherheitsüberprüfung fehlgeschlagen (HTTP ${verifyRes.status}). ${errText}`,
      });
    }

    // Step 11: Verify response
    const verifyData = (await verifyRes.json()) as {
      valid?: boolean;
      verificationSignature?: string;
      verifiedFields?: Record<string, string>;
      error?: boolean;
      errorMessage?: string;
    };

    if (verifyData.error) {
      throw createError({
        statusCode: 400,
        statusMessage: `Mosparo Fehler: ${verifyData.errorMessage || "Unbekannt"}`,
      });
    }

    if (
      !verifyData.valid ||
      verifyData.verificationSignature !== verificationSignature
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Sicherheitsüberprüfung fehlgeschlagen.",
      });
    }

    // Bypass protection: ensure all required fields were verified by mosparo
    const verifiedFields = verifyData.verifiedFields || {};
    for (const requiredField of ["name", "email", "message"]) {
      if (!verifiedFields[requiredField]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Pflichtfeld ${requiredField} wurde nicht verifiziert.`,
        });
      }
    }
  }

  const smtp = config.smtp as {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
    to: string;
  };

  if (!smtp.host || !smtp.user || !smtp.pass || !smtp.from || !smtp.to) {
    throw createError({
      statusCode: 500,
      statusMessage: "Mail-Server ist nicht konfiguriert.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  await transporter.sendMail({
    from: smtp.from,
    to: smtp.to,
    replyTo: `${name} <${email}>`,
    subject: subject
      ? `[Kontakt] ${subject}`
      : `[Kontakt] Neue Nachricht von ${name}`,
    text: `Name: ${name}\nE-Mail: ${email}\nBetreff: ${subject || "—"}\n\n${message}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Betreff:</strong> ${escapeHtml(subject || "—")}</p>
        <hr/>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `,
  });

  return { ok: true };
});
