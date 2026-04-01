export interface AuditLogEntry {
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ip?: string;
  details?: string;
}

export async function logAuditAction(entry: AuditLogEntry) {
  // In a real application, you would send this to your backend or a specialized logging service
  console.log(`[AUDIT LOG] ${entry.timestamp} | User: ${entry.userName} (${entry.userId}) | Action: ${entry.action} | IP: ${entry.ip || "unknown"}`);
  
  // Example: Sending to backend if needed
  // try {
  //   await fetch(`${INTERNAL_API_BASE_URL}/audit-logs`, { ... });
  // } catch (e) { console.error("Failed to persist audit log", e); }
}
