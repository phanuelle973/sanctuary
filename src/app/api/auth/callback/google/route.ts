import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL("/?error=no_code", request.url));
    }

    try {
        const headersList = await headers();
        const host = headersList.get("host") || "localhost:3000";
        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
        const baseUrl = `${protocol}://${host}`;

        // Exchange code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID || "",
                client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
                redirect_uri: `${baseUrl}/api/auth/callback/google`,
                grant_type: "authorization_code",
            }).toString(),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error("Token exchange failed:", tokenResponse.status, errorData);
            console.error("Request details:", {
                client_id: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "...",
                redirect_uri: `${baseUrl}/api/auth/callback/google`,
                code: code?.substring(0, 10) + "...",
            });
            return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url));
        }

        const { access_token } = await tokenResponse.json();

        // Get user info
        const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!userResponse.ok) {
            return NextResponse.redirect(new URL("/?error=user_info_failed", request.url));
        }

        const user = await userResponse.json();

        // Store session in httpOnly cookie
        const response = NextResponse.redirect(new URL("/", request.url));

        // Create session token (in production, use proper JWT signing)
        const sessionToken = Buffer.from(JSON.stringify({
            id: user.sub,
            email: user.email,
            name: user.name,
            image: user.picture,
            iat: Date.now(),
        })).toString("base64");

        response.cookies.set("auth_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(new URL("/?error=callback_error", request.url));
    }
}
