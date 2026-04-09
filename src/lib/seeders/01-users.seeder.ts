import { prismaDB } from "@/lib/db/prismaDB";
import { auth } from "@/lib/auth/auth";

export const seedInitialUsers = async () => {
    try {
        await prismaDB.session.deleteMany({});
        await prismaDB.account.deleteMany({});
        await prismaDB.verification.deleteMany({});
        await prismaDB.user.deleteMany({});

        console.log("🗑️  Cleaned existing users...");

        // 1. Crear usuarios sin role
        const adminUser = await auth.api.signUpEmail({
            body: {
                name: "Admin",
                email: "admin@admin.com",
                password: "123456789",
            },
        });

        const systemUser = await auth.api.signUpEmail({
            body: {
                name: "User",
                email: "user@user.com",
                password: "123456789",
            },
        });

        const customerUser = await auth.api.signUpEmail({
            body: {
                name: "Customer",
                email: "customer@customer.com",
                password: "123456789",
            },
        });

        console.log("✅ Users created successfully");

        return {
            adminUser,
            systemUser,
            customerUser,
            adminUserId: adminUser.user?.id,
        };
    } catch (error) {
        console.error("❌ Error seeding users:", error);
        throw error;
    }
};
