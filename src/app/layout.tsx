import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
    generateAsyncTitle,
    generateAsyncDescription,
} from "@/lib/seo/metadataGenerator";
import TanStackQueryProvider from "@/components/providers/TanStackQueryProvider";
import { NavBar } from "@/components/layouts/root/nav-bar";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: await generateAsyncTitle("Todo's App"),
        description: await generateAsyncDescription(
            "Una aplicación de gestión de tareas (TODO) construida con Next.js, Prisma ORM y Supabase. Permite crear, actualizar, eliminar y marcar tareas como completadas de manera eficiente y sencilla.",
        ),
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                "scrollbar-gutter-stable",
                geistSans.variable,
                geistMono.variable,
                "font-mono",
                jetbrainsMono.variable,
            )}
        >
            <body className="dark min-h-full flex flex-col scrollbar-gutter-stable">
                <TanStackQueryProvider>
                    <NavBar />
                    {children}
                </TanStackQueryProvider>
            </body>
        </html>
    );
}
