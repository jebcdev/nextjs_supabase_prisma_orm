import z from "zod";

export const ForgotPasswordSchema = z.object({
    email: z
        .string({ error: "El email es requerido" })
        .trim()
        .email("Email no válido"),
});

export type TForgotPasswordData = z.infer<
    typeof ForgotPasswordSchema
>;
