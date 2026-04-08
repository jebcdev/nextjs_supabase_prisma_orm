# GitHub Copilot Instructions
# Stack: Next.js (App Router) · Prisma · Zod · TanStack Query · Zustand · shadcn/ui · Tailwind CSS · bcryptjs · NextAuth

---

## Mandatory: Context7 MCP

For **any project, language, or framework**, before writing, modifying, or explaining code,
**you must always query Context7 MCP** to get up-to-date and context-relevant documentation.

### Required workflow

1. Identify the libraries, frameworks, or tools involved in the task.
2. Use `resolve-library-id` from Context7 to find the correct ID for each library.
3. Use `get-library-docs` to fetch up-to-date documentation before generating any response.
4. **Always** base your response on the documentation retrieved from Context7 — never on potentially outdated internal knowledge.

> **Never assume your internal knowledge is current. Always verify with Context7 first.**

---

## Project Context

This is a **Next.js full-stack application** using the App Router.
The stack is designed to be **domain-agnostic** — these conventions apply regardless of the business domain (SaaS, e-commerce, internal tools, marketplaces, etc.).

The architecture follows a clear separation of concerns:
- **Server Actions** for mutations
- **React Query** for server state on the client
- **Zustand** for UI/ephemeral state
- **Prisma** for database access
- **Zod** for validation at every boundary
- **NextAuth** for authentication
- **bcryptjs** for password hashing

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register, forgot-password)
│   ├── (dashboard)/              # Protected routes — adapt to your domain
│   └── api/                      # Route Handlers (only when Server Actions aren't enough)
│
├── components/
│   ├── ui/                       # shadcn/ui — do NOT modify directly
│   ├── shared/                   # Reusable cross-feature components
│   └── features/                 # Domain-specific components, one folder per domain
│
├── actions/                      # Server Actions, one file per domain
│   └── [domain].actions.ts
│
├── lib/
│   ├── prisma.ts                 # Prisma Client singleton
│   ├── auth.ts                   # NextAuth configuration
│   ├── bcrypt.ts                 # bcryptjs helpers
│   └── utils.ts                  # Shared utilities (cn, formatters, etc.)
│
├── schemas/                      # Zod schemas, one file per domain
│   └── index.ts                  # Re-exports everything
│
├── stores/                       # Zustand stores
│   └── index.ts
│
├── hooks/                        # Custom hooks (React Query + derived logic)
│
├── types/                        # TypeScript interfaces, types, enums
│   └── index.ts
│
├── constants/                    # App-wide constants
│   └── index.ts
│
└── services/                     # Pure business logic — framework-agnostic classes
```

---

## Naming Conventions — Always follow these

```ts
// Interfaces → prefix I
interface IUser { ... }
interface IProduct { ... }
interface IOrderWithItems { ... }

// Types → prefix T
type TResponse<T> = { data: T | null; error: string | null }
type TStatus = 'pending' | 'active' | 'cancelled'
type TPageProps<P = {}, S = {}> = { params: P; searchParams: S }

// Enums → prefix E
enum EUserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

enum EStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
}

// Constants → UPPER_SNAKE_CASE
const MAX_FILE_SIZE_MB = 10
const DEFAULT_PAGE_SIZE = 20
const SALT_ROUNDS = 12

// Classes / Services → PascalCase + Service suffix
class UserService { ... }
class PaymentService { ... }

// Functions → camelCase, descriptive verbs
function hashPassword(plain: string): Promise<string> { ... }
function formatCurrency(amount: number, currency: string): string { ... }

// Components → PascalCase
function UserCard() { ... }
function ProductForm() { ... }

// Hooks → camelCase with `use` prefix
function useUsers() { ... }
function useDebounce<T>(value: T, delay: number) { ... }

