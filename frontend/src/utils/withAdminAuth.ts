import { auth } from "@/auth";
import { logAuditAction } from "./auditLogger";
import { headers } from "next/headers";

type ActionFunc<T extends any[], R> = (...args: T) => Promise<R>;

export function withAdminAuth<T extends any[], R>(
  actionName: string,
  action: ActionFunc<T, R>
): ActionFunc<T, R> {
  return async (...args: T): Promise<R> => {
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: Authentication required");
    }

    if ((session.user as any).role !== "ADMIN") {
      throw new Error("Forbidden: Admin privileges required");
    }

    // Capture IP from headers
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Log the sensitive action
    await logAuditAction({
      userId: session.user.id || "unknown",
      userName: session.user.name || session.user.email || "unknown",
      action: actionName,
      timestamp: new Date().toISOString(),
      ip: ip,
    });

    return action(...args);
  };
}
