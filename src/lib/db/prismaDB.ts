/**
 * Instancia singleton de Prisma Client.
 *
 * Configura la conexión a la BD usando Supabase (PostgreSQL)
 * y el adaptador PrismaPg para mejor rendimiento.
 *
 * IMPORTANTE: NUNCA instanciar PrismaClient directamente en componentes.
 * SIEMPRE importar desde '@/lib/prismaDB'.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prismaDB = new PrismaClient({ adapter });

export { prismaDB };
