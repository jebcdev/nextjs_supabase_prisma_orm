# Next.js + Supabase + Prisma ORM

> Proyecto de referencia que muestra cómo integrar y desplegar un stack moderno de desarrollo web full-stack con Next.js 16, Prisma 7, Supabase y TanStack Query — desde cero hasta producción en Vercel.

🔗 **Demo en vivo:** [nextjs-supabase-prisma-orm.vercel.app](https://nextjs-supabase-prisma-orm.vercel.app/)

---

## ¿Para qué sirve este proyecto?

Este repositorio **no es una aplicación de producción** — es un showcase técnico. El objetivo es demostrar de forma práctica y funcional cómo conectar y hacer trabajar juntas las tecnologías más usadas en el ecosistema Next.js moderno:

- Cómo configurar **Prisma** como ORM sobre una base de datos **Supabase (PostgreSQL)**
- Cómo usar **Server Actions** de Next.js App Router para mutaciones sin API REST
- Cómo combinar **TanStack Query** con Server Actions para caché, refetch y UI optimista
- Cómo validar formularios con **React Hook Form + Zod** de extremo a extremo
- Cómo estructurar un proyecto Next.js **escalable y mantenible** desde el inicio
- Cómo **desplegar en Vercel** con Prisma y Supabase correctamente configurados

El dominio del problema (una app de tareas) es simple a propósito — para que el foco esté en la integración de las tecnologías, no en la lógica de negocio.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Lenguaje | TypeScript 5 |
| Base de datos | Supabase (PostgreSQL) |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Estado / Data fetching | TanStack Query v5 |
| Formularios | React Hook Form v7 + Zod v4 |
| Componentes UI | shadcn/ui + Base UI |
| Estilos | Tailwind CSS v4 |
| Íconos | Phosphor Icons + Lucide React |
| Notificaciones | Sonner |
| Linting | ESLint 9 + `@tanstack/eslint-plugin-query` |

---

## Estructura del Proyecto

```
├── prisma/
│   ├── migrations/          # Historial de migraciones
│   └── schema.prisma        # Esquema de la base de datos
└── src/
    ├── actions/             # Server Actions (CRUD — sin API REST)
    ├── app/                 # App Router: páginas, layouts, rutas
    │   ├── api/seeder/      # Endpoint de seed (solo desarrollo)
    │   ├── create/          # Crear tarea
    │   ├── [todoId]/        # Detalle dinámico
    │   │   └── edit/        # Editar tarea
    │   ├── error.tsx        # Boundary de errores
    │   ├── loading.tsx      # Estado de carga
    │   └── not-found.tsx    # 404 personalizado
    ├── components/
    │   ├── layouts/         # Componentes de layout (navbar)
    │   ├── providers/       # TanStack Query provider
    │   ├── todos/           # Componentes de dominio
    │   └── ui/              # Primitivos reutilizables (shadcn)
    ├── hooks/
    │   ├── mutations/       # Hooks de escritura (TanStack)
    │   └── queries/         # Hooks de lectura (TanStack)
    ├── lib/
    │   ├── db/              # Singleton de Prisma Client
    │   ├── logger/          # Logger abstracto
    │   ├── seeders/         # Datos de prueba
    │   ├── seo/             # Generador de metadatos
    │   └── utils/           # Utilidades generales
    ├── schemas/             # Validación con Zod
    └── types/               # Tipos TypeScript compartidos
```

---

## Cómo funciona la integración

### Supabase + Prisma
Supabase actúa como proveedor de PostgreSQL. Prisma se conecta directamente a la base de datos — no usa el SDK de Supabase. Esto te da migraciones con control de versiones, tipos automáticos y un query builder type-safe.

```
Next.js App → Prisma Client → pg (driver) → Supabase PostgreSQL
```

Se usan dos URLs de conexión:
- `DATABASE_URL` — con connection pooling (PgBouncer) para el runtime
- `DIRECT_URL` — conexión directa para las migraciones de Prisma

### Server Actions + TanStack Query
Las mutaciones (crear, editar, eliminar) van directo a Server Actions — sin endpoints REST intermedios. TanStack Query envuelve esas acciones para manejar estados de carga, errores e invalidación de caché automática.

```
Componente → useMutation (TanStack) → Server Action → Prisma → Supabase
```

### Validación de extremo a extremo
El mismo esquema Zod valida tanto en el cliente (React Hook Form) como en el servidor (Server Action) — una sola fuente de verdad para las reglas de negocio.

---

## Configuración Local

### Requisitos

- Node.js ≥ 20
- npm ≥ 10
- Proyecto en [Supabase](https://supabase.com) (plan gratuito funciona)

### Pasos

```bash
# 1. Clonar
git clone https://github.com/jebcdev/nextjs_supabase_prisma_orm.git
cd nextjs_supabase_prisma_orm

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp env.example .env
```

Editá `.env`:

```env
# Runtime — connection pooling (puerto 6543)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Migraciones — conexión directa (puerto 5432)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

> Encontrás estas URLs en tu Supabase dashboard: **Settings → Database → Connection string**

```bash
# 4. Correr migraciones
npx prisma migrate dev

# 5. Iniciar
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run seed` | Resetea BD + migraciones + carga datos de prueba |

> ⚠️ `seed` elimina todas las migraciones. Solo úsalo en desarrollo local.

---

## Despliegue en Vercel

### Cambios requeridos en `package.json`

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^7.7.0",
    "@prisma/adapter-pg": "^7.7.0",
    "pg": "^8.20.0"
  }
}
```

> `postinstall` es crítico — sin él Vercel no genera el cliente Prisma y el build falla.

### `schema.prisma`

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Variables de entorno en Vercel

En **Settings → Environment Variables**:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL con pooling (puerto 6543) |
| `DIRECT_URL` | URL directa (puerto 5432) |

---

## Licencia

MIT

---

## Autor

**jebcdev** — [github.com/jebcdev](https://github.com/jebcdev)