import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const pageCookies = await cookies();
  const token = pageCookies.get("auth_token")?.value;
  
  // Extrair a URL base da requisição atual
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  if (token) {
    return NextResponse.redirect(`${baseUrl}/courses`);
  } else {
    return NextResponse.redirect(`${baseUrl}/login`);
  }
}
