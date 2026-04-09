/**
 * Helpers centralizado para validación de autenticación y autorización.
 *
 * Proporciona funciones reutilizables para:
 * - Validar sesión del usuario
 * - Validar propiedad de recursos (ownership)
 * - Obtener usuario autenticado
 * - Manejo consistente de errores de auth
 */

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { IGeneralResponse } from "@/types";
import { prismaDB } from "@/lib/db/prismaDB";

/**
 * Valida que el usuario esté autenticado y retorna su sesión.
 *
 * @returns {Promise<{ userId: string } | IGeneralResponse<never>>} El userId si está autenticado, o respuesta de error
 *
 * @example
 * const userOrError = await validateSession();
 * if ('message' in userOrError) {
 *   return userOrError; // Error response
 * }
 * const { userId } = userOrError;
 */
export async function validateSession(): Promise<
    { userId: string } | IGeneralResponse<never>
> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return {
                success: false,
                error: true,
                message:
                    "No autorizado. Inicia sesión para continuar.",
            };
        }

        return { userId: session.user.id };
    } catch (error) {
        console.error("[validateSession]", error);
        return {
            success: false,
            error: true,
            message: "Error al validar la sesión.",
        };
    }
}

/**
 * Valida que un TODO pertenece al usuario autenticado.
 *
 * @param {string} todoId - ID del TODO a validar
 * @param {string} userId - ID del usuario autenticado
 * @returns {Promise<boolean | IGeneralResponse<never>>} true si pertenece, o respuesta de error
 *
 * @example
 * const result = await validateTodoOwnership(todoId, userId);
 * if ('message' in result) {
 *   return result; // Error o no autorizado
 * }
 * // result === true, el TODO pertenece al usuario
 */
export async function validateTodoOwnership(
    todoId: string,
    userId: string,
): Promise<boolean | IGeneralResponse<never>> {
    try {
        const todo = await prismaDB.todo.findUnique({
            where: { id: todoId },
        });

        if (!todo) {
            return {
                success: false,
                error: true,
                message: "TODO no encontrado.",
            };
        }

        if (todo.userId !== userId) {
            return {
                success: false,
                error: true,
                message:
                    "No tienes permiso para acceder a este TODO.",
            };
        }

        return true;
    } catch (error) {
        console.error("[validateTodoOwnership]", error);
        return {
            success: false,
            error: true,
            message: "Error al validar permisos del TODO.",
        };
    }
}

/**
 * Valida sesión y propiedad en una sola llamada.
 * Usado como helper en acciones que requieren ambas validaciones.
 *
 * @param {string} todoId - ID del TODO a validar
 * @returns {Promise<{ userId: string } | IGeneralResponse<never>>} Usuario y ID si válido, o respuesta de error
 *
 * @example
 * const userOrError = await validateSessionAndOwnership(todoId);
 * if ('message' in userOrError) {
 *   return userOrError; // Error response
 * }
 * const { userId } = userOrError;
 */
export async function validateSessionAndOwnership(
    todoId: string,
): Promise<{ userId: string } | IGeneralResponse<never>> {
    // 1. Validar sesión
    const sessionResult = await validateSession();
    if ("message" in sessionResult) {
        return sessionResult;
    }
    const { userId } = sessionResult;

    // 2. Validar propiedad
    const ownershipResult = await validateTodoOwnership(
        todoId,
        userId,
    );
    if (ownershipResult !== true) {
        return ownershipResult;
    }

    return { userId };
}
