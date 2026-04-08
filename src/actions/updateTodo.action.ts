"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";
import { TodoUpdateSchema } from "@/schemas/todo.schema";

/**
 * Actualiza los datos de un TODO existente en la base de datos.
 *
 * @param {Partial<Omit<ITodo, "createdAt" | "updatedAt">>} todo - Los datos parciales del TODO a actualizar (incluyendo el ID)
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO actualizado o un mensaje de error
 *
 * @example
 * const result = await updateTodo({ id: 'todo-id-123', title: 'Título actualizado', completed: true });
 * if (result.success) {
 *   console.log('TODO actualizado:', result.data);
 * }
 */
export const updateTodo = async (
    todo: Partial<Omit<ITodo, "createdAt" | "updatedAt">>,
): Promise<IGeneralResponse<ITodo>> => {
    try {
        const validatedTodoData =
            await TodoUpdateSchema.safeParse(todo);
        if (!validatedTodoData.success) {
            return {
                error: true,
                success: false,
                message: "Datos de TODO no válidos",
            };
        }

        const { id, ...updateData } = validatedTodoData.data;

        const updatedTodo = await prismaDB.todo.update({
            where: { id },
            data: updateData,
        });

        if (!updatedTodo) {
            return {
                error: true,
                success: false,
                message: "No se pudo actualizar el TODO",
            };
        }

        return {
            success: true,
            message: "TODO actualizado exitosamente",
            data: updatedTodo,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            error: true,
            success: false,
            message: "Ocurrio un error al actualizar el TODO",
        };
    }
};
