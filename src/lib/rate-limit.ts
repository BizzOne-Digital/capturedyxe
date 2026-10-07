import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { RateLimit } from "@/models/RateLimit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;

export async function checkRateLimit(
  key: string
): Promise<{ allowed: boolean; retryAfterSec?: number }> {
  if (!isDatabaseConfigured()) {
    return { allowed: true };
  }

  await connectDB();
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);

  const record = await RateLimit.findOne({ key });
  if (!record) {
    await RateLimit.create({ key, count: 1, windowStart: now });
    return { allowed: true };
  }

  if (record.windowStart < windowStart) {
    record.count = 1;
    record.windowStart = now;
    await record.save();
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS) {
    const retryAfterSec = Math.ceil(
      (record.windowStart.getTime() + WINDOW_MS - now.getTime()) / 1000
    );
    return { allowed: false, retryAfterSec };
  }

  record.count += 1;
  await record.save();
  return { allowed: true };
}
