/**
 * Componente grid para mostrar la lista completa de TODOs.
 *
 * Características:
 * - Carga automática de todos los TODOs via React Query
 * - Búsqueda en tiempo real por título, descripción, slug
 * - Filtrado por estado (completados, incompletos, todos)
 * - Manejo de estados de carga, error y sin datos
 * - Renderización optimizada con useMemo
 */
"use client";

import { useState, useMemo } from "react";
import { useTodosQuery } from "@/hooks/queries/use-todos.query";
import { TodoCard } from "./TodoCard";
import Loading from "@/app/loading";
import { NoData } from "@/components/ui/no-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";
import { ITodo } from "@/types";


interface IProps {
    currentUserId: string;
}
type FilterStatus = "all" | "completed" | "incomplete";
/**
 * Función helper para filtrar y buscar TODOs.
 */
const filterAndSearchTodos = (
    todos: ITodo[],
    searchQuery: string,
    filterStatus: FilterStatus,
): ITodo[] => {
    return todos.filter((todo) => {
        // 1. Filtrar por estado primero
        if (filterStatus === "completed" && !todo.completed)
            return false;
        if (filterStatus === "incomplete" && todo.completed)
            return false;

        // 2. Luego filtrar por búsqueda (case-insensitive)
        if (searchQuery.trim().length > 0) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = todo.title
                .toLowerCase()
                .includes(query);
            const matchesSlug = todo.slug
                .toLowerCase()
                .includes(query);
            const matchesDescription = todo.description
                ?.toLowerCase()
                .includes(query);

            return matchesTitle || matchesSlug || matchesDescription;
        }

        return true;
    });
};

export const TodosGrid = (
    { currentUserId }: IProps
) => {
    const { data: response, isLoading, isError } = useTodosQuery(currentUserId);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterStatus, setFilterStatus] =
        useState<FilterStatus>("all");

    // Filtrar y buscar usando useMemo para optimizar re-renders
    const filteredTodos = useMemo(() => {
        if (!response?.data) return [];
        return filterAndSearchTodos(
            response.data,
            searchQuery,
            filterStatus,
        );
    }, [response?.data, searchQuery, filterStatus]);

    if (isLoading) return <Loading />;

    if (isError || !response?.success) return <NoData />;

    if (!response.data.length) return <NoData />;

    const hasResults = filteredTodos.length > 0;
    const hasNoResultsAfterFilter =
        filteredTodos.length === 0 && response.data.length > 0;

    return (
        <section className="w-full space-y-6">
            {/* Barra de búsqueda */}
            <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por título, descripción, slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9"
                />
            </div>

            {/* Botones de filtro */}
            <div className="w-full flex flex-wrap gap-2">
                <Button
                    variant={
                        filterStatus === "all" ? "secondary" : "ghost"
                    }
                    onClick={() => setFilterStatus("all")}
                    className="transition-all"
                >
                    Todos
                </Button>
                <Button
                    variant={
                        filterStatus === "completed"
                            ? "secondary"
                            : "ghost"
                    }
                    onClick={() => setFilterStatus("completed")}
                    className="transition-all"
                >
                    Completados
                </Button>
                <Button
                    variant={
                        filterStatus === "incomplete"
                            ? "secondary"
                            : "ghost"
                    }
                    onClick={() => setFilterStatus("incomplete")}
                    className="transition-all"
                >
                    Pendientes
                </Button>
            </div>

            {/* Contador de resultados */}
            {(searchQuery.trim().length > 0 ||
                filterStatus !== "all") && (
                <div className="w-full text-sm text-muted-foreground">
                    Mostrando{" "}
                    <span className="font-semibold">
                        {filteredTodos.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold">
                        {response.data.length}
                    </span>{" "}
                    tareas
                </div>
            )}

            {/* Grid de tareas o placeholder */}
            <div className="w-full min-h-75">
                {hasResults ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTodos.map((todo) => (
                            <TodoCard key={todo.id} todo={todo} currentUserId={currentUserId} />
                        ))}
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center min-h-75 py-12">
                        <div className="rounded-full bg-muted/40 p-3 mb-4">
                            <FilterX className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {hasNoResultsAfterFilter
                                ? "Sin resultados"
                                : "No hay tareas disponibles"}
                        </h3>
                        <p className="text-sm text-muted-foreground text-center max-w-xs">
                            {hasNoResultsAfterFilter
                                ? "Intenta ajustar tu búsqueda o cambiar los filtros"
                                : "Comienza creando tu primera tarea"}
                        </p>
                        {hasNoResultsAfterFilter && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery("");
                                    setFilterStatus("all");
                                }}
                                className="mt-4"
                            >
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