// Zustand stores → camelCase + Store suffix
const useUIStore = create(...)
const useCartStore = create(...)
```

---

## Zod Schemas — src/schemas/

```ts
// src/schemas/user.schema.ts
import { z } from 'zod'
import { EUserRole } from '@/types'

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(EUserRole).default(EUserRole.MEMBER),
})

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().cuid(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

// Always infer types from schemas
export type TCreateUserInput = z.infer<typeof createUserSchema>
export type TUpdateUserInput = z.infer<typeof updateUserSchema>
export type TLoginInput = z.infer<typeof loginSchema>
```

```ts
// src/schemas/index.ts — re-export everything
export * from './auth.schema'
export * from './user.schema'
// add more domains as needed
```

### Zod rules
- Every external input (forms, API, Server Actions) must be validated with Zod before use
- Always use `safeParse` — never `parse` (it throws)
- Always infer TypeScript types from schemas — never duplicate type definitions
- Schema names must end with `Schema` suffix

---

## Authentication — NextAuth + bcryptjs

```ts
// src/lib/bcrypt.ts
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}
```

```ts
// src/lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/bcrypt'
import { loginSchema } from '@/schemas'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user || !user.password) return null

        const valid = await verifyPassword(parsed.data.password, user.password)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
```

### Auth rules
- **Never** store plain-text passwords — always use `hashPassword` from `@/lib/bcrypt`
- **Never** compare passwords manually — always use `verifyPassword`
- Protect Server Actions and Route Handlers by calling `auth()` and checking the session
- Extend the NextAuth session type to include custom fields (e.g. `role`, `id`)
- Always define custom pages (`signIn`, `error`) — never rely on NextAuth defaults

```ts
// Protecting a Server Action
import { auth } from '@/lib/auth'

export async function sensitiveAction(data: unknown) {
  const session = await auth()
  if (!session?.user) return { data: null, error: 'Unauthorized' }
  // continue...
}
```

---

## Server Actions — src/actions/

### Standard pattern — always use this

```ts
// src/actions/[domain].actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createEntitySchema } from '@/schemas'
import type { TResponse } from '@/types'
import type { Entity } from '@prisma/client'

export async function createEntity(
  rawData: unknown
): Promise<TResponse<Entity>> {
  // 1. Auth check
  const session = await auth()
  if (!session?.user) return { data: null, error: 'Unauthorized' }

  // 2. Validate with Zod
  const parsed = createEntitySchema.safeParse(rawData)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message }
  }

  try {
    // 3. Business logic — delegate to service if complex
    const entity = await prisma.entity.create({
      data: parsed.data,
    })

    // 4. Revalidate affected routes
    revalidatePath('/entities')

    return { data: entity, error: null }
  } catch (error) {
    console.error('[createEntity]', error)
    return { data: null, error: 'Failed to create. Please try again.' }
  }
}
```

### Server Actions rules
- Always return `TResponse<T>` — never throw raw errors to the client
- Always check auth before doing anything else
- Always validate with Zod `safeParse` before touching Prisma
- Always log errors with context: `console.error('[actionName]', error)`
- Always call `revalidatePath` or `revalidateTag` after mutations
- Never put complex business logic inside actions — delegate to a Service class

---

## Prisma — src/lib/prisma.ts

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Query patterns

```ts
// Explicit return types always
async function getEntityById(id: string): Promise<IEntity | null> {
  return prisma.entity.findUnique({
    where: { id },
    include: { relatedModel: true },
  })
}

// Standard pagination
async function getEntities(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const [items, total] = await prisma.$transaction([
    prisma.entity.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.entity.count(),
  ])
  return { items, total, page, pageSize }
}

// Mutations always in try/catch
async function updateEntity(id: string, data: TUpdateInput) {
  try {
    return await prisma.entity.update({ where: { id }, data })
  } catch (error) {
    throw new Error(`Failed to update entity ${id}: ${error}`)
  }
}
```

### Prisma rules
- Never instantiate `PrismaClient` directly — always use `@/lib/prisma`
- Prefer `select` over `include` when only a few fields are needed
- Group dependent queries in `$transaction`
- Never expose raw Prisma models to the client — always map to interfaces
- Soft deletes preferred over hard deletes when history matters (`deletedAt` pattern)

---

## React Components — Server vs Client

```tsx
// Server Component — default, no directive needed
// src/components/features/[domain]/EntityList.tsx
import { prisma } from '@/lib/prisma'
import { EntityCard } from './EntityCard'

export async function EntityList() {
  const items = await prisma.entity.findMany({
    orderBy: { createdAt: 'desc' },
  })

  if (items.length === 0) {
    return <p className="text-muted-foreground">No items found.</p>
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <EntityCard key={item.id} entity={item} />
      ))}
    </ul>
  )
}
```

```tsx
// Client Component — only when required
'use client'

