import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompleted,
} from "@/actions/";
import { ITodo } from "@/types/";
import { TTodoCreateData } from "@/schemas/";

// ──────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────
export const useCreateTodoMutation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TTodoCreateData) => createTodo(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos", { userId }],
            });
        },
    });
};

// ──────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────
export const useUpdateTodoMutation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            data: Partial<Omit<ITodo, "createdAt" | "updatedAt">>,
        ) => updateTodo(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos", { userId }],
            });
        },
    });
};

// ──────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────
export const useDeleteTodoMutation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTodo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos", { userId }],
            });
        },
    });
};

// ──────────────────────────────────────────
// TOGGLE COMPLETED
// ──────────────────────────────────────────
export const useToggleTodoMutation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => toggleTodoCompleted(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos", { userId }],
            });
        },
    });
};