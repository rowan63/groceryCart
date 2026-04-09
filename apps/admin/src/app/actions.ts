"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { client } from "@repo/db/client";
import { z } from "zod";

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    if (password === "123") {
        const cookieStore = await cookies();
        cookieStore.set("auth_token", "authenticated", {
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


const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required").max(200, "Description is too long. Maximum is 200 characters"), content: z.string().min(1, "Content is required"),
    imageUrl: z.string().min(1, "Image URL is required").url("This is not a valid URL"),
    tags: z.string().min(1, "At least one tag is required")
})

export async function updatePost(urlId: string, formData: FormData) {
    const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        content: formData.get('content') as string,
        imageUrl: formData.get('imageUrl') as string,
        tags: formData.get('tags') as string,
    }

    const result = postSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.format() };
    }

    await client.db.post.update({
        where: { urlId },
        data: result.data,
    });

    return { success: true };
}

export async function createPost(formData: FormData) {
    const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        content: formData.get('content') as string,
        imageUrl: formData.get('imageUrl') as string,
        tags: formData.get('tags') as string,
    }

    const result = postSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.format() };
    }

    const urlId = result.data.title.toLowerCase().replace(/\s+/g, '-');

    await client.db.post.create({
        data: { ...result.data, urlId },
    });

    redirect("/");
}