import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

async function loginUser(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL("/");
}

async function placeOrder(page: any) {
  await page.locator('[data-test-id^="product-"]').first().click();
  await expect(page).toHaveURL(/\/product\/\d+/);
  const cartResponse = page.waitForResponse(
    (res: any) => res.url().includes("/api/cart") && res.request().method() === "POST"
  );
  await page.getByRole("button", { name: "Add to cart" }).click();
  await cartResponse;
  await page.goto("/checkout");
  await expect(page.getByLabel("Name on card")).toBeVisible();
  await page.getByLabel("Name on card").fill("Test User");
  await page.getByLabel("Card number").fill("1234567890123456");
  await page.getByLabel("Expiry").fill("12/26");
  await page.getByLabel("CVV").fill("123");
  await page.getByRole("button", { name: /Pay/ }).click();
  await expect(page).toHaveURL(/\/checkout\/success/);
}

test.describe("HISTORY SCREEN", () => {
  test(
    "Logged out user sees sign in to view previous purchases in the left menu",
    { tag: "@a2" },
    async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/");
      await expect(page.getByText("Sign in to view")).toBeVisible();
    },
  );

  test(
    "Logged in user sees month of previous purchase and clicking it navigates to history page",
    { tag: "@a2" },
    async ({ page }) => {
      await loginUser(page);
      await placeOrder(page);
      await page.goto("/");
      await expect(page.locator("a[href^='/history/']").first()).toBeVisible();
      const href = await page.locator("a[href^='/history/']").first().getAttribute("href");
      await page.goto(href!);
      await expect(page).toHaveURL(/\/history\/\d+\/\d+/);
    },
  );

  test(
    "History page shows orders completed in that month",
    { tag: "@a2" },
    async ({ page }) => {
      await loginUser(page);
      const now = new Date();
      await page.goto(`/history/${now.getFullYear()}/${now.getMonth() + 1}`);
      await expect(page.getByText(/Order #\d+/).first()).toBeVisible();
    },
  );

  test(
    "History page shows correct items",
    { tag: "@a2" },
    async ({ page }) => {
      await loginUser(page);
      const now = new Date();
      await page.goto(`/history/${now.getFullYear()}/${now.getMonth() + 1}`);
      await expect(page.getByText(/× \d+/).first()).toBeVisible();
    },
  );

  test(
    "History page with no orders for that month shows No orders for this month.",
    { tag: "@a2" },
    async ({ page }) => {
      await loginUser(page);
      await page.goto("/history/2000/1");
      await expect(page.getByText("No orders for this month.")).toBeVisible();
    },
  );

  test(
    "Clicking view details navigates to order confirmation page",
    { tag: "@a2" },
    async ({ page }) => {
      await loginUser(page);
      const now = new Date();
      await page.goto(`/history/${now.getFullYear()}/${now.getMonth() + 1}`);
      await page.getByRole("button", { name: "View details" }).first().click(); 
      await expect(page).toHaveURL(/\/checkout\/success/);
      await expect(page.getByText("Purchase confirmation")).toBeVisible();
      await expect(page.getByText(/Order #\d+/).first()).toBeVisible();
      await expect(page.getByText("Total").first()).toBeVisible();
      await expect(page.getByText(/\$\d+\.\d{2}/).first()).toBeVisible();
      await expect(page.getByRole("link", { name: "Continue shopping" })).toBeVisible();
    },
  );
});