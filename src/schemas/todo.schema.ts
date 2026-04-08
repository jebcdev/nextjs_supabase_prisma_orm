/**
 * Esquemas Zod para validación de TODOs.
 *
 * Define las reglas de validación para:
 * - Crear nuevos TODOs (TodoCreateSchema)
 * - Actualizar TODOs existentes (TodoUpdateSchema - parcial con ID requerido)
 *
 * Los tipos TypeScript se infieren automáticamente desde los esquemas.
 */
import z from "zod";

export const TodoCreateSchema = z.object({
    title: z
        .string({ error: "El título es requerido" })
        .trim()
        .min(3, { error: "Mínimo 3 caracteres" })
        .max(100, { error: "Máximo 100 caracteres" }),
    slug: z
        .string({ error: "El slug es requerido" })
        .trim()
        .min(3, { error: "Mínimo 3 caracteres" })
        .max(100, { error: "Máximo 100 caracteres" })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message:
                "El slug solo puede contener letras minúsculas, números y guiones",
        }),

    description: z
        .string({ error: "La descripción es requerida" })
        .trim()
        .min(10, { error: "Mínimo 10 caracteres" })
        .max(500, { error: "Máximo 500 caracteres" }),
    completed: z.boolean({
        error: "El estado de completado es requerido",
    }),
});

export const TodoUpdateSchema = TodoCreateSchema.partial().extend({
    id: z
        .string({ error: "El id es requerido" })
        .uuid({ error: "El id debe ser un UUID válido" }),
});

export type TTodoCreateData = z.infer<typeof TodoCreateSchema>;
export type TTodoUpdate = z.infer<typeof TodoUpdateSchema>;
