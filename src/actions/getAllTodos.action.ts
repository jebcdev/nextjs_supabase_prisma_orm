"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";

/**
 * Obtiene todos los TODOs de la base de datos.
 *
 * @returns {Promise<IGeneralResponse<ITodo[]>>} Una respuesta que contiene un arreglo de todos los TODOs o un mensaje de error
 *
 * @example
 * const result = await getAllTodos();
 * if (result.success) {
 *   console.log('TODOs obtenidos:', result.data);
 * }
 */
export const getAllTodos = async (): Promise<
    IGeneralResponse<ITodo[]>
> => {
    try {
        const todos = await prismaDB.todo.findMany({});

        if (!todos || todos.length === 0)
            return {
                error: true,
                success: false,
                message: "No se encontraron TODOs",
            };
        return {
            success: true,
            message: "TODOs obtenidos exitosamente",
            data: todos,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            error: true,
            success: false,
            message: "Ocurrio un error al obtener los TODOs",
        };
    }
};
