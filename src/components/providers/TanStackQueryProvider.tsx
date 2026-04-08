/**
 * Proveedor de TanStack Query (React Query) para la aplicación.
 *
 * Configura el cliente de React Query con opciones por defecto optimizadas:
 * - Desactiva refetch automático al cambiar de ventana
 * - Desactiva reintentos automáticos en caso de error
 * - Incluye React Query DevTools para debugging en desarrollo
 */
"use client";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

export default function TanStackQueryProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
