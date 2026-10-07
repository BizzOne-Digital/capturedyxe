import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { loginAdmin } from "@/lib/auth";


export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  try {
    const result = await loginAdmin(parsed.data.email, parsed.data.password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Authentication is not configured. Set AUTH_SECRET in .env." },
      { status: 500 }
    );
  }
}
