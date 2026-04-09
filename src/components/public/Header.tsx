"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // Ajustado a la ruta típica de shadcn
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react"; // Opcional: un icono para el logo
import { CurrentUser } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

interface IProps {
    isAuthenticated: boolean;
    currentUser: CurrentUser;
}

export const PublicHeader = ({
    isAuthenticated,
    currentUser,
}: IProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        await authClient.signOut();
        // Limpiar caché de React Query para evitar que persistan datos del usuario anterior
        queryClient.clear();
        router.push("/");
        router.refresh(); // Refresca la página para actualizar el estado de autenticación
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-16 items-center px-4 sm:px-8">
                {/* Logo / Brand - Izquierda */}
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight"
                    >
                        <span className="hidden sm:text-primary">
                            Todo's App
                        </span>
                    </Link>
                </div>

                {/* Navigation Centro - Mis Tareas y Crear */}
                {isAuthenticated && (
                    <nav className="flex flex-1 items-center justify-center gap-4">
                        <Link href="/todos">
                            <Button
                                variant="ghost"
                                className="hidden sm:inline-flex"
                            >
                                Mis Tareas
                            </Button>
                            {/* Versión móvil del botón "Todos" */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="sm:hidden text-xs"
                            >
                                Tareas
                            </Button>
                        </Link>
                        <Link href="/todos/create">
                            <Button
                                variant="outline"
                                className="hidden sm:inline-flex"
                            >
                                Crear
                            </Button>
                            {/* Versión móvil del botón "Crear" */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="sm:hidden text-xs"
                            >
                                + Crear
                            </Button>
                        </Link>
                    </nav>
                )}

                {/* Navigation Derecha - Usuario y Logout */}
                <nav className="ml-auto flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <span className="hidden sm:inline text-sm">
                                {currentUser?.name ||
                                    currentUser?.email}
                            </span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleLogout}
                                className="font-medium"
                            >
                                Cerrar sesión
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="font-medium"
                                >
                                    Iniciar sesión
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    size="sm"
                                    className="font-medium shadow-md"
                                >
                                    Crear cuenta
                                </Button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};
