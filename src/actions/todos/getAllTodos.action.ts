"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";


/**
 * Obtiene todos los TODOs del usuario autenticado.
 *
 * @returns {Promise<IGeneralResponse<ITodo[]>>} Una respuesta que contiene los TODOs del usuario o un mensaje de error
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
        // 1. Validar sesión
        const sessionResult = await validateSession();
        if ("message" in sessionResult) {
            return sessionResult;
        }
        const { userId } = sessionResult;

        // 2. Obtener todos los TODOs del usuario autenticado
        const todos = await prismaDB.todo.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return {
            success: true,
            message:
                todos.length === 0
                    ? "No tienes TODOs aún"
                    : "TODOs obtenidos exitosamente",
            data: todos,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            error: true,
            success: false,
            message: "Error al obtener los TODOs. Intenta de nuevo.",
        };
    }
};
