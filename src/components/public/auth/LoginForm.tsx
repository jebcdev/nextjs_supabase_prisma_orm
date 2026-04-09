"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, TLoginData } from "@/validations/auth"; // Asumiendo que tienes este schema
import { SingleFormError } from "@/components/ui";
import { Input, Label, Button } from "@/components/ui";
import Link from "next/link";
import { loginUser } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TLoginData>({
        resolver: zodResolver(LoginSchema),
        mode: "all",
    });
    const router = useRouter();
    const onSubmit = async (data: TLoginData) => {
        const res = await loginUser(data);

        if (!res.success) {
            toast.error(res.message, {
                description:
                    "Intenta con otro email o revisa tu conexión",
                action: {
                    label: "Got it",
                    onClick: () => toast.dismiss(),
                },
                position: "top-left",
            });
            return;
        }

        toast.success(res.message, {
            description: "Bienvenido de nuevo!",
            position: "top-left",
        });

        router.push(process.env.NEXT_PUBLIC_APP_URL || "/");
    };

    return (
        <div className="space-y-6">
            <header className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Bienvenido de nuevo
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ingresa tus credenciales para acceder a tu cuenta
                </p>
            </header>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        {...register("email")}
                    />
                    {errors.email && (
                        <SingleFormError
                            message={errors.email.message}
                        />
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                    />
                    {errors.password && (
                        <SingleFormError
                            message={errors.password.message}
                        />
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Iniciando sesión..."
                        : "Iniciar sesión"}
                </Button>
            </form>

            <footer className="text-center text-sm">
                <p className="text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <Link
                        href="/register"
                        className="text-primary font-medium hover:underline"
                    >
                        Regístrate ahora
                    </Link>
                </p>
            </footer>
        </div>
    );
};