import { useTransition } from 'react'
import { deleteEntity } from '@/actions/entity.actions'
import { toast } from 'sonner'

interface IDeleteButtonProps {
  entityId: string
}

export function DeleteButton({ entityId }: IDeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEntity(entityId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Deleted successfully')
      }
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

### Component rules
- Default to Server Component — add `'use client'` only for: `useState`, `useEffect`, event handlers, browser APIs
- Props must always be typed with `interface I...Props`
- Never fetch data inside Client Components via `useEffect` — use React Query or Server Components
- Forms use `react-hook-form` + Zod resolver + Server Actions
- Always wrap Server Action calls in `useTransition` inside Client Components
- Use `disabled={isPending}` on interactive elements during transitions

---

## Forms — react-hook-form + Zod + Server Actions

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { createEntitySchema, type TCreateEntityInput } from '@/schemas'
import { createEntity } from '@/actions/entity.actions'

export function EntityForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<TCreateEntityInput>({
    resolver: zodResolver(createEntitySchema),
    defaultValues: { name: '', description: '' },
  })

  function onSubmit(values: TCreateEntityInput) {
    startTransition(async () => {
      const result = await createEntity(values)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Created successfully')
        form.reset()
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* fields */}
    </form>
  )
}
```

---

## React Query (TanStack Query) — Hooks

```ts
// src/hooks/useEntities.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { IEntity, TCreateEntityInput } from '@/types'

// Query keys — typed constants at module level, never inline
export const ENTITY_QUERY_KEYS = {
  all: ['entities'] as const,
  list: (filters?: object) => ['entities', 'list', filters] as const,
  detail: (id: string) => ['entities', 'detail', id] as const,
}

// Fetch functions — always declared outside the hook
async function fetchEntities(): Promise<IEntity[]> {
  const res = await fetch('/api/entities')
  if (!res.ok) throw new Error('Failed to load entities')
  return res.json()
}

export function useEntities() {
  return useQuery({
    queryKey: ENTITY_QUERY_KEYS.list(),
    queryFn: fetchEntities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TCreateEntityInput) => {
      const res = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTITY_QUERY_KEYS.all })
    },
    onError: (error) => {
      console.error('[useCreateEntity]', error)
    },
  })
}
```

### React Query rules
- Query keys must be typed constants at module level — never inline strings
- Fetch functions must be declared outside the hook — never inline in `queryFn`
- **Server state → React Query. UI/ephemeral state → Zustand. Never mix them.**
- Always set a meaningful `staleTime` — the default of `0` is almost never correct
- Use `invalidateQueries` after mutations — never manually update cache unless performance demands it

---

## Zustand Stores — src/stores/

```ts
// src/stores/ui.store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IUIStore {
  // State
  isSidebarOpen: boolean
  activeModal: string | null

  // Actions
  toggleSidebar: () => void
  openModal: (id: string) => void
  closeModal: () => void
}

const initialState = {
  isSidebarOpen: true,
  activeModal: null,
}

export const useUIStore = create<IUIStore>()(
  devtools(
    (set) => ({
      ...initialState,
      toggleSidebar: () =>
        set((s) => ({ isSidebarOpen: !s.isSidebarOpen }), false, 'toggleSidebar'),
      openModal: (id) =>
        set({ activeModal: id }, false, 'openModal'),
      closeModal: () =>
        set({ activeModal: null }, false, 'closeModal'),
    }),
    { name: 'UIStore' }
  )
)
```

### Zustand rules
- Always use `devtools` middleware — pass action names as the third arg of `set`
- Zustand = UI state and ephemeral state **only**
- Always clearly separate state fields from action functions in the store interface
- Always export the store interface
- Always define `initialState` separately — makes `reset` actions trivial

---

## Services — src/services/

```ts
// src/services/EmailService.ts
// Pure business logic — no framework imports, no Prisma, no Next.js

export class EmailService {
  static buildWelcomeTemplate(name: string): { subject: string; html: string } {
    return {
      subject: `Welcome, ${name}!`,
      html: `<p>Hi ${name}, thanks for signing up.</p>`,
    }
  }

  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}
```

### Service rules
- Services must be **pure** — no `prisma`, no `fetch`, no Next.js APIs
- Services are the right place for: calculations, transformations, validations beyond Zod, template building
- Always use `static` methods unless instance state is truly needed
- Business logic in components or actions must be delegated to a Service

---

## Global Types — src/types/

```ts
// src/types/api.types.ts
export type TResponse<T> = {
  data: T | null
  error: string | null
}

