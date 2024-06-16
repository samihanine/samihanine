import { NextResponse, NextRequest } from "next/server";
import z from "zod";
import { Client } from "@notionhq/client";
import { markdownToRichText } from "@tryfabric/martian";

const notion = new Client({ auth: process.env.NOTION_KEY });

const topics = [
  "psychology",
  "sociology",
  "philosophy",
  "critical thinking",
  "geo-politics",
  "history",
  "geography",
  "web programming",
  "artificial intelligence",
  "cybersecurity",
  "cooking",
  "neuroscience",
  "architecture",
  "physics and chemistry",
  "astronomy",
  "important person",
  "entrepreneurship",
  "french linguistics",
  "english linguistics",
  "ideas of projects",
  "books",
  "movies",
  "tv shows",
  "music",
  "dream journal",
  "life goals",
  "other",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const databaseId = process.env.NOTION_DATABASE_ID as string;

    const schema = z.object({
      data: z.array(
        z.object({
          topic: z.enum(topics as [string, ...string[]]).default("other"),
          title: z.string(),
          markdown: z.string(),
          keywords: z.string(),
          source: z.string().optional(),
        })
      ),
    });

    if (!schema.safeParse(body).success) {
      return NextResponse.json(
        {
          message: "title and markdown are required",
          success: false,
        },
        { status: 400 }
      );
    }

    const items = body.data;

    for (const { title, markdown, topic, keywords, source } of items) {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Title: {
            title: [{ text: { content: title } }],
          },
          Topic: {
            select: { name: topic || "other" },
          },
          Keywords: {
            title: [{ type: "text", text: { content: keywords } }],
          },
          Source: {
            title: [{ type: "text", text: { content: source } }],
          },
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: markdownToRichText(markdown),
            },
          },
        ],
      });
    }

    return NextResponse.json(
      {
        message: "success",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error)?.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
