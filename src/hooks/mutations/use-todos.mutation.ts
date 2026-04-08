/**
 * Hooks para mutaciones de TODOs.
 *
 * Proporciona hooks de React Query (useMutation) para operaciones que modifican datos:
 * - Crear nuevos TODOs
 * - Actualizar TODOs existentes
 * - Eliminar TODOs
 * - Cambiar estado de completitud
 *
 * Cada mutation invalida automáticamente el cache para refrescar datos.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompleted,
} from "@/actions/";
import { ITodo } from "@/types/";
import { TTodoCreateData } from "@/schemas/";
import { todoKeys } from "../queries/use-todos.query";

// ──────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────
export const useCreateTodoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TTodoCreateData) => createTodo(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: todoKeys.all(),
            });
        },
    });
};

// ──────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────
export const useUpdateTodoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            data: Partial<Omit<ITodo, "createdAt" | "updatedAt">>,
        ) => updateTodo(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: todoKeys.all(),
            });
        },
    });
};

// ──────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────
export const useDeleteTodoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTodo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: todoKeys.all(),
            });
        },
    });
};

// ──────────────────────────────────────────
// TOGGLE COMPLETED
// ──────────────────────────────────────────
export const useToggleTodoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => toggleTodoCompleted(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: todoKeys.all(),
            });
        },
    });
};
