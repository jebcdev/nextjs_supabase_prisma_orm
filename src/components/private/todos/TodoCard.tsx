/**
 * Componente de tarjeta (card) para mostrar un TODO individual.
 *
 * Muestra:
 * - Título con icono de estado (completado/incompleto)
 * - Descripción corta del TODO
 * - Slug y fecha de creación
 * - Botones de acción (ver detalles, editar, eliminar, cambiar estado)
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    Circle,
} from "lucide-react";
import { toast } from "sonner";
import { ITodo } from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    useToggleTodoMutation,
    useDeleteTodoMutation,
} from "@/hooks/mutations/use-todos.mutation";
import { consoleLogger } from "@/lib/logger/console-logger";

interface IProps {
    todo: ITodo;
    currentUserId: string; // Opcional, por si se necesita para validaciones adicionales
}

export const TodoCard = ({ todo, currentUserId }: IProps) => {
    const router = useRouter();
    const [isToggling, setIsToggling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteMutation = useDeleteTodoMutation(currentUserId);
    const toggleMutation = useToggleTodoMutation(currentUserId);

    const handleToggleCompleted = async () => {
        if (!todo.id) {
            toast.error("ID de tarea no válido");
            return;
        }
        setIsToggling(true);
        try {
            await toggleMutation.mutateAsync(todo.id);
        } catch (error) {
            consoleLogger({ error });
            toast.error("No se pudo cambiar el estado de la tarea");
        } finally {
            setIsToggling(false);
        }
    };

    const handleDelete = () => {
        if (!todo.id) {
            toast.error("ID de tarea no válido");
            return;
        }
        const confirmed = window.confirm(
            `¿Estás seguro de que deseas eliminar "${todo.title}"?`,
        );

        if (!confirmed) return;

        setIsDeleting(true);
        deleteMutation.mutate(todo.id, {
            onSuccess: () => {
                toast.success("Tarea eliminada exitosamente");
                router.push("/todos");
            },
            onError: (error) => {
                toast.error(
                    error?.message || "No se pudo eliminar la tarea",
                );
                setIsDeleting(false);
            },
        });
    };

    const handleViewDetails = () => {
        router.push(`/todos/${todo.id}`);
    };

    const handleEdit = () => {
        router.push(`/todos/${todo.id}/edit`);
    };
    return (
        <Card className="w-full transition-all duration-200 hover:shadow-md group border-l-4 border-l-primary/20">
            <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-4 space-y-0">
                <div className="space-y-1.5 w-full">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                        <CardTitle className="text-xl font-bold truncate leading-none">
                            {todo.title}
                        </CardTitle>
                        <button
                            onClick={handleToggleCompleted}
                            disabled={isToggling || isDeleting}
                            className={`shrink-0 uppercase text-[10px] tracking-wider px-2.5 py-0.5 rounded-full font-medium inline-flex items-center justify-center transition-colors cursor-pointer ${
                                todo.completed
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                            } ${isToggling || isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={
                                todo.completed
                                    ? "Marcar como pendiente"
                                    : "Marcar como completada"
                            }
                        >
                            {todo.completed
                                ? "Completado"
                                : "Pendiente"}
                        </button>
                    </div>
                    <CardDescription className="line-clamp-2 min-h-10">
                        {todo.description ||
                            "Sin descripción adicional."}
                    </CardDescription>
                </div>

                {/* Botón de estado (Toggle) */}
                <Button
                    onClick={handleToggleCompleted}
                    disabled={isToggling || isDeleting}
                    variant="ghost"
                    size="icon"
                    className={`shrink-0 rounded-full transition-colors ${
                        todo.completed
                            ? "text-green-500 hover:text-green-600 hover:bg-green-50"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                    title={
                        todo.completed
                            ? "Marcar como pendiente"
                            : "Marcar como completada"
                    }
                >
                    {isToggling ? (
                        <Circle className="h-6 w-6 animate-spin" />
                    ) : todo.completed ? (
                        <CheckCircle2 className="h-6 w-6" />
                    ) : (
                        <Circle className="h-6 w-6" />
                    )}
                </Button>
            </CardHeader>

            <CardContent>
                <div className="text-[11px] text-muted-foreground flex gap-4">
                    <span>
                        ID:{" "}
                        <span className="font-mono bg-muted px-1 rounded">
                            {todo.slug}
                        </span>
                    </span>
                </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/30 px-6 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                <div className="flex w-full sm:w-auto items-center gap-2">
                    {/* Botón Ver - Azul */}
                    <Button
                        onClick={handleViewDetails}
                        disabled={isToggling || isDeleting}
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                        <span className="inline sm:hidden lg:inline">
                            Ver
                        </span>
                    </Button>

                    {/* Botón Editar - Ámbar/Naranja */}
                    <Button
                        onClick={handleEdit}
                        disabled={isToggling || isDeleting}
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none gap-2 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
                    >
                        <Pencil className="h-4 w-4" />
                        <span className="inline sm:hidden lg:inline">
                            Editar
                        </span>
                    </Button>
                </div>

                {/* Botón Eliminar - Rojo (Destructive) */}
                <Button
                    onClick={handleDelete}
                    disabled={isToggling || isDeleting}
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto gap-2 shadow-sm"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sm:hidden lg:inline">
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
};
