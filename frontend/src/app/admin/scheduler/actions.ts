"use server";

import { INTERNAL_API_BASE_URL } from "@/config";

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";

export async function triggerPipelineAction() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/scheduler/trigger`, {
      method: "POST",
      headers: {
        "X-API-Key": INTERNAL_API_KEY,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to trigger: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("Trigger Action Error:", error);
    throw new Error(error.message || "Failed to trigger pipeline.");
  }
}

export async function updateIntervalAction(hours: number) {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/scheduler/config`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": INTERNAL_API_KEY,
      },
      body: JSON.stringify({ hours }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to update interval: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("Update Interval Action Error:", error);
    throw new Error(error.message || "Failed to update interval.");
  }
}
