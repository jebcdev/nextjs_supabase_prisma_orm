/**
 * Página para crear un nuevo TODO.
 *
 * Funcionalidades:
 * - Formulario reactivo con validación en tiempo real
 * - Auto-generación de slug a partir del título
 * - Interfaz visual atractiva con efectos de gradiente
 */
import type { Metadata } from "next";
import {
    generateAsyncTitle,
    generateAsyncDescription,
} from "@/lib/seo/metadataGenerator";
import { TodoFormNew } from "@/components/private/todos/TodoFormNew";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: await generateAsyncTitle("Crear Tarea"),
        description: await generateAsyncDescription(
            "Crea una nueva tarea para tu lista de pendientes.",
        ),
    };
}

export default function CreateTodoPage() {
    return (
        <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-background to-background">
            <main className="mx-auto max-w-2xl px-4 py-10 md:py-16">
                {/* Botón para volver */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 text-muted-foreground hover:text-foreground"
                    >
                        <Link
                            href="/"
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Volver al listado
                        </Link>
                    </Button>
                </div>

                {/* Encabezado de la página */}
                <div className="mb-10 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Nueva{" "}
                        <span className="text-primary">tarea</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Organiza tu día agregando un nuevo pendiente.
                        Asegúrate de ser descriptivo.
                    </p>
                </div>

                {/* Contenedor del Formulario con un toque de profundidad */}
                <section className="relative rounded-xl border bg-card p-6 shadow-sm md:p-8">
                    <div className="absolute -top-3 -right-3 h-24 w-24 bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-3 -left-3 h-24 w-24 bg-primary/10 blur-3xl" />

                    <div className="relative">
                        <TodoFormNew />
                    </div>
                </section>

                {/* Footer pequeño o nota */}
                <footer className="mt-8 text-center text-xs text-muted-foreground">
                    Tip: Usa un título corto y directo para
                    identificar tu tarea rápidamente.
                </footer>
            </main>
        </div>
    );
}
