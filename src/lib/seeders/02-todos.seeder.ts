// src/lib/seeders/todo.seeder.ts

import { prismaDB } from "@/lib/db/prismaDB";
import { slugify } from "@/lib/utils/slugify";

const todosSeed = [
    // 💻 Trabajo / Dev
    {
        title: "Configurar ESLint y Prettier en el proyecto",
        completed: true,
    },
    {
        title: "Implementar autenticación con Supabase",
        completed: true,
    },
    {
        title: "Crear esquema de base de datos con Prisma",
        completed: true,
    },
    {
        title: "Escribir tests unitarios para server actions",
        completed: false,
    },
    {
        title: "Documentar la API REST del proyecto",
        completed: false,
    },
    {
        title: "Optimizar queries lentas en el dashboard",
        completed: false,
    },
    {
        title: "Migrar componentes a React Server Components",
        completed: false,
    },
    {
        title: "Configurar CI/CD con GitHub Actions",
        completed: false,
    },
    {
        title: "Revisar vulnerabilidades con npm audit",
        completed: true,
    },
    {
        title: "Actualizar dependencias del proyecto",
        completed: false,
    },
    {
        title: "Implementar paginación en la lista de todos",
        completed: false,
    },
    {
        title: "Agregar logs con Winston en producción",
        completed: false,
    },
    {
        title: "Refactorizar el módulo de autenticación",
        completed: true,
    },
    {
        title: "Crear componente de tabla reutilizable",
        completed: false,
    },
    {
        title: "Configurar variables de entorno en Vercel",
        completed: true,
    },

    // 🏠 Casa
    { title: "Pagar el arriendo del mes", completed: true },
    { title: "Cambiar el bombillo del cuarto", completed: true },
    {
        title: "Limpiar el filtro del aire acondicionado",
        completed: false,
    },
    { title: "Organizar el cuarto de estudio", completed: false },
    {
        title: "Comprar escritorio nuevo para el setup",
        completed: false,
    },
    {
        title: "Instalar segunda pantalla en el escritorio",
        completed: true,
    },
    {
        title: "Arreglar la llave del baño que gotea",
        completed: false,
    },
    { title: "Pagar internet del mes", completed: true },
    { title: "Comprar silla ergonómica", completed: false },
    { title: "Limpiar y organizar el garage", completed: false },

    // 🐱 Gatos (x5)
    {
        title: "Llevar a Michi al veterinario por vacunas",
        completed: true,
    },
    {
        title: "Comprar arena sanitaria para los gatos",
        completed: true,
    },
    { title: "Desparasitar a Pelusa y Manchas", completed: false },
    {
        title: "Comprar rascador nuevo para los mininos",
        completed: false,
    },
    { title: "Revisar que Luna no tenga pulgas", completed: true },
    {
        title: "Llevar a Sombra al veterinario por chequeo",
        completed: false,
    },
    {
        title: "Comprar alimento premium para los gatos",
        completed: true,
    },
    { title: "Limpiar las camitas de los gatos", completed: false },
    {
        title: "Castrar a Rayito cuando cumpla 6 meses",
        completed: false,
    },
    {
        title: "Comprar juguetes nuevos para los mininos",
        completed: false,
    },

    // 🏍️ Moto
    { title: "Cambiar el aceite de la moto", completed: true },
    { title: "Revisar la presión de las llantas", completed: true },
    { title: "Pagar el SOAT de la moto", completed: true },
    {
        title: "Llevar la moto a revisión técnicomecanica",
        completed: false,
    },
    {
        title: "Cambiar pastillas de freno delantero",
        completed: false,
    },
    { title: "Lavar y encerar la moto", completed: true },
    { title: "Revisar la cadena de transmisión", completed: false },
    { title: "Comprar casco nuevo", completed: false },

    // 🧘 Personal
    { title: "Hacer ejercicio 3 veces por semana", completed: false },
    { title: "Leer 20 páginas de Clean Code", completed: true },
    { title: "Tomar curso de Kubernetes en Udemy", completed: false },
    {
        title: "Llamar a la familia el fin de semana",
        completed: true,
    },
    { title: "Ir al médico por chequeo general", completed: false },
    {
        title: "Organizar finanzas personales del mes",
        completed: false,
    },
];

export const seedInitialTodos = async (userId: string) => {
    console.log("🌱 Iniciando seeder de TODOs...");

    await prismaDB.todo.deleteMany({});
    console.log("🗑️  Tabla todos limpiada");

    const todos = todosSeed.map((todo) => ({
        ...todo,
        userId,
        slug: slugify(todo.title),
        description:
            todo.title +
            " - " +
            (todo.completed ? "Completado" : "Pendiente"),
    }));

    await prismaDB.todo.createMany({ data: todos });
    console.log(
        `✅ ${todos.length} TODOs creados exitosamente para el usuario ${userId}`,
    );
};
