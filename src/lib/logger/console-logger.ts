/**
 * Logger de consola condicional para desarrollo.
 *
 * Solo loguea (imprime) errores cuando NEXT_PUBLIC_ENVIRONMENT = 'development'.
 * En producción, los errores se silencian para evitar exponer información sensible.
 */
export const consoleLogger = (error: unknown) => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
        console.error(error);
    }
};
