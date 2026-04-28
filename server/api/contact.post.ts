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

  // Mosparo verification (optional — only active when MOSPARO_URL is configured)
  if (config.public.mosparoUrl) {
    const mosparoSubmitToken = (body?.mosparoSubmitToken || "").trim();
    const mosparoValidationToken = (body?.mosparoValidationToken || "").trim();

    if (!mosparoSubmitToken || !mosparoValidationToken) {
      throw createError({
        statusCode: 400,
        statusMessage: "Sicherheitsüberprüfung fehlt.",
      });
    }

    const formData = { name, email, subject, message };
    const requestBody = {
      submitToken: mosparoSubmitToken,
      validationToken: mosparoValidationToken,
      formData,
    };
    const jsonBody = JSON.stringify(requestBody);
    const hmac = createHmac("sha256", config.mosparoApiSecret as string)
      .update(jsonBody)
      .digest("hex");
    const authHeader = Buffer.from(`${config.mosparoApiKey}:${hmac}`).toString(
      "base64",
    );

    const verifyRes = await fetch(
      `${config.public.mosparoUrl}/api/v1/verification/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: jsonBody,
      },
    );

    if (!verifyRes.ok) {
      throw createError({
        statusCode: 400,
        statusMessage: "Sicherheitsüberprüfung fehlgeschlagen.",
      });
    }

    const verifyData = (await verifyRes.json()) as { valid?: boolean };
    if (!verifyData.valid) {
      throw createError({
        statusCode: 400,
        statusMessage: "Sicherheitsüberprüfung fehlgeschlagen.",
      });
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
