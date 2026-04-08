/**
 * Punto de entrada para ejecutar todos los seeders.
 *
 * Los seeders cargan datos de prueba iniciales en la BD.
 * Llamada automáticamente desde POST /api/seeder en desarrollo.
 *
 * Para agregar más seeders:
 * 1. Crea nuevo archivo en ./seeders/[nombre].seeder.ts
 * 2. Implementa función async export
 * 3. Descomenta/agrega call aquí en runAllSeeders()
 */
import { initialTodos } from "./todo.seeder";

export const runAllSeeders = async () => {
    console.log("🚀 Corriendo todos los seeders...");
    await initialTodos();
    // await runUserSeeder();  ← aquí agregas los próximos
    console.log("🎉 Todos los seeders completados");
};
