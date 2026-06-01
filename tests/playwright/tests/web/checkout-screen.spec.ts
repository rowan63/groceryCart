import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeEach(async () => {
  await seed();
});

async function loginAndAddToCart(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL("/");
  const cartResponse = page.waitForResponse(
    (res: any) => res.url().includes("/api/cart") && res.request().method() === "POST"
  );
  await page.getByRole("button", { name: "Add to cart" }).first().click();
  await cartResponse;
  await page.goto("/checkout");
}

test.describe("CHECKOUT SCREEN", () => {
  test(
    "Logged out user going to /checkout redirects to login screen",
    { tag: "@a2" },
    async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/checkout");
      await expect(page).toHaveURL(/\/login/);
    },
  );

  test(
    "Logged in user with empty cart sees your cart is empty on /checkout",
    { tag: "@a2" },
    async ({ page }) => {
      await page.goto("/login");
      await page.getByLabel("Email").fill("test@test.com");
      await page.getByLabel("Password").fill("password");
      await page.getByRole("button", { name: "Sign In" }).click();
      await expect(page).toHaveURL("/");
      await page.goto("/checkout");
      await expect(page.getByText("Your cart is empty.")).toBeVisible();
    },
  );

  test(
    "Missing name on card shows error",
    { tag: "@a2" },
    async ({ page }) => {
      await loginAndAddToCart(page);
      await expect(page.getByLabel("Name on card")).toBeVisible();
      await page.getByLabel("Card number").fill("1234567890123456");
      await page.getByLabel("Expiry").fill("12/26");
      await page.getByLabel("CVV").fill("123");
      await page.getByRole("button", { name: /Pay/ }).click();
      await expect(page.getByText("Name is required")).toBeVisible();
    },
  );

  test(
    "Invalid card number length shows error",
    { tag: "@a2" },
    async ({ page }) => {
      await loginAndAddToCart(page);
      await expect(page.getByLabel("Name on card")).toBeVisible();
      await page.getByLabel("Name on card").fill("Test User");
      await page.getByLabel("Card number").fill("1234");
      await page.getByLabel("Expiry").fill("12/26");
      await page.getByLabel("CVV").fill("123");
      await page.getByRole("button", { name: /Pay/ }).click();
      await expect(page.getByText("Enter a valid 16-digit card number")).toBeVisible();
    },
  );

  test(
    "Invalid expiry format shows error",
    { tag: "@a2" },
    async ({ page }) => {
      await loginAndAddToCart(page);
      await expect(page.getByLabel("Name on card")).toBeVisible();
      await page.getByLabel("Name on card").fill("Test User");
      await page.getByLabel("Card number").fill("1234567890123456");
      await page.getByLabel("Expiry").fill("1234");
      await page.getByLabel("CVV").fill("123");
      await page.getByRole("button", { name: /Pay/ }).click();
      await expect(page.getByText("Use MM/YY format")).toBeVisible();
    },
  );

  test(
    "CVV too short shows error",
    { tag: "@a2" },
    async ({ page }) => {
      await loginAndAddToCart(page);
      await expect(page.getByLabel("Name on card")).toBeVisible();
      await page.getByLabel("Name on card").fill("Test User");
      await page.getByLabel("Card number").fill("1234567890123456");
      await page.getByLabel("Expiry").fill("12/26");
      await page.getByLabel("CVV").fill("12");
      await page.getByRole("button", { name: /Pay/ }).click();
      await expect(page.getByText("Enter a valid CVV")).toBeVisible();
    },
  );

  test(
    "Pressing pay when all fields are valid redirects to success page",
    { tag: "@a2" },
    async ({ page }) => {
      await loginAndAddToCart(page);
      await expect(page.getByLabel("Name on card")).toBeVisible();
      await page.getByLabel("Name on card").fill("Test User");
      await page.getByLabel("Card number").fill("1234567890123456");
      await page.getByLabel("Expiry").fill("12/26");
      await page.getByLabel("CVV").fill("123");
      await page.getByRole("button", { name: /Pay/ }).click();
      await expect(page).toHaveURL(/\/checkout\/success/);
    },
  );

  test(
    "Success page shows order details and total",
    { tag: "@a2" },
    async ({ page }) => {
      await loginAndAddToCart(page);
      await expect(page.getByLabel("Name on card")).toBeVisible();
      await page.getByLabel("Name on card").fill("Test User");
      await page.getByLabel("Card number").fill("1234567890123456");
      await page.getByLabel("Expiry").fill("12/26");
      await page.getByLabel("CVV").fill("123");
      await page.getByRole("button", { name: /Pay/ }).click();
      await expect(page).toHaveURL(/\/checkout\/success/);
      await expect(page.getByText("Purchase confirmation")).toBeVisible();
      await expect(page.getByText(/Order #\d+/).first()).toBeVisible();
      await expect(page.getByText("Total").first()).toBeVisible();
      await expect(page.getByText(/\$\d+\.\d{2}/).first()).toBeVisible();
      await expect(page.getByRole("link", { name: "Continue shopping" })).toBeVisible();
    },
  );
});