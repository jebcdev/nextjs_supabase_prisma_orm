import { LoginForm } from "@/components/public/auth/LoginForm";
import { generateAsyncDescription, generateAsyncTitle } from "@/lib/seo/metadataGenerator";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: await generateAsyncTitle("Iniciar Sesión"),
        description: await generateAsyncDescription(
            "Inicia sesión en tu cuenta para acceder a tus tareas y gestionar tu día de manera eficiente. La autenticación es segura y rápida, permitiéndote concentrarte en lo que realmente importa: tus tareas y proyectos.",
        ),
    };
}

export default function LoginPage() {
    return (
        <>
        <LoginForm />
        </>
    );
}
