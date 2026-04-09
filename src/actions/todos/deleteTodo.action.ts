"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";
import { getSessionDetails } from "../auth";
import { uuidSchema } from "@/schemas";
import { validateTodoOwnership } from "@/lib/auth/auth-helpers";

/**
 * Elimina un TODO del usuario autenticado por su ID.
 *
 * @param {string} id - El ID único del TODO a eliminar
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO eliminado o un mensaje de error
 *
 * @example
 * const result = await deleteTodo('550e8400-e29b-41d4-a716-446655440000');
 * if (result.success) {
 *   console.log('TODO eliminado:', result.data);
 * }
 */
export const deleteTodo = async (
    id: string,
): Promise<IGeneralResponse<ITodo>> => {
    try {
        // 1. Validar formato del ID
        const { currentUser, isAuthenticated } =
            await getSessionDetails();
        if (!isAuthenticated || !currentUser) {
            return {
                success: false,
                error: true,
                message:
                    "No autorizado. Inicia sesión para continuar.",
            };
        }

        // 2. Validar sesión y propiedad del TODO
        const authResult = await validateTodoOwnership(id);
        if (!authResult) {
            return {
                success: false,
                error: true,
                message:
                    "No autorizado. No tienes permiso para eliminar este TODO.",
            };
        }

        // 3. Eliminar TODO
        const deletedTodo = await prismaDB.todo.delete({
            where: { id },
        });

        return {
            success: true,
            message: "TODO eliminado exitosamente",
            data: deletedTodo,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            error: true,
            success: false,
            message: "Ocurrio un error al eliminar el TODO",
        };
    }
};
