import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function GET() {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    const scope = "openid email profile";
    const state = Math.random().toString(36).substring(7);

    const params = new URLSearchParams({
        client_id: clientId || "",
        redirect_uri: redirectUri,
        response_type: "code",
        scope,
        state,
        access_type: "offline",
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    redirect(googleAuthUrl);
}
