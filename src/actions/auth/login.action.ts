"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { LoginSchema, TLoginData } from "@/schemas/auth";
import { prismaDB } from "@/lib/db/prismaDB";
import { consoleLogger } from "@/lib/logger/console-logger";

export const loginUser = async (currentUser: TLoginData) => {
    try {
        const validatedData = LoginSchema.safeParse(currentUser);

        if (!validatedData.success)
            return {
                success: false,
                error: true,
                message: "La información proporcionada no es válida",
                data: null,
            };

        const userExists = await prismaDB.user.findUnique({
            where: {
                email: validatedData.data.email,
            },
        });

        if (!userExists)
            return {
                success: false,
                error: true,
                message: "El email o la contraseña son incorrectos",
                data: null,
            };

        const loggedInUser = await auth.api.signInEmail({
            body: {
                email: validatedData.data.email,
                password: validatedData.data.password,
                callbackURL: process.env.NEXT_PUBLIC_APP_URL!,
            },
            headers: await headers(),
        });

        if (!loggedInUser)
            return {
                success: false,
                error: true,
                message:
                    "Error al iniciar sesión, intenta nuevamente",
                data: null,
            };

        return {
            success: true,
            error: false,
            message: "Usuario iniciado sesión exitosamente",
            data: loggedInUser,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            success: false,
            error: true,
            message: "Error al iniciar sesión, intenta nuevamente",
            data: null,
        };
    }
};
