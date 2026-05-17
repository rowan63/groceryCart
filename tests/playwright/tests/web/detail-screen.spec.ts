import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("DETAIL SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test(
    "Add to cart from detail page when logged out redirects to login",
    { tag: "@a1" },
    async ({ page }) => {
      await page.context().clearCookies();
      await page.goto("/");
      await page.locator('[data-test-id^="product-"]').first().click();

      await page.getByRole("button", { name: "Add to cart" }).click();
      await expect(page).toHaveURL(/\/login/);
    },
  );

  test(
    "Detail page shows product info",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/");
      await page.locator('[data-test-id^="product-"]').first().click();
      await expect(page).toHaveURL(/\/product\/\d+/);

      await expect(page.getByRole("heading", { name: "Chicken Breast" })).toBeVisible();
      await expect(page.getByText("Free range chicken breast")).toBeVisible();
      await expect(page.getByText("$12.99")).toBeVisible();
      await expect(page.getByText(/in stock/)).toBeVisible();
    },
  );

  test(
    "Detail page shows category",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/");
      await page.locator('[data-test-id^="product-"]').first().click();

      await expect(page.getByText("Poultry, Meat and Seafood")).toBeVisible();
    },
  );

  test(
    "Detail page has add to cart button",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/");
      await page.locator('[data-test-id^="product-"]').first().click();

      await expect(page.getByRole("button", { name: "Add to cart" })).toBeVisible();
    },
  );

  test(
    "Add to cart from detail page when logged in adds to cart",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/login");
      await page.getByLabel("Email").fill("test@test.com");
      await page.getByLabel("Password").fill("password");
      await page.getByRole("button", { name: "Sign In" }).click();
      await expect(page).toHaveURL("/");

      await page.locator('[data-test-id^="product-"]').first().click();
      await page.getByRole("button", { name: "Add to cart" }).click();
      await expect(page.getByRole("heading", { name: /Cart/ })).toBeVisible();
    },
  );
});