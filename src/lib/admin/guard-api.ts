import { NextResponse } from "next/server";
import { AdminAuthError, requireAdmin } from "@/lib/auth";

export async function withAdmin<T>(
  handler: (admin: { id: string; email: string }) => Promise<T>
): Promise<T | NextResponse> {
  try {
    const admin = await requireAdmin();
    return await handler(admin);
  } catch (e) {
    if (e instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw e;
  }
}
