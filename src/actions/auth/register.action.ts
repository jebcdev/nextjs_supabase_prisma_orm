"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { RegisterSchema, TRegisterData } from "@/schemas/auth";
import { prismaDB } from "@/lib/db/prismaDB";
import { consoleLogger } from "@/lib/logger/console-logger";

export const registerUser = async (newUserData: TRegisterData) => {
    try {
        const validatedData = RegisterSchema.safeParse(newUserData);

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

        if (userExists)
            return {
                success: false,
                error: true,
                message: "El email ya está registrado",
                data: null,
            };

        const newRegisteredUser = await auth.api.signUpEmail({
            body: {
                name: validatedData.data.name,
                email: validatedData.data.email,
                password: validatedData.data.password,
                callbackURL: process.env.NEXT_PUBLIC_APP_URL,
            },
            headers: await headers(),
        });

        if (!newRegisteredUser)
            return {
                success: false,
                error: true,
                message: "Error al registrar el usuario",
                data: null,
            };

        return {
            success: true,
            error: false,
            message: "Usuario registrado exitosamente",
            data: newRegisteredUser,
        };
    } catch (error) {
        consoleLogger({ error });
        return {
            success: false,
            error: true,
            message: "Error al registrar el usuario",
            data: null,
        };
    }
};
