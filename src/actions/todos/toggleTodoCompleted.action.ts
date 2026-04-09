"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";
import { validateTodoOwnership } from "@/lib/auth/auth-helpers";
import { uuidSchema } from "@/schemas";

/**
 * Cambia el estado de completitud de un TODO del usuario autenticado.
 *
 * @param {string} id - El ID único del TODO cuyo estado se desea cambiar
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO actualizado o un mensaje de error
 *
 * @example
 * const result = await toggleTodoCompleted('550e8400-e29b-41d4-a716-446655440000');
 * if (result.success) {
 *   console.log('TODO actualizado:', result.data);
 * }
 */
export const toggleTodoCompleted = async (
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
                    "No autorizado. No tienes permiso para actualizar este TODO.",
            };
        }

        // 3. Obtener el TODO actual para saber su estado
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

        // 4. Cambiar estado
        const toggledTodo = await prismaDB.todo.update({
            where: { id },
            data: { completed: !todo.completed },
        });

        return {
            success: true,
            message: "TODO actualizado exitosamente",
            data: toggledTodo,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            error: true,
            success: false,
            message:
                "Error al actualizar el estado del TODO. Intenta de nuevo.",
        };
    }
};
