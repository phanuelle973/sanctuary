// Neon Auth Client
// Direct integration with Neon Auth service

import { useState, useEffect } from "react";

export interface Session {
    user: {
        id: string;
        email: string;
        name: string;
        image?: string;
    };
    token: string;
}

export async function getSession(): Promise<Session | null> {
    try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error("Failed to get session:", error);
    }
    return null;
}

export async function signOut(options?: { fetchOptions?: { onSuccess?: () => void } }): Promise<void> {
    try {
        await fetch("/api/auth/sign-out", { method: "POST" });
        options?.fetchOptions?.onSuccess?.();
    } catch (error) {
        console.error("Failed to sign out:", error);
    }
}

export function useSession() {
    const [session, setSession] = useState<Session | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            setIsPending(true);
            const session = await getSession();
            setSession(session);
            setIsPending(false);
        };

        loadSession();
    }, []);

    return { data: session, isPending };
}

