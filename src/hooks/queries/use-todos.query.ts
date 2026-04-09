/**
 * Hooks para queries (lectura) de TODOs.
 *
 * Proporciona hooks de React Query (useQuery) para obtener datos:
 * - Obtener lista completa de TODOs
 * - Obtener un TODO específico por ID
 *
 * Las claves de query están centralizadas para reusar en invalidateQueries.
 */
import { useQuery } from "@tanstack/react-query";
import { getAllTodos, getTodoById } from "@/actions/";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";


// ──────────────────────────────────────────
// GET ALL
// ──────────────────────────────────────────
export const useTodosQuery = (userId:string) =>
    useQuery<IGeneralResponse<ITodo[]>>({
        queryKey: ["todos", { userId }],
        queryFn: () => getAllTodos(),
        staleTime: 1000 * 60 * 60, 
    });

// ──────────────────────────────────────────
// GET ONE
// ──────────────────────────────────────────
export const useTodoQuery = (id: string) =>
    useQuery<IGeneralResponse<ITodo>>({
        queryKey: ["todos", { id }],
        queryFn: () => getTodoById(id),
        staleTime: 1000 * 60 * 60,
        enabled: !!id, // no ejecuta si id está vacío
    });
