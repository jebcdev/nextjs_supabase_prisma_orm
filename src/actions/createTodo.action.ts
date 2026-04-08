"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";
import { TodoCreateSchema } from "@/schemas/todo.schema";

/**
 * Crea un nuevo TODO en la base de datos.
 *
 * @param {Omit<ITodo, "id" | "createdAt" | "updatedAt">} todo - Los datos del TODO a crear (sin id, createdAt ni updatedAt)
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO creado o un mensaje de error
 *
 * @example
 * const result = await createTodo({ title: 'Mi tarea', completed: false });
 * if (result.success) {
 *   console.log('TODO creado:', result.data);
 * }
 */
export const createTodo = async (
    todo: Omit<ITodo, "id" | "createdAt" | "updatedAt">,
): Promise<IGeneralResponse<ITodo>> => {
    try {
        const validatedTodoData =
            await TodoCreateSchema.safeParse(todo);
        if (!validatedTodoData.success) {
            return {
                error: true,
                success: false,
                message: "Datos de TODO no válidos",
            };
        }

        const newTodo = await prismaDB.todo.create({
            data: validatedTodoData.data,
        });

        if (!newTodo) {
            return {
                error: true,
                success: false,
                message: "No se pudo crear el TODO",
            };
        }

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
            message: "Ocurrio un error al crear el TODO",
        };
    }
};
