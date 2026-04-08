export const APP_NAME = "Todo's App";
export const APP_DESCRIPTION =
    "Una aplicación de gestión de tareas (todos) construida con Next.js, Supabase y Prisma ORM. Permite crear, editar, eliminar y marcar tareas como completadas. Ideal para organizar tu día a día de manera eficiente.";

const generateTitle = (title?: string) => {
    return title ? `${title} | ${APP_NAME}` : APP_NAME;
};

const generateDescription = (description?: string) => {
    return description || APP_DESCRIPTION;
};

const generateAsyncTitle = async (
    title?: string,
): Promise<string> => {
    return title ? `${title} | ${APP_NAME}` : APP_NAME;
};

const generateAsyncDescription = async (
    description?: string,
): Promise<string> => {
    return description || APP_DESCRIPTION;
};

export {
    generateTitle,
    generateDescription,
    generateAsyncTitle,
    generateAsyncDescription,
};
