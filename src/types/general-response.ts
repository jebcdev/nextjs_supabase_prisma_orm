/**
 * Módulo de tipos para respuestas estándar de la API.
 *
 * Define la estructura de todas las respuestas del servidor (acciones, endpoints, queries).
 * Utiliza discriminated unions para garantizar type-safety: el tipo de `data` depende del valor
 * de `success`.
 *
 * Exports:
 *   - IGeneralResponse<T>: Tipo discriminado para respuestas de éxito/error
 *
 * Example:
 *   ```typescript
 *   // Respuesta exitosa
 *   const response: IGeneralResponse<ITodo> = {
 *     success: true,
 *     message: 'TODO creado exitosamente',
 *     data: { id: '123', title: 'Mi TODO', completed: false, ... }
 *   };
 *
 *   // Respuesta con error
 *   const errorResponse: IGeneralResponse<ITodo> = {
 *     success: false,
 *     error: true,
 *     message: 'Validación fallida: título muy corto',
 *     data: undefined  // Nunca hay data en respuesta de error
 *   };
 *   ```
 */

/**
 * Estructura estándar para todas las respuestas del servidor.
 *
 * Utiliza un discriminated union (discriminantes: success/error) para garantizar que:
 * - Cuando success=true: `data` contiene el resultado, `error` es falso/undefined
 * - Cuando success=false: `data` nunca existe (never), `error` es true
 *
 * Esta estructura previene el acceso accidental a `data` cuando la operación falló.
 *
 * @template T - Tipo de datos en respuesta exitosa. Default: undefined (para operaciones sin retorno)
 *
 * @example
 *   // Crear función que retorna respuesta tipada
 *   async function getTodo(id: string): Promise<IGeneralResponse<ITodo>> {
 *     try {
 *       const todo = await prisma.todo.findUnique({ where: { id } });
 *       if (!todo) return { success: false, error: true, message: 'TODO no encontrado' };
 *       return { success: true, message: 'TODO recuperado', data: todo };
 *     } catch (error) {
 *       return { success: false, error: true, message: 'Error interno del servidor' };
 *     }
 *   }
 *
 * @see ITodo - Ejemplo de tipo de dato que puede estar en `data`
 */
export type IGeneralResponse<T = undefined> =
    | { success: true; error?: false; message: string; data: T }
    | { success: false; error: true; message: string; data?: never };
