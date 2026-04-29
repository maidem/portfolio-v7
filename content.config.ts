import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: "page",
      source: "projects/*.md",
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        date: z.string(),
        description: z.string(),
        image: z.string().optional(),
        technologies: z.array(z.string()).optional(),
        github: z.string().optional(),
        live: z.string().optional(),
      }),
    }),
    logbuch: defineCollection({
      type: "page",
      source: "logbuch/*.md",
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        date: z.string(),
        description: z.string(),
        tags: z.array(z.string()).optional(),
      }),
    }),
    pages: defineCollection({
      type: "page",
      source: "*.md",
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        faqItems: z
          .array(
            z.object({
              question: z.string(),
              answer: z.string(),
            }),
          )
          .optional(),
        skillGroups: z
          .array(
            z.object({
              category: z.string(),
              items: z.array(z.string()),
            }),
          )
          .optional(),
      }),
    }),
  },
});
