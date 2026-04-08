"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData : FormData) {
    const password = formData.get('password') as string;
    if (password === "123") {
        const cookieStore = await cookies();
        cookieStore.set("auth_token", "authenticated", { httpOnly : true});
    }
    redirect("/");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    redirect("/");
}