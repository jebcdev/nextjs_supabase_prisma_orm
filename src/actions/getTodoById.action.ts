"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";

/**
 * Obtiene un TODO específico de la base de datos por su ID.
 *
 * @param {string} id - El ID único del TODO a obtener
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO encontrado o un mensaje de error
 *
 * @example
 * const result = await getTodoById('todo-id-123');
 * if (result.success) {
 *   console.log('TODO encontrado:', result.data);
 * }
 */
export const getTodoById = async (
    id: string,
): Promise<IGeneralResponse<ITodo>> => {
    try {
        const todo = await prismaDB.todo.findUnique({
            where: { id },
        });

        if (!todo)
            return {
                error: true,
                success: false,
                message: "No se encontró el TODO",
            };
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
            message: "Ocurrio un error al obtener el TODO",
        };
    }
};
