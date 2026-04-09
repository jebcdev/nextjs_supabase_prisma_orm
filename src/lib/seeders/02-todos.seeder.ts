// src/lib/seeders/todo.seeder.ts

import { prismaDB } from "@/lib/db/prismaDB";


export const seedInitialTodos = async () => {
    console.log("🌱 Iniciando seeder de TODOs...");

    await prismaDB.todo.deleteMany({});
    console.log("🗑️  Tabla todos limpiada");

    const users = await prismaDB.user.findMany({ select: { id: true } });
    console.log(`👥 ${users.length} usuarios encontrados`);

    const todos = users.flatMap((user, userIndex) => [
        {
            title: `Todo 1 - Usuario ${userIndex + 1}`,
            completed: false,
            userId: user.id,
            slug: `todo-1-usuario-${userIndex + 1}`,
            description: `Todo 1 del usuario ${userIndex + 1}`,
        },
        {
            title: `Todo 2 - Usuario ${userIndex + 1}`,
            completed: false,
            userId: user.id,
            slug: `todo-2-usuario-${userIndex + 1}`,
            description: `Todo 2 del usuario ${userIndex + 1}`,
        },
        {
            title: `Todo 3 - Usuario ${userIndex + 1}`,
            completed: false,
            userId: user.id,
            slug: `todo-3-usuario-${userIndex + 1}`,
            description: `Todo 3 del usuario ${userIndex + 1}`,
        },
    ]);

    await prismaDB.todo.createMany({ data: todos });
    console.log(`✅ ${todos.length} TODOs creados (3 por usuario)`);
};