import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(null, { status: 401 });
        }

        // Decode the session token
        const session = JSON.parse(Buffer.from(token, "base64").toString());

        return NextResponse.json({
            user: {
                id: session.id,
                email: session.email,
                name: session.name,
                image: session.image,
            },
            token,
        });
    } catch (error) {
        console.error("Session error:", error);
        return NextResponse.json(null, { status: 401 });
    }
}
