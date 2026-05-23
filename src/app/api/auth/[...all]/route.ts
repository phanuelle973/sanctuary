import { NextRequest, NextResponse } from "next/server";

// Catch-all handler for any unmatched auth routes
export async function GET(request: NextRequest) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

