/**
 * Exporta todas las Server Actions para operaciones CRUD de TODOs.
 *
 * Este módulo proporciona las funciones necesarias para:
 * - Crear nuevos TODOs
 * - Obtener TODOs (todos o por ID)
 * - Actualizar TODOs
 * - Eliminar TODOs
 * - Cambiar el estado de completitud de TODOs
 */

export { createTodo } from "./createTodo.action";
export { deleteTodo } from "./deleteTodo.action";
export { getAllTodos } from "./getAllTodos.action";
export { getTodoById } from "./getTodoById.action";
export { toggleTodoCompleted } from "./toggleTodoCompleted.action";
export { updateTodo } from "./updateTodo.action";
