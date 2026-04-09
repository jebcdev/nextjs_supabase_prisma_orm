"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";
import { validateTodoOwnership } from "@/lib/auth/auth-helpers";
import { uuidSchema } from "@/schemas";

/**
 * Obtiene un TODO específico del usuario autenticado por su ID.
 *
 * @param {string} id - El ID único del TODO a obtener
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO o un mensaje de error
 *
 * @example
 * const result = await getTodoById('550e8400-e29b-41d4-a716-446655440000');
 * if (result.success) {
 *   console.log('TODO encontrado:', result.data);
 * }
 */
export const getTodoById = async (
    id: string,
): Promise<IGeneralResponse<ITodo>> => {
    try {
        // 1. Validar formato del ID
        const idValidation = uuidSchema.safeParse(id);
        if (!idValidation.success) {
            return {
                error: true,
                success: false,
                message: "ID del TODO no es válido",
            };
        }

        // 2. Validar sesión y propiedad del TODO
        const authResult = await validateTodoOwnership(id);
        if (!authResult) {
            return {
                error: true,
                success: false,
                message:
                    "No autorizado. No tienes permiso para ver este TODO.",
            };
        }

        // 3. Obtener el TODO
        const todo = await prismaDB.todo.findUnique({
            where: { id },
        });

        if (!todo) {
            return {
                error: true,
                success: false,
                message: "TODO no encontrado",
            };
        }

        return {
            success: true,
            message: "TODO obtenido exitosamente",
            data: todo,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            error: true,
            success: false,
            message: "Error al obtener el TODO. Intenta de nuevo.",
        };
    }
};
