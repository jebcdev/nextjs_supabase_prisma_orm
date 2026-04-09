import {
    generateAsyncTitle,
    generateAsyncDescription,
    generateTitle,
} from "@/lib/seo/metadataGenerator";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSessionDetails } from "@/actions/auth";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: await generateAsyncTitle("Autenticación"),
        description: await generateAsyncDescription(
            "Gestiona tu autenticación de manera segura y eficiente. Inicia sesión para acceder a tus tareas y proyectos, o regístrate para comenzar a organizar tu día con nuestra aplicación de gestión de tareas (TODO).",
        ),
    };
}

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated } = await getSessionDetails();

    if (isAuthenticated) redirect("/todos");

    return (
        <main className="min-h-screen flex flex-col items-center">
            {/* 🔝 Logo centrado horizontalmente */}
            <div className="w-full flex justify-center pt-6">
                <Link href={"/"}>
                    <Image
                        src={"/logo.png"}
                        alt="Logo"
                        width={30}
                        height={10}
                        priority
                        style={{ width: "auto", height: "auto" }}
                    />
                </Link>
            </div>

            {/* 🔥 Contenido centrado */}
            <div className="flex-1 flex justify-center items-start pt-16 px-4">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </main>
    );
}
