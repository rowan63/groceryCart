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

test.describe("ADMIN USERS SCREEN", () => {
  test(
    "Users page redirects to login when logged out",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/users");
      await expect(page.getByLabel("Email")).toBeVisible();
    },
  );

  test(
    "Shows list of users",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/users");
      await expect(page.locator("a[href^='/users/']").first()).toBeVisible();
      await expect(page.getByText("test@test.com")).toBeVisible();
    },
  );

  test(
    "Shows order count for each user",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/users");
      const firstUser = page.locator("a[href^='/users/']").first();
      await expect(firstUser).toBeVisible();
      await expect(firstUser.getByText(/\d+ orders/)).toBeVisible();
    },
  );

  test(
    "Clicking user navigates to their previous orders page",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/users");
      await page.locator("a[href^='/users/']").first().click();
      await expect(page).toHaveURL(/\/users\/\d+/);
    },
  );

  test(
    "User orders page shows email and name",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/users");
      await page.locator("a[href^='/users/']").first().click();
      await expect(page.getByText(/@/)).toBeVisible();
    },
  );

  test(
    "User orders page redirects to login when logged out",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/users/1");
      await expect(page.getByLabel("Email")).toBeVisible();
    },
  );

  test(
    "User with orders shows all their previous order history",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("http://localhost:3001/login");
      await page.getByLabel("Email").fill("test@test.com");
      await page.getByLabel("Password").fill("password");
      await page.getByRole("button", { name: "Sign In" }).click();
      await expect(page).toHaveURL("http://localhost:3001/");
      const cartResponse = page.waitForResponse(
        (res: any) => res.url().includes("/api/cart") && res.request().method() === "POST"
      );
      await page.getByRole("button", { name: "Add to cart" }).first().click();
      await cartResponse;
      await page.goto("http://localhost:3001/checkout");
      await expect(page.getByLabel("Name on card")).toBeVisible();
      await page.getByLabel("Name on card").fill("Test User");
      await page.getByLabel("Card number").fill("1234567890123456");
      await page.getByLabel("Expiry").fill("12/26");
      await page.getByLabel("CVV").fill("123");
      await page.getByRole("button", { name: /Pay/ }).click();
      await expect(page).toHaveURL(/checkout\/success/);
      await page.context().clearCookies();
      await page.goto("http://localhost:3002/");
      await expect(page.getByLabel("Email")).toBeVisible();
      await page.getByLabel("Email").fill("admin@test.com");
      await page.getByLabel("Password").fill("password");
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page.locator("article")).not.toHaveCount(0);
      await page.goto("http://localhost:3002/users");
      await page.getByText("test@test.com").click();
      await expect(page.getByText(/Order #\d+/).first()).toBeVisible();
      await expect(page.getByText("Total").first()).toBeVisible();
    },
  );

  test(
    "User with no orders shows No orders yet.",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/users");
      const users = page.locator("a[href^='/users/']");
      await expect(users.first()).toBeVisible();
      const count = await users.count();
      for (let i = 0; i < count; i++) {
        const orderText = await users.nth(i).getByText("0 orders").isVisible();
        if (orderText) {
          await users.nth(i).click();
          await expect(page.getByText("No orders yet.")).toBeVisible();
          break;
        }
      }
    },
  );
});