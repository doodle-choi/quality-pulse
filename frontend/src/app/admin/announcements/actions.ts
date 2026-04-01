"use server";

import { INTERNAL_API_BASE_URL } from "@/config";
import { withAdminAuth } from "@/utils/withAdminAuth";
import { z } from "zod";
import xss from "xss";

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";

// Zod Schemas for Validation
const saveAnnouncementSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  is_published: z.boolean().default(false),
});

const deleteAnnouncementSchema = z.object({
  id: z.number().positive("Invalid announcement ID"),
});

// Original logic moved into private functions for wrapping
async function saveAnnouncementInternal(
  id: number | undefined,
  title: string,
  content: string,
  is_published: boolean
) {
  try {
    const url = id
      ? `${INTERNAL_API_BASE_URL}/announcements/${id}`
      : `${INTERNAL_API_BASE_URL}/announcements`;
    const method = id ? "PUT" : "POST";

    // Input Sanitization
    const sanitizedTitle = xss(title);
    const sanitizedContent = xss(content);

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": INTERNAL_API_KEY,
      },
      body: JSON.stringify({
        title: sanitizedTitle,
        content: sanitizedContent,
        is_published,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to save announcement: ${res.status}`);
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Save Announcement Action Error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to save announcement");
    }
    throw new Error("Failed to save announcement");
  }
}

async function deleteAnnouncementInternal(id: number) {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/announcements/${id}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": INTERNAL_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete announcement: ${res.status}`);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Delete Announcement Action Error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to delete announcement");
    }
    throw new Error("Failed to delete announcement");
  }
}

// Exported Actions wrapped with withAdminAuth and Zod validation
export const saveAnnouncementAction = withAdminAuth(
  "saveAnnouncement",
  async (
    id: number | undefined,
    title: string,
    content: string,
    is_published: boolean
  ) => {
    // Validate input with Zod
    const validated = saveAnnouncementSchema.parse({
      id,
      title,
      content,
      is_published,
    });
    return saveAnnouncementInternal(
      validated.id,
      validated.title,
      validated.content,
      validated.is_published
    );
  }
);

export const deleteAnnouncementAction = withAdminAuth(
  "deleteAnnouncement",
  async (id: number) => {
    // Validate input with Zod
    const validated = deleteAnnouncementSchema.parse({ id });
    return deleteAnnouncementInternal(validated.id);
  }
);
