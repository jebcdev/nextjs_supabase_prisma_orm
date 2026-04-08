/**
 * Página de detalles de un TODO individual.
 *
 * Muestra la información completa de un TODO específico, incluyendo:
 * - Título, descripción y estado de completitud
 * - Botones de acción (editar, eliminar, cambiar estado)
 * - Link para volver al listado principal
 * - Manejo de errores si el TODO no existe
 */
"use server";

import { getTodoById } from "@/actions";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TodoDetailPageProps {
    params: Promise<{ todoId: string }>;
}

export default async function TodoDetailPage({
    params,
}: TodoDetailPageProps) {
    const { todoId } = await params;
    const result = await getTodoById(todoId);

    if (!result.success || !result.data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-primary hover:underline mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                </Link>
                <div className="text-center">
                    <p className="text-destructive">
                        {result.message || "Tarea no encontrada"}
                    </p>
                </div>
            </div>
        );
    }

    const todo = result.data;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                href="/"
                className="flex items-center gap-2 text-primary hover:underline mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver al listado
            </Link>

            <div className="max-w-2xl mx-auto">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">
                                {todo.title}
                            </h1>
                            <p className="text-sm text-muted-foreground mb-4 font-mono">
                                {todo.slug}
                            </p>
                        </div>
                        <Badge
                            variant={
                                todo.completed
                                    ? "default"
                                    : "secondary"
                            }
                            className={`shrink-0 uppercase text-xs tracking-wider ${
                                todo.completed
                                    ? "bg-green-500 hover:bg-green-600"
                                    : ""
                            }`}
                        >
                            {todo.completed
                                ? "Completada"
                                : "Pendiente"}
                        </Badge>
                    </div>

                    <div className="prose prose-sm max-w-none mb-6">
                        <p className="text-muted-foreground">
                            {todo.description ||
                                "Sin descripción adicional."}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t flex-wrap">
                        <span className="text-xs text-muted-foreground">
                            <span className="font-semibold">
                                Creada:
                            </span>{" "}
                            {new Date(
                                todo.createdAt || 0,
                            ).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            <span className="font-semibold">
                                Actualizada:
                            </span>{" "}
                            {new Date(
                                todo.updatedAt || 0,
                            ).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t">
                        <Link href={`/${todo.id}/edit`}>
                            <Button
                                variant="outline"
                                className="gap-2"
                            >
                                <Pencil className="h-4 w-4" />
                                Editar
                            </Button>
                        </Link>
                        {/* Delete button will be handled client-side via a separate component if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
}
