/**
 * Formulario para crear un nuevo TODO.
 *
 * Características:
 * - Validación en tiempo real con Zod y react-hook-form
 * - Auto-generación de slug a partir del título
 * - Estados visuales de carga y error
 * - Feedback con toast notifications
 * - Redirección automática a home tras crear
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TodoCreateSchema, TTodoCreateData } from "@/schemas/";
import { useCreateTodoMutation } from "@/hooks/mutations/use-todos.mutation";
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

interface IProps {
    currentUserId: string;
}

export const TodoFormNew = ({ currentUserId }: IProps) => {
    const router = useRouter();
    const mutation = useCreateTodoMutation(currentUserId);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TTodoCreateData>({
        resolver: zodResolver(TodoCreateSchema),
        mode: "onBlur",
        defaultValues: {
            completed: false,
            title: "",
            slug: "",
        },
    });

    const titleValue = watch("title");

    useEffect(() => {
        const generatedSlug = slugify(titleValue || "");
        setValue("slug", generatedSlug, {
            shouldValidate: false,
            shouldDirty: true,
        });
    }, [titleValue, setValue]);

    // Efecto para manejar el éxito de la mutación
    useEffect(() => {
        if (mutation.isSuccess && mutation.data?.data?.id) {
            toast.success(
                mutation.data?.message || "Tarea creada exitosamente",
            );
            reset();
            router.push(`/`);
        }
    }, [mutation.isSuccess, mutation.data, reset, router]);

    // Efecto para manejar errores de la mutación
    useEffect(() => {
        if (mutation.isError) {
            const errorMessage =
                mutation.error?.message ||
                "No se pudo crear la tarea. Intenta de nuevo.";
            toast.error(errorMessage);
        }
    }, [mutation.isError, mutation.error]);

    const onSubmit = (data: TTodoCreateData) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            disabled // Atributo nativo
                            className={`pl-9 bg-muted/50 cursor-not-allowed font-mono text-xs ${errors.slug ? "border-destructive" : ""}`}
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
                        className={`min-h-30 resize-none ${errors.description ? "border-destructive" : ""}`}
                        {...register("description")}
                    />
                    <SingleFormError
                        message={errors.description?.message}
                    />
                </div>

                {/* Estado Completado */}
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
                    <div className="space-y-0.5">
                        <Label className="text-base font-medium">
                            ¿Tarea completada?
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Marca esta opción si ya finalizaste la
                            tarea.
                        </p>
                    </div>
                    <Switch
                        onCheckedChange={(checked) =>
                            setValue("completed", checked)
                        }
                        checked={watch("completed")}
                    />
                </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
                <Button variant="ghost" className="sm:w-32">
                    <Link href="/" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Cancelar
                    </Link>
                </Button>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="sm:w-40 gap-2"
                >
                    {mutation.isPending ? (
                        "Guardando..."
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Guardar Tarea
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};
