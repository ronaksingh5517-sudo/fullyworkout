// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const { pathname } = req.nextUrl;

//   // Public routes jo bina login ke access ho sakein
//   const isPublicRoute = 
//     pathname === "/" || 
//     pathname === "/login" || 
//     pathname.startsWith("/api") || 
//     pathname.startsWith("/_next") || 
//     pathname.includes(".");

//   // Agar user logged in nahi hai aur public route par nahi hai, toh use home (/) par bhej do
//   if (!token && !isPublicRoute) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };








import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // Agar request is specific ngrok domain ya host se aa rahi hai, toh sabhi restrictions hata do
  const isNgrokBypass = host.includes("headlamp-fit-swarm.ngrok-free.dev");

  if (isNgrokBypass) {
    return NextResponse.next();
  }

  // Public routes jo bina login ke access ho sakein
  const isPublicRoute = 
    pathname === "/" || 
    pathname === "/login" || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/_next") || 
    pathname.includes(".");

  // Agar user logged in nahi hai aur public route par nahi hai, toh use home (/) par bhej do
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};