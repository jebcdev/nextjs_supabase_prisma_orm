"use server";

import { consoleLogger } from "@/lib/logger/console-logger";
import { prismaDB } from "@/lib/db/prismaDB";
import { IGeneralResponse } from "@/types";
import { ITodo } from "@/types/todo.type";
import { getSessionDetails } from "../auth";

export const getAllTodos = async (): Promise<
    IGeneralResponse<ITodo[]>
> => {
    try {
        const { isAuthenticated, currentUser } =
            await getSessionDetails();

        if (!isAuthenticated || !currentUser) {
            return {
                success: false,
                error: true,
                message:
                    "No autorizado. Inicia sesión para continuar.",
            };
        }
        consoleLogger({ "currentUser.id": currentUser.id });
        const todos = await prismaDB.todo.findMany({
            where: { userId: currentUser.id },
            orderBy: { createdAt: "desc" },
        });

        if (todos.length === 0) {
            consoleLogger({
                message: "No se encontraron TODOs para el usuario.",
                userId: currentUser.id,
            });

            return {
                success: false,
                error: true,
                message: "No tienes TODOs aún",
            };
        }
        consoleLogger({ todos });
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
            message: "Error al obtener los TODOs. Intenta de nuevo.",
        };
    }
};
