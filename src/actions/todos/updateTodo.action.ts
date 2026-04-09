"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";
import { TodoUpdateSchema } from "@/schemas/";
import { validateSessionAndOwnership } from "@/lib/auth/auth-helpers";
import { uuidSchema } from "@/schemas";

/**
 * Actualiza los datos de un TODO del usuario autenticado.
 *
 * @param {Partial<Omit<ITodo, "createdAt" | "updatedAt" | "userId">>} todo - Los datos a actualizar (incluyendo el ID)
 * @returns {Promise<IGeneralResponse<ITodo>>} Una respuesta que contiene el TODO actualizado o un mensaje de error
 *
 * @example
 * const result = await updateTodo({ id: '550e8400-e29b-41d4-a716-446655440000', title: 'Título actualizado' });
 * if (result.success) {
 *   console.log('TODO actualizado:', result.data);
 * }
 */
export const updateTodo = async (
    todo: Partial<Omit<ITodo, "createdAt" | "updatedAt" | "userId">>,
): Promise<IGeneralResponse<ITodo>> => {
    try {
        // 1. Validar que tenga ID
        if (!todo.id) {
            return {
                error: true,
                success: false,
                message: "ID del TODO es requerido",
            };
        }

        // 2. Validar formato del ID
        const idValidation = uuidSchema.safeParse(todo.id);
        if (!idValidation.success) {
            return {
                error: true,
                success: false,
                message: "ID del TODO no es válido",
            };
        }

        // 3. Validar sesión y propiedad del TODO
        const authResult = await validateSessionAndOwnership(todo.id);
        if ("message" in authResult) {
            return authResult;
        }

        // 4. Validar datos del TODO
        const validatedTodoData = TodoUpdateSchema.safeParse(todo);
        if (!validatedTodoData.success) {
            return {
                error: true,
                success: false,
                message:
                    validatedTodoData.error.issues[0]?.message ||
                    "Datos de TODO no válidos",
            };
        }

        const { id, ...updateData } = validatedTodoData.data;

        // 5. Actualizar TODO
        const updatedTodo = await prismaDB.todo.update({
            where: { id },
            data: updateData,
        });

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
            message: "Error al actualizar el TODO. Intenta de nuevo.",
        };
    }
};
