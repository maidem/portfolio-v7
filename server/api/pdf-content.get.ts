import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

interface Entry {
  id: string;
  label: string;
  html: string;
}

const SECTION_LABELS: Record<string, string> = {
  information: "Informationen",
  projekte: "Projekte",
  skills: "Skills",
  logbuch: "Logbuch",
};

const ALLOWED = new Set(Object.keys(SECTION_LABELS));

const isAllowedId = (id: string) =>
  ALLOWED.has(id) ||
  /^projekte__[a-z0-9-]+$/.test(id) ||
  /^logbuch__[a-z0-9-]+$/.test(id);

const renderMarkdownFile = async (path: string) => {
  const raw = await fs.readFile(path, "utf-8");
  const { content } = matter(raw);
  return marked.parse(content) as string;
};

const safeRead = async (path: string) => {
  try {
    return await renderMarkdownFile(path);
  } catch {
    return "";
  }
};

const safeReadRaw = async (path: string): Promise<string | null> => {
  try {
    return await fs.readFile(path, "utf-8");
  } catch {
    return null;
  }
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const sectionsParam = String(query.sections || "");
  const ids = sectionsParam
    .split(",")
    .map((s) => s.trim())
    .filter((s) => isAllowedId(s));

  if (ids.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Keine gültigen Inhalte ausgewählt.",
    });
  }

  const contentRoot = resolve(process.cwd(), "content");
  const entries: Entry[] = [];

  for (const id of ids) {
    let html = "";
    let label = SECTION_LABELS[id] || id;

    if (id === "information") {
      html = await safeRead(resolve(contentRoot, "information.md"));
    } else if (id === "projekte") {
      const dir = resolve(contentRoot, "projects");
      try {
        const files = (await fs.readdir(dir))
          .filter((f) => f.endsWith(".md"))
          .sort();
        const parts: string[] = [];
        for (const f of files) {
          const raw = await fs.readFile(resolve(dir, f), "utf-8");
          const { data, content } = matter(raw);
          const title = (data.title as string) || f.replace(/\.md$/, "");
          const date = (data.date as string) || "";
          const description = (data.description as string) || "";
          const techs = Array.isArray(data.technologies)
            ? (data.technologies as string[]).join(" · ")
            : "";
          parts.push(`<section class="project">
            <h3>${escapeHtml(title)}</h3>
            ${date ? `<p class="meta">${escapeHtml(date)}</p>` : ""}
            ${description ? `<p>${escapeHtml(description)}</p>` : ""}
            ${marked.parse(content) as string}
            ${techs ? `<p class="tech"><strong>Technologien:</strong> ${escapeHtml(techs)}</p>` : ""}
          </section>`);
        }
        html = parts.join("\n");
      } catch {
        html = "";
      }
    } else if (id.startsWith("projekte__")) {
      const slug = id.slice("projekte__".length);
      const filePath = resolve(contentRoot, "projects", `${slug}.md`);
      const raw = await safeReadRaw(filePath);
      if (raw) {
        const { data, content } = matter(raw);
        label = (data.title as string) || slug;
        const techs = Array.isArray(data.technologies)
          ? (data.technologies as string[]).join(" · ")
          : "";
        html = `${marked.parse(content) as string}
          ${techs ? `<p class="tech"><strong>Technologien:</strong> ${escapeHtml(techs)}</p>` : ""}`;
      }
    } else if (id === "skills") {
      html = `<p>Schwerpunkte und Technologien sind in Vorbereitung. Aktuelle Übersicht stets unter <em>maikdemuth.de/skills</em>.</p>`;
    } else if (id === "logbuch") {
      const dir = resolve(contentRoot, "logbuch");
      try {
        const files = (await fs.readdir(dir))
          .filter((f) => f.endsWith(".md"))
          .sort();
        const parts: string[] = [];
        for (const f of files) {
          const raw = await fs.readFile(resolve(dir, f), "utf-8");
          const { data, content } = matter(raw);
          const title = (data.title as string) || f.replace(/\.md$/, "");
          const date = (data.date as string) || "";
          parts.push(`<section class="logbuch-entry">
            <h3>${escapeHtml(title)}</h3>
            ${date ? `<p class="meta">${escapeHtml(date)}</p>` : ""}
            ${marked.parse(content) as string}
          </section>`);
        }
        html = parts.join("\n");
      } catch {
        html = "";
      }
    } else if (id.startsWith("logbuch__")) {
      const slug = id.slice("logbuch__".length);
      const filePath = resolve(contentRoot, "logbuch", `${slug}.md`);
      const raw = await safeReadRaw(filePath);
      if (raw) {
        const { data, content } = matter(raw);
        label = (data.title as string) || slug;
        html = marked.parse(content) as string;
      }
    }

    entries.push({
      id,
      label,
      html: html || "<p>Keine Inhalte verfügbar.</p>",
    });
  }

  return { entries };
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
