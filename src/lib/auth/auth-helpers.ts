import { prismaDB } from "@/lib/db/prismaDB";
import { getSessionDetails } from "@/actions";

export async function validateTodoOwnership(
    todoId: string,
): Promise<boolean> {
    try {
        const { currentUser, isAuthenticated } =
            await getSessionDetails();

        if (!isAuthenticated || !currentUser) return false;

        const todo = await prismaDB.todo.findUnique({
            where: { id: todoId },
        });

        if (!todo) return false;

        if (todo.userId !== currentUser.id) return false;

        return true;
    } catch (error) {
        console.error("[validateTodoOwnership]", error);
        return false;
    }
}
