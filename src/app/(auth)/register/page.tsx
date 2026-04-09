import { RegisterForm } from "@/components/public/auth";
import {
    generateAsyncDescription,
    generateAsyncTitle,
} from "@/lib/seo/metadataGenerator";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: await generateAsyncTitle("Registro"),
        description: await generateAsyncDescription(
            "Crea tu cuenta y comienza a gestionar tus tareas de manera eficiente. El registro es rápido y seguro, permitiéndote acceder a todas las herramientas que necesitas para organizar tu día y aumentar tu productividad.",
        ),
    };
}

export default function RegisterPage() {
    return (
        <>
            <RegisterForm />
        </>
    );
}
