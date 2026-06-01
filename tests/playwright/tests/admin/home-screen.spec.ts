import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

async function adminLogin(page: any) {
  await page.goto("/");
  await page.getByLabel("Email").fill("admin@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator("article")).not.toHaveCount(0);
}

test.describe("ADMIN HOME SCREEN", () => {
  test(
    "Shows login screen when logged out",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
    },
  );

  test(
    "Login page has email and password fields and valid credentials log in",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
      await page.getByLabel("Email").fill("admin@test.com");
      await page.getByLabel("Password").fill("password");
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page.getByText("FreshCart Admin")).toBeVisible();
      await expect(page.locator("article")).not.toHaveCount(0);
    },
  );

  test(
    "Auth cookie is set after login",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      const cookies = await page.context().cookies();
      const authCookie = cookies.find((c) => c.name === "auth_token");
      expect(authCookie).toBeDefined();
    },
  );

  test(
    "Invalid credentials dont work",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Email").fill("admin@test.com");
      await page.getByLabel("Password").fill("wrongpassword");
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page.getByLabel("Email")).toBeVisible();
    },
  );

  test(
    "Non-admin user cannot log in",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Email").fill("test@test.com");
      await page.getByLabel("Password").fill("password");
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.locator("article")).toHaveCount(0);
    },
  );

  test(
    "Logout button visible when logged in and works",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
      await page.getByRole("button", { name: "Logout" }).click();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.locator("article")).toHaveCount(0);
    },
  );
});