import { NEON_AUTH_ENDPOINT } from "@/lib/auth";
import type { NextRequest } from "next/server";

async function handler(request: NextRequest) {
    const pathname = new URL(request.url).pathname;
    const path = pathname.replace("/api/auth/", "");
    const url = new URL(request.url);
    const neonUrl = new URL(`${NEON_AUTH_ENDPOINT}/${path}${url.search}`);

    try {
        const response = await fetch(neonUrl.toString(), {
            method: request.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: request.method !== "GET" ? await request.text() : undefined,
        });

        return new Response(response.body, {
            status: response.status,
            headers: response.headers,
        });
    } catch (error) {
        console.error("Auth proxy error:", error);
        return new Response(JSON.stringify({ error: "Auth service error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export const GET = handler;
export const POST = handler;
