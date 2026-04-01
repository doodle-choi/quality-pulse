"use server";

import { INTERNAL_API_BASE_URL } from "@/config";

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";

export async function saveAnnouncementAction(
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

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": INTERNAL_API_KEY,
      },
      body: JSON.stringify({
        title,
        content,
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

export async function deleteAnnouncementAction(id: number) {
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
