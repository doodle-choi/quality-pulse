"use server";

import { INTERNAL_API_BASE_URL } from "@/config";
import { withAdminAuth } from "@/utils/withAdminAuth";
import { z } from "zod";

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";

// Zod Schemas
const updateIntervalSchema = z.object({
  hours: z.number().min(1, "Minimum 1 hour").max(168, "Maximum 1 week (168 hours)"),
});

// Internal Functions
async function fetchStatusInternal() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/scheduler/status`, {
      method: "GET",
      headers: {
        "X-API-Key": INTERNAL_API_KEY,
        "Cache-Control": "no-store",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch status: ${res.status}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch status");
    }
    throw new Error("Failed to fetch status");
  }
}

async function triggerPipelineInternal() {
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
  } catch (error: unknown) {
    console.error("Trigger Action Error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to trigger pipeline");
    }
    throw new Error("Failed to trigger pipeline");
  }
}

async function updateIntervalInternal(hours: number) {
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
  } catch (error: unknown) {
    console.error("Update Interval Action Error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to update interval");
    }
    throw new Error("Failed to update interval");
  }
}

// Exported Actions
export const fetchStatusAction = withAdminAuth(
  "fetchSchedulerStatus",
  fetchStatusInternal
);

export const triggerPipelineAction = withAdminAuth(
  "triggerPipeline",
  triggerPipelineInternal
);

export const updateIntervalAction = withAdminAuth(
  "updateSchedulerInterval",
  async (hours: number) => {
    const validated = updateIntervalSchema.parse({ hours });
    return updateIntervalInternal(validated.hours);
  }
);
