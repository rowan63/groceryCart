"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { client } from "@repo/db/client";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    if (password === "123") {
        const token = jwt.sign({ authenticated: true }, env.JWT_SECRET || "secret");
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            path: "/",
        });
    }
    redirect("/");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    redirect("/");
}


const productSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim(),
    price: z.coerce.number().positive("Price must be positive"),
    category: z.string().trim().min(1, "Category is required"),
    subcategory: z.string().trim(),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

export async function createProduct(formData: FormData) {
    const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: formData.get('price') as string,
        category: formData.get('category') as string,
        subcategory: formData.get('subcategory') as string,
        stock: formData.get('stock') as string,
    };

    const result = productSchema.safeParse(data);
    if (!result.success) return { error: result.error.format() };

    await client.db.product.create({ data: result.data });
    return { success: true };
}

export async function updateProduct(id: number, formData: FormData) {
    const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: formData.get('price') as string,
        category: formData.get('category') as string,
        subcategory: formData.get('subcategory') as string,
        stock: formData.get('stock') as string,
    };

    const result = productSchema.safeParse(data);
    if (!result.success) return { error: result.error.format() };

    await client.db.product.update({ where: { id }, data: result.data });
    return { success: true };
}

export async function toggleActive(id: number, active: boolean) {
    await client.db.product.update({ where: { id }, data: { active: !active } });
}