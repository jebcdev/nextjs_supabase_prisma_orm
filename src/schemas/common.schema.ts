/**
 * Esquemas Zod para validaciones comunes reutilizables.
 *
 * Incluye:
 * - Validación de UUIDs
 * - IDs requeridos
 * - Strings normalizados comunes
 */

import { z } from "zod";

/**
 * Valida que un string sea un UUID válido (v4).
 */
export const uuidSchema = z.string().uuid({
    message: "ID no es un UUID válido",
});

/**
 * Valida que un string sea un UUID y sea requerido.
 */
export const requiredUuidSchema =
    uuidSchema.describe("UUID requerido");

/**
 * Esquema para cualquier acción que requiera solo un ID.
 */
export const idValidationSchema = z.object({
    id: uuidSchema,
});

/**
 * Tipos inferidos desde esquemas
 */
export type TIdValidation = z.infer<typeof idValidationSchema>;
