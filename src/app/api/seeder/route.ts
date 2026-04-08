/**
 * Endpoint de API para ejecutar los seeders de la base de datos.
 * Solo funciona en desarrollo (bloqueado en producción).
 * Carga datos de prueba iniciales en la BD.
 */
import { consoleLogger } from "@/lib/logger/console-logger";
import { runAllSeeders } from "@/lib/seeders";
import { NextResponse } from "next/server";

export const POST = async () => {
    // Protección básica — solo en desarrollo
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT 
    consoleLogger({environment})
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
        return NextResponse.json(
            { error: "No disponible en producción" },
            { status: 403 },
        );
    }

    try {
        await runAllSeeders();
        return NextResponse.json(
            {
                success: true,
                message: "Seeders ejecutados correctamente",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Error ejecutando seeders" },
            { status: 500 },
        );
    }
};
