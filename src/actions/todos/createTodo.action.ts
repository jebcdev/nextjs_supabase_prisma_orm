"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";
import { TodoCreateSchema } from "@/schemas";
import { getSessionDetails } from "../auth";

/**
 * Crea un nuevo TODO en la base de datos para el usuario autenticado.
 *
 * @param {Omit<ITodo, "id" | "createdAt" | "updatedAt" | "userId">} todo - Los datos del TODO a crear
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO creado o un mensaje de error
 *
 * @example
 * const result = await createTodo({ title: 'Mi tarea', slug: 'mi-tarea', description: '...', completed: false });
 * if (result.success) {
 *   console.log('TODO creado:', result.data);
 * }
 */
export const createTodo = async (
    todo: Omit<ITodo, "id" | "createdAt" | "updatedAt" | "userId">,
): Promise<IGeneralResponse<ITodo>> => {
    try {
        // 1. Validar sesión
        const { isAuthenticated, currentUser } =
            await getSessionDetails();
        if (!isAuthenticated || !currentUser) {
            return {
                success: false,
                error: true,
                message:
                    "No autorizado. Inicia sesión para continuar.",
            };
        }
        const userId = currentUser.id;

        // 2. Validar datos del TODO
        const validatedTodoData = TodoCreateSchema.safeParse(todo);
        if (!validatedTodoData.success) {
            return {
                error: true,
                success: false,
                message:
                    validatedTodoData.error.issues[0]?.message ||
                    "Datos de TODO no válidos",
            };
        }

        // 3. Crear TODO con userId del usuario autenticado
        const newTodo = await prismaDB.todo.create({
            data: {
                ...validatedTodoData.data,
                userId,
            },
        });

        return {
            success: true,
            message: "TODO creado exitosamente",
            data: newTodo,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            error: true,
            success: false,
            message: "Error al crear el TODO. Intenta de nuevo.",
        };
    }
};
