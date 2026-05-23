"use client";

import { useState } from "react";
import { Chrome } from "lucide-react";

export default function LoginView() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);
            // Redirect to Google OAuth consent screen
            // After setup, this will be handled by your backend
            window.location.href = "/api/auth/signin/google";
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
            <div style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                        <em>Sanctuary</em>
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                        Your spiritual wellness companion
                    </p>
                </div>

                {/* Login Card */}
                <div className="card" style={{ padding: "2rem" }}>
                    <h2 style={{ marginBottom: "1.5rem", textAlign: "center", fontSize: "1.25rem", fontWeight: 600 }}>
                        Welcome Back
                    </h2>

                    {error && (
                        <div
                            style={{
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid #ef4444",
                                borderRadius: "0.5rem",
                                padding: "0.75rem",
                                marginBottom: "1rem",
                                fontSize: "0.875rem",
                                color: "#dc2626",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            backgroundColor: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            borderRadius: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                            transition: "all 0.2s",
                            fontSize: "1rem",
                            fontWeight: 500,
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                        }}
                    >
                        <Chrome size={18} />
                        {loading ? "Signing in..." : "Sign in with Google"}
                    </button>

                    <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
