/**
 * Punto de entrada central para todas las server actions.
 * Re-exporta todas las acciones de auth y todos para fácil importación.
 */

// Auth actions
export * from "./auth/login.action";
export * from "./auth/register.action";
export * from "./auth/session-details.action";

// Todo actions
export * from "./todos/createTodo.action";
export * from "./todos/getAllTodos.action";
export * from "./todos/getTodoById.action";
export * from "./todos/updateTodo.action";
export * from "./todos/deleteTodo.action";
export * from "./todos/toggleTodoCompleted.action";
