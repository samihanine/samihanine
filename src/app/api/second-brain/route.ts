import { NextResponse, NextRequest } from "next/server";
import z from "zod";
import { Client } from "@notionhq/client";

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
  "cuisine",
  "neuroscience",
  "architecture",
  "physics and chemistry",
  "astronomy",
  "important person",
  "entrepreneurship",
  "french linguistics",
  "english linguistics",
  "other",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const databaseId = process.env.NOTION_DATABASE_ID as string;

    const schema = z.array(
      z.object({
        topic: z.enum(topics as [string, ...string[]]).default("other"),
        title: z.string(),
        markdown: z.string(),
      })
    );

    if (!schema.safeParse(body).success) {
      return NextResponse.json(
        {
          message: "title and markdown are required",
          success: false,
        },
        { status: 400 }
      );
    }

    const array = schema.parse(body);

    for (const { topic, title, markdown } of array) {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Title: {
            title: [{ text: { content: title } }],
          },
          Topic: {
            select: { name: topic || "other" },
          },
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: markdown } }],
            },
          },
        ],
      });

      return NextResponse.json(
        {
          message: "success",
          success: true,
        },
        { status: 200 }
      );
    }
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
