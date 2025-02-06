import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl
                //alow auth related paths
                if (pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register") {
                    return true
                }

                //Public
                if (pathname === "/" || pathname.startsWith("/api/videos")) {
                    return true
                }

                return !!token
            }
        }
    }
)

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}