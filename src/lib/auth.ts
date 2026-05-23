// Neon Auth Configuration
// Using Neon's built-in authentication service
// Configure these in your environment variables

export const NEON_AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000";
export const NEON_AUTH_ENDPOINT = process.env.NEXT_PUBLIC_NEON_AUTH_URL ||
    "https://ep-frosty-river-ap9rkxon.neonauth.c-7.us-east-1.aws.neon.tech/neondb/auth";
export const NEON_JWKS_URL = process.env.NEXT_PUBLIC_NEON_JWKS_URL ||
    "https://ep-frosty-river-ap9rkxon.neonauth.c-7.us-east-1.aws.neon.tech/neondb/auth/.well-known/jwks.json";

// Google OAuth configuration
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
