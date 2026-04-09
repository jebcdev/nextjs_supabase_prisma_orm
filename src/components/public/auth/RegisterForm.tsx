"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, TRegisterData } from "@/validations/auth";

import {
    Input,
    Label,
    Button,
    SingleFormError,
} from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { toast } from "sonner";

export const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TRegisterData>({
        resolver: zodResolver(RegisterSchema),
        mode: "onBlur",
    });
    const router = useRouter();

    const onSubmit = async (data: TRegisterData) => {
        const res = await registerUser(data);

        if (!res.success) return;
        toast.error("res.message", {
            description:
                "Intenta con otro email o revisa tu conexión",
            action: {
                label: "Got it",
                onClick: () => toast.dismiss(),
            },
            position: "top-left",
        });

        toast.success(res.message, {
            description:
                "Ahora puedes iniciar sesión con tu nueva cuenta",
            action: {
                label: "Iniciar sesión",
                onClick: () => router.push("/login"),
            },
        });

        router.push(process.env.NEXT_PUBLIC_APP_URL || "/");
    };

    return (
        <div className="space-y-6">
            <header className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Crear una cuenta
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ingresa tus datos para empezar a comprar
                </p>
            </header>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                {/* Nombre */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre"
                        {...register("name")}
                    />
                    {errors.name && (
                        <SingleFormError
                            message={errors.name.message}
                        />
                    )}
                </div>

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
                    <Label htmlFor="password">Contraseña</Label>
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

                {/* Confirmación */}
                <div className="space-y-2">
                    <Label htmlFor="passwordConfirmation">
                        Confirmar contraseña
                    </Label>
                    <Input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="••••••••"
                        {...register("passwordConfirmation")}
                    />
                    {errors.passwordConfirmation && (
                        <SingleFormError
                            message={
                                errors.passwordConfirmation.message
                            }
                        />
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Registrando..." : "Registrarse"}
                </Button>
            </form>

            <footer className="text-center text-sm">
                <p className="text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href="/login"
                        className="text-primary font-medium hover:underline"
                    >
                        Inicia sesión aquí
                    </Link>
                </p>
            </footer>
        </div>
    );
};
