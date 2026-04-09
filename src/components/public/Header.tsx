"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // Ajustado a la ruta típica de shadcn
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react"; // Opcional: un icono para el logo
import { User } from "../../../generated/prisma/client";

interface IProps {
  isAuthenticated: boolean;
  currentUser:User
}

export const PublicHeader = ({ isAuthenticated,currentUser }: IProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh(); // Refresca la página para actualizar el estado de autenticación
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold tracking-tight">
            Todo's <span className="text-primary">App</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/todos">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Mis Tareas
                </Button>
                {/* Versión móvil del botón "Todos" */}
                <Button variant="ghost" size="sm" className="sm:hidden text-xs">
                  Tareas
                </Button>
              </Link>
              <span>
{currentUser?.name || currentUser?.email}


              </span>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout}
                className="font-medium"
              >
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="font-medium">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-medium shadow-md">
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