import { NextResponse } from "next/server";
import * as authRequest from "@/services/external-api/auth";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const response = await authRequest.login(email, password);
    const { access_token, user } = response;

    if (!!access_token && !!user) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return NextResponse.json({
        success: true,
        user: user,
      });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    let message = "";

    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      message = error.response?.data?.message || "An error occurred";
    }

    return NextResponse.json(
      { error: "Internal server error", message: message },
      { status: 500 }
    );
  }
}
