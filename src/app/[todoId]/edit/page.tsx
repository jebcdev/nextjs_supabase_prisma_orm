/**
 * Página para editar un TODO existente.
 *
 * Muestra un formulario prerrelleno con los datos del TODO actual.
 * Permite actualizar título, descripción y estado de completitud.
 */
"use server";

import { getTodoById } from "@/actions";
import { TodoFormEdit } from "@/components/todos/TodoFormEdit";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditTodoPageProps {
    params: Promise<{ todoId: string }>;
}

export default async function EditTodoPage({
    params,
}: EditTodoPageProps) {
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
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <TodoFormEdit initialTodo={todo} />
        </div>
    );
}
