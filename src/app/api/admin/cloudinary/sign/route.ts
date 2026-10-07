import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { withAdmin } from "@/lib/admin/guard-api";
import { isCloudinaryConfigured } from "@/lib/cloudinary";


export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 });
    }
    const body = await req.json().catch(() => ({}));
    const folder = typeof body.folder === "string" ? body.folder : "captured-yxe";

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  });
}
