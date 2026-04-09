"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function getSessionDetails() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isAuthenticated = !!session;

    const currentUser = session?.user || null;
    const currentSession = session?.session || null;

    return {
        isAuthenticated,

        currentUser,
        currentSession,
    };
}
