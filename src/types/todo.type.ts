/**
 * Módulo de tipos e interfaces del dominio TODO.
 *
 * Define todas las interfaces TypeScript para la entidad TODO, incluyendo:
 * - Estructura completa del TODO desde la BD
 * - Tipos de entrada para crear/actualizar TODOs
 * - Estructura de paginación y respuestas
 *
 * Exports:
 *   - ITodo: Interfaz completa de TODO desde la BD
 *   - ITodosInput: Tipo para crear nuevo TODO (excluye id y timestamps)
 *   - ITodosUpdate: Tipo para actualizar TODO (todos los campos opcionales)
 *
 * Convenciones:
 *   - Interfaces prefijadas con `I` (ITodo, ITodosInput)
 *   - Campos opcionales con operador `?` cuando aplica
 *   - Campos de BD incluyen timestamps (createdAt, updatedAt)
 *
 * Example:
 *   ```typescript
 *   const newTodo: ITodosInput = { title: 'Mi TODO', description: 'Detalles...' };
 *   const updated: ITodosUpdate = { completed: true }; // Actualización parcial
 *   const fullTodo: ITodo = { id: '123', ...newTodo, completed: false, createdAt: ... };
 *   ```
 */

/**
 * Interfaz completa de una entidad TODO desde la base de datos.
 *
 * Representa el registro completo de un TODO con todos los campos:
 * - Datos del usuario (title, slug, description)
 * - Control de estado (completed)
 * - Metadatos de auditoría (createdAt, updatedAt)
 *
 * Nota: Los campos `id` y timestamps son opcionales (`?`) porque pueden no estar disponibles
 * en ciertos contextos (ej: en formularios antes de la creación). En respuestas de BD, siempre estarán presentes.
 *
 * @property id - Identificador único UUID generado por la BD. NUNCA generar manualmente.
 * @property title - Título del TODO (1-100 caracteres). Requerido, no puede estar vacío.
 * @property slug - URL-friendly slug generado automáticamente del title por el servidor.
 *                  Formato: minúsculas, números, guiones. Ej: \"mi-primer-todo\".
 *                  Usado como identificador secundario en URLs dinámicas.
 * @property description - Descripción detallada del TODO (opcional).
 *                        Puede ser null cuando no se proporciona.
 * @property completed - Estado de finalización del TODO (default: false).
 *                      Marcado como true cuando el usuario completa la tarea.
 * @property createdAt - Timestamp de creación. Generado automáticamente por BD.
 *                      Se usa para ordenar TODOs por antigüedad.
 * @property updatedAt - Timestamp de última actualización. Actualizado en cada cambio.
 *                      Útil para auditoría y detectar concurrencia.
 *
 * @example
 *   const todoFromDB: ITodo = {
 *     id: 'clk1a2b3c4d5e6f7g8h9i0j1k',
 *     title: 'Aprender TypeScript',
 *     slug: 'aprender-typescript',
 *     description: 'Completar curso avanzado de TS',
 *     completed: false,
 *     createdAt: new Date('2024-03-15'),
 *     updatedAt: new Date('2024-03-20')
 *   };
 */
export interface ITodo {
    /** Identificador único (UUID) generado por Prisma. Campo obligatorio desde BD. */
    id?: string;
    /** Título del TODO (restricción: 3-100 caracteres). Campo requerido. */
    title: string;
    /** Slug URL-friendly generado del título (formato: minúsculas-guiones). */
    slug: string;
    /** Descripción detallada (opcional, puede ser null). */
    description: string | null;
    /** Estado de finalización (default: false). True cuando está completado. */
    completed: boolean;
    /** Timestamp de creación del registro. Generado automáticamente por BD. */
    createdAt?: Date;
    /** Timestamp de última actualización. Actualizado en cada cambio. */
    updatedAt?: Date;
}

/**
 * Tipo de entrada para crear un nuevo TODO.
 *
 * Excluye campos auto-generados por la BD:
 * - `id`: Generado automáticamente (UUID)
 * - `slug`: Generado del título en servidor
 * - `createdAt`, `updatedAt`: Timelines automáticos
 *
 * Al crear, solo necesitamos título y descripción opcional.
 * El slug se genera automáticamente en el servidor desde el título.
 *
 * @property title - Título del TODO. Requerido, validado con Zod (min 3, max 100 caracteres).
 * @property description - Descripción opcional. Puede omitirse en la solicitud.
 *
 * @example
 *   const input: ITodosInput = { title: 'Nueva tarea', description: 'Detalles' };
 *   const result = await createTodo(input); // Slug generado automáticamente
 *
 * @see TodoCreateSchema - Esquema Zod que valida este tipo de entrada
 */
export interface ITodosInput {
    /** Título del TODO (requerido: 3-100 caracteres). */
    title: string;
    /** Descripción detallada (opcional). */
    description?: string;
}

/**
 * Tipo de entrada para actualizar un TODO existente.
 *
 * Todos los campos son OPCIONALES, permitiendo actualizaciones parciales.
 * Por ejemplo, el usuario podría actualizar solo el título sin tocar la descripción.
 *
 * Restricciones:
 * - `id` y `createdAt` NUNCA pueden actualizarse (son inmutables)
 * - `slug` NO debería actualizarse directamente (se regenera del título)
 * - `updatedAt` se genera automáticamente en BD
 *
 * @property title - Nuevo título (opcional). Validado con Zod si se proporciona.
 * @property description - Nueva descripción (opcional). Puede ser null para borrar.
 * @property completed - Nuevo estado (opcional). true para marcar completado.
 *
 * @example
 *   const update: ITodosUpdate = { completed: true }; // Solo cambiar estado
 *   const result = await updateTodo(todoId, update); // El resto se mantiene igual
 *
 *   const fullUpdate: ITodosUpdate = {
 *     title: 'Nuevo título',
 *     description: 'Nueva descripción',
 *     completed: false
 *   }; // Actualizar múltiples campos
 *
 * @see TodoUpdateSchema - Esquema Zod que valida este tipo de entrada
 */
export interface ITodosUpdate {
    /** Título actualizado (opcional). */
    title?: string;
    /** Descripción actualizada (opcional). */
    description?: string;
    /** Estado de finalización actualizado (opcional). */
    completed?: boolean;
}