export type TPaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  error: string | null
}

export type TPageProps<P = {}, S = {}> = {
  params: P
  searchParams: S
}

export type TActionState = {
  error: string | null
  success: string | null
}
```

```ts
// src/types/index.ts — re-export everything
export * from './api.types'
export * from './user.types'
// add more as your domain grows
```

---

## Toast Notifications — Strict Format

### Info / not-yet-implemented notices

Always use this exact structure for informational or not-yet-implemented notices:

```tsx
toast.info("<context-specific message>", {
  description: "<context-specific description>", // optional — omit if not needed
  action: {
    label: "Got it",
    onClick: () => toast.dismiss(),
  },
})
```

### Error / Success

```tsx
toast.success("Changes saved")
toast.error(result.error ?? "Something went wrong. Please try again.")
```

### Toast rules
- `toast.info` for notices and non-critical feedback
- `toast.success` for completed mutations
- `toast.error` for failed operations — always include a user-friendly message
- Never use generic messages like "Error" or "Done" — always be specific to the context
- Never surface raw error messages or stack traces to the user

---

## Environment Variables

```ts
// src/lib/env.ts — validate all env vars at startup with Zod
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export const env = envSchema.parse(process.env)
```

### Env rules
- Always validate env vars at startup — never access `process.env` directly in app code
- Use `@/lib/env` everywhere — catch missing vars at boot, not at runtime
- Never commit `.env` files — always provide `.env.example`

---

## Route Handlers — app/api/

Use Route Handlers only when Server Actions are insufficient (e.g., webhooks, file uploads, third-party OAuth callbacks).

```ts
// app/api/[domain]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await prisma.entity.findMany()
    return NextResponse.json(items)
  } catch (error) {
    console.error('[GET /api/entities]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## Anti-patterns — Never do these

```ts
// ❌ Never use `any`
const data: any = await fetch(...)
// ✅ Always type explicitly
const data: IEntity = await fetch(...)

// ❌ Never fetch in useEffect
useEffect(() => { fetch('/api/items').then(setItems) }, [])
// ✅ Use React Query or Server Components

// ❌ Never instantiate PrismaClient directly
const prisma = new PrismaClient()
// ✅ Always use the singleton
import { prisma } from '@/lib/prisma'

// ❌ Never throw from Server Actions
throw new Error('DB failed')
// ✅ Return TResponse
return { data: null, error: 'Something went wrong. Please try again.' }

// ❌ Never skip Zod validation
async function action(data: FormData) {
  await prisma.entity.create({ data: data as any })
}
// ✅ Always safeParse first

// ❌ Never store plain passwords
await prisma.user.create({ data: { password: rawPassword } })
// ✅ Always hash
await prisma.user.create({ data: { password: await hashPassword(rawPassword) } })

// ❌ Never put business logic in components or actions
const price = qty * 25000 * (type === 'premium' ? 1.5 : 1)
// ✅ Delegate to a Service
const price = PricingService.calculate({ qty, type })

// ❌ Never store server data in Zustand
useMyStore.setState({ items: fetchedData })
// ✅ Server data → React Query. UI state → Zustand

// ❌ Never access process.env directly in app code
const url = process.env.API_URL
// ✅ Use validated env
import { env } from '@/lib/env'
const url = env.API_URL
```

---

## Pre-commit Checklist

- [ ] All interfaces prefixed with `I`
- [ ] All types prefixed with `T`
- [ ] All enums prefixed with `E`
- [ ] All constants in `UPPER_SNAKE_CASE`
- [ ] Zod schemas in `src/schemas/` with `Schema` suffix
- [ ] Types inferred from schemas — no duplicated type definitions
- [ ] Server Actions return `TResponse<T>` and check auth first
- [ ] Passwords hashed with `hashPassword` — never stored plain
- [ ] Prisma mutations wrapped in try/catch
- [ ] `'use client'` only where strictly necessary
- [ ] Business logic delegated to `src/services/`
- [ ] Prisma accessed only via `@/lib/prisma` singleton
- [ ] Env vars accessed only via `@/lib/env`
- [ ] No `any` types anywhere
- [ ] Toast messages are context-specific — no generic text