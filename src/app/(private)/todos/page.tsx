/**
 * Página principal de la aplicación Todo's App.
 *
 * Funcionalidades:
 * - Listado principal de todos los TODOs
 * - Búsqueda y filtrado en tiempo real
 * - SEO: Genera metadatos dinámicos
 * - Responsive: Se adapta a todos los tamaños de pantalla
 */
import type { Metadata } from "next";
import {
    generateAsyncTitle,
    generateAsyncDescription,
} from "@/lib/seo/metadataGenerator";
import { getSessionDetails } from "@/actions";

import { TodosGrid } from "@/components/private/todos/TodoGrid";
import { Suspense } from "react";
import { NoData } from "@/components/ui";


export async function generateMetadata(): Promise<Metadata> {
    return {
        title: await generateAsyncTitle("Todo's App"),
        description: await generateAsyncDescription(
            "Una aplicación de gestión de tareas (TODO) construida con Next.js, Prisma ORM y Supabase. Permite crear, actualizar, eliminar y marcar tareas como completadas de manera eficiente y sencilla.",
        ),
    };
}

// src/app/page.tsx
export default async function HomePage() {
    const { currentUser } = await getSessionDetails();

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 w-full">
            <div className="mb-8 w-full">
                <h1 className="font-mono text-2xl font-medium tracking-tight">
                    Mis tareas
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Gestiona tu día como el dev que eres
                </p>
            </div>
            <div className="w-full">
                <Suspense fallback={<div>Cargando tareas...</div>}>
                    {
                        currentUser ? (
                            <TodosGrid currentUserId={currentUser.id} />
                        ) : (
                            <NoData />
                        )

                    }
                </Suspense>
            </div>
        </main>
    );
}
