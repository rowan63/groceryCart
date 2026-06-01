import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("REGISTER SCREEN", () => {
    test.beforeAll(async () => {
        await seed();
    });

    test(
        "Register page loads and valid registration redirects to login",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/register");
            await expect(page.getByLabel("Name")).toBeVisible();
            await expect(page.getByLabel("Email")).toBeVisible();
            await expect(page.getByLabel("Password")).toBeVisible();
            await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
            await page.getByLabel("Name").fill("New User");
            await page.getByLabel("Email").fill(`user${Date.now()}@test.com`);
            await page.getByLabel("Password").fill("password");
            await page.getByRole("button", { name: "Create Account" }).click();
            await expect(page).toHaveURL("/login");
        },
    );

    test(
        "Missing name shows error",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/register");
            await page.getByLabel("Email").fill("newuser@test.com");
            await page.getByLabel("Password").fill("password");
            await page.getByRole("button", { name: "Create Account" }).click();
            await expect(page.getByText("Please enter your name")).toBeVisible();
        },
    );

    test(
        "Invalid email format shows error",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/register");
            await page.getByLabel("Name").fill("New User");
            await page.getByLabel("Email").fill("notanemail");
            await page.getByLabel("Password").fill("password");
            await page.getByRole("button", { name: "Create Account" }).click();
            await expect(page.getByText("Please enter a valid email address")).toBeVisible();
        },
    );

    test(
        "Missing password shows error",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/register");
            await page.getByLabel("Name").fill("New User");
            await page.getByLabel("Email").fill("newuser@test.com");
            await page.getByRole("button", { name: "Create Account" }).click();
            await expect(page.getByText("Please enter a password")).toBeVisible();
        },
    );

    test(
        "Duplicate email shows error",
        { tag: "@a1" },
        async ({ page }) => {
            await page.goto("/register");
            await page.getByLabel("Name").fill("Test User");
            await page.getByLabel("Email").fill("test@test.com");
            await page.getByLabel("Password").fill("password");
            await page.getByRole("button", { name: "Create Account" }).click();
            await expect(page.getByText(/already exists|already in use|taken/i)).toBeVisible();
        },
    );
});