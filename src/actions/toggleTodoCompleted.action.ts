"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";

/**
 * Cambia el estado de completitud de un TODO (toggle entre completado y no completado).
 *
 * @param {string} id - El ID único del TODO cuyo estado se desea cambiar
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO actualizado o un mensaje de error
 *
 * @example
 * const result = await toggleTodoCompleted('todo-id-123');
 * if (result.success) {
 *   console.log('TODO actualizado:', result.data);
 * }
 */
export const toggleTodoCompleted = async (
    id: string,
): Promise<IGeneralResponse<ITodo>> => {
    try {
        if (!id || typeof id !== "string") {
            return {
                error: true,
                success: false,
                message: "ID del TODO no válido",
            };
        }

        const todo = await prismaDB.todo.findUnique({
            where: { id },
        });

        if (!todo) {
            return {
                error: true,
                success: false,
                message: "El TODO no existe",
            };
        }

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
                "Ocurrio un error al actualizar el estado del TODO",
        };
    }
};
