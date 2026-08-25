import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Read session cookie forwarded to backend
  const cookieHeader = request.headers.get("cookie") || "";

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999";
    const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const data = await res.json();
    return NextResponse.json({ authenticated: true, user: data.data });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: "Failed to fetch session" }, { status: 500 });
  }
}
