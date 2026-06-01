import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("LOGIN SCREEN", () => {
    test.beforeAll(async () => {
        await seed();
    });

    test(
        "Login page loads and valid credentials redirect to home",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/login");
            await expect(page.getByLabel("Email")).toBeVisible();
            await expect(page.getByLabel("Password")).toBeVisible();
            await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
            await page.getByLabel("Email").fill("test@test.com");
            await page.getByLabel("Password").fill("password");
            await page.getByRole("button", { name: "Sign In" }).click();
            await expect(page).toHaveURL("/");
        },
    );

    test(
        "Invalid password shows error message",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/login");
            await page.getByLabel("Email").fill("test@test.com");
            await page.getByLabel("Password").fill("wrongpassword");
            await page.getByRole("button", { name: "Sign In" }).click();
            await expect(page.getByText("Invalid email or password")).toBeVisible();
        },
    );

    test(
        "Invalid email format shows validation error",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/login");
            await page.getByLabel("Email").fill("notanemail");
            await page.getByLabel("Password").fill("password");
            await page.getByRole("button", { name: "Sign In" }).click();
            await expect(page.getByText("Please enter a valid email address")).toBeVisible();
        },
    );

    test(
        "Register link navigates to register page",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/login");
            await page.getByRole("link", { name: /register/i }).click();
            await expect(page).toHaveURL(/\/register/);
        },
    );

    test(
        "Logout works after logging in",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/login");
            await page.getByLabel("Email").fill("test@test.com");
            await page.getByLabel("Password").fill("password");
            await page.getByRole("button", { name: "Sign In" }).click();
            await expect(page).toHaveURL("/");
            await page.getByText("Logout").click();
            await expect(page).toHaveURL("/");
            await expect(page.getByText("Logout")).not.toBeVisible();
        },
    );
});