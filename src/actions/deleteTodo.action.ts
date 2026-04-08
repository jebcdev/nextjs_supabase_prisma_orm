"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";

/**
 * Elimina un TODO de la base de datos por su ID.
 *
 * @param {string} id - El ID único del TODO a eliminar
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO eliminado o un mensaje de error
 *
 * @example
 * const result = await deleteTodo('todo-id-123');
 * if (result.success) {
 *   console.log('TODO eliminado:', result.data);
 * }
 */
export const deleteTodo = async (
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

        const deletedTodo = await prismaDB.todo.delete({
            where: { id },
        });

        if (!deletedTodo) {
            return {
                error: true,
                success: false,
                message: "No se pudo eliminar el TODO",
            };
        }

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
