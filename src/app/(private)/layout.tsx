import type { Metadata } from "next";
import {
    generateAsyncTitle,
    generateAsyncDescription,
} from "@/lib/seo/metadataGenerator";

import { getSessionDetails } from "@/actions";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: await generateAsyncTitle("Todo's App"),
        description: await generateAsyncDescription(
            "Una aplicación de gestión de tareas (TODO) construida con Next.js, Prisma ORM y Supabase. Permite crear, actualizar, eliminar y marcar tareas como completadas de manera eficiente y sencilla.",
        ),
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated } = await getSessionDetails();
    if (!isAuthenticated) redirect("/");

    return <main className={`p-0.5 antialiased`}>{children}</main>;
}
