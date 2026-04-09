/**
 * Formulario para editar un TODO existente.
 *
 * Características:
 * - Carga previa de datos del TODO actual
 * - Validación en tiempo real con Zod
 * - Auto-generación de slug a partir del título
 * - Feedback con toast notifications
 * - Redirección automática tras guardar cambios
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TodoUpdateSchema, TTodoUpdate } from "@/schemas/";
import { useUpdateTodoMutation } from "@/hooks/mutations/use-todos.mutation";
import { ITodo } from "@/types/";
import {
    Input,
    Label,
    Button,
    SingleFormError,
    Textarea,
    Switch,
} from "@/components/ui/";
import Link from "next/link";
import { Save, ArrowLeft, Info, Lock } from "lucide-react";
import { slugify } from "@/lib/utils/slugify";

interface IFormEditProps {
    initialTodo: ITodo;
    currentUserId: string;
    onSuccess?: () => void;
}

export const TodoFormEdit = ({
    initialTodo,
    currentUserId,
    onSuccess,
}: IFormEditProps) => {
    const router = useRouter();
    const mutation = useUpdateTodoMutation(currentUserId);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TTodoUpdate>({
        resolver: zodResolver(TodoUpdateSchema),
        mode: "onBlur",
        defaultValues: {
            id: initialTodo.id,
            completed: initialTodo.completed,
            title: initialTodo.title,
            slug: initialTodo.slug,
            description: initialTodo.description || "",
        },
    });

    const titleValue = watch("title");
    const slugValue = watch("slug");

    // Auto-update slug based on title
    useEffect(() => {
        const generatedSlug = slugify(titleValue || "");
        setValue("slug", generatedSlug, {
            shouldValidate: false,
            shouldDirty: true,
        });
    }, [titleValue, setValue]);

    // Handle mutation success
    useEffect(() => {
        if (mutation.isSuccess && mutation.data?.data?.id) {
            toast.success(
                mutation.data?.message ||
                    "Tarea actualizada exitosamente",
            );
            if (onSuccess) {
                onSuccess();
            } else {
                router.push(`/${initialTodo.id}`);
            }
        }
    }, [
        mutation.isSuccess,
        mutation.data,
        onSuccess,
        router,
        initialTodo.id,
    ]);

    // Handle mutation errors
    useEffect(() => {
        if (mutation.isError) {
            const errorMessage =
                mutation.error?.message ||
                "No se pudo actualizar la tarea. Intenta de nuevo.";
            toast.error(errorMessage);
        }
    }, [mutation.isError, mutation.error]);

    const onSubmit = (data: TTodoUpdate) => {
        mutation.mutate(data);
    };

    const isLoading = mutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/${initialTodo.id}`}
                        className="text-primary hover:underline flex items-center gap-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Link>
                </div>
                <h1 className="text-2xl font-bold">Editar Tarea</h1>
            </div>

            <div className="grid gap-6">
                {/* Título */}
                <div className="grid gap-2">
                    <Label
                        htmlFor="title"
                        className="text-sm font-semibold"
                    >
                        Título de la tarea
                    </Label>
                    <Input
                        id="title"
                        placeholder="Ej: Comprar componentes de audio"
                        className={
                            errors.title ? "border-destructive" : ""
                        }
                        disabled={isLoading}
                        {...register("title")}
                    />
                    <SingleFormError
                        message={errors.title?.message}
                    />
                </div>

                {/* Slug - READ ONLY */}
                <div className="grid gap-2">
                    <Label
                        htmlFor="slug"
                        className="text-sm font-semibold flex items-center gap-2"
                    >
                        Slug (URL)
                        <Lock className="h-3 w-3 text-muted-foreground" />
                    </Label>
                    <div className="relative">
                        <Input
                            id="slug"
                            placeholder="auto-generado-desde-el-titulo"
                            disabled
                            className={`pl-9 bg-muted/50 cursor-not-allowed font-mono text-xs ${
                                errors.slug
                                    ? "border-destructive"
                                    : ""
                            }`}
                            {...register("slug")}
                        />
                        <span className="absolute left-3 top-2.5 text-muted-foreground">
                            <Info className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground italic">
                        Este campo se genera automáticamente a partir
                        del título.
                    </p>
                    <SingleFormError message={errors.slug?.message} />
                </div>

                {/* Descripción */}
                <div className="grid gap-2">
                    <Label
                        htmlFor="description"
                        className="text-sm font-semibold"
                    >
                        Descripción
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="Detalla los pasos o requerimientos de esta tarea..."
                        className={`min-h-30 resize-none ${
                            errors.description
                                ? "border-destructive"
                                : ""
                        }`}
                        disabled={isLoading}
                        {...register("description")}
                    />
                    <SingleFormError
                        message={errors.description?.message}
                    />
                </div>

                {/* Estado Completado */}
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
                    <div className="space-y-0.5">
                        <Label
                            htmlFor="completed"
                            className="text-sm font-semibold"
                        >
                            Marcar como completada
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            {watch("completed")
                                ? "Esta tarea está marcada como completada"
                                : "Marca esta casilla cuando hayas completado la tarea"}
                        </p>
                    </div>
                    <input type="hidden" {...register("id")} />
                    <Switch
                        id="completed"
                        disabled={isLoading}
                        {...register("completed", {
                            setValueAs: (value) =>
                                value === true || value === "true",
                        })}
                        checked={watch("completed")}
                        onCheckedChange={(checked) =>
                            setValue("completed", checked, {
                                shouldValidate: false,
                                shouldDirty: true,
                            })
                        }
                    />
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2"
                size="lg"
            >
                <Save className="h-4 w-4" />
                {isLoading ? "Actualizando..." : "Actualizar Tarea"}
            </Button>
        </form>
    );
};
