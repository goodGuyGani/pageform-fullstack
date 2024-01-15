//middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/"];
const loginRoutes = ["/login-register"];
export default function middleware(req: NextRequest) {
  let verify = req.cookies.get("name");
  let url = req.url;

  if (!verify && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/login-register", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());}

    if (verify && loginRoutes.includes(req.nextUrl.pathname)) {
      const absoluteURL = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());}
    }