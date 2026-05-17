import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("CATEGORY SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test(
    "Existing category shows correct products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/category/bakery");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(2);

      await expect(page.getByRole("heading", { name: "Sourdough Bread" }).or(page.locator('p.font-semibold', { hasText: "Sourdough Bread" }))).toBeVisible();
      await expect(page.locator('p.font-semibold', { hasText: "Croissants" })).toBeVisible();
    },
  );

  test(
    "Meat seafood category shows 4 products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/category/meat-seafood");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(4);

      await expect(page.locator('p.font-semibold', { hasText: "Chicken Breast" })).toBeVisible();
      await expect(page.locator('p.font-semibold', { hasText: "Beef Mince" })).toBeVisible();
      await expect(page.locator('p.font-semibold', { hasText: "Lamb Chops" })).toBeVisible();
      await expect(page.locator('p.font-semibold', { hasText: "Atlantic Salmon" })).toBeVisible();
    },
  );

  test(
    "Invalid category shows no products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/category/abc");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(0);
    },
  );

  test(
    "Subcategory filter updates URL",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/category/meat-seafood");

      await page.locator('a[href="/category/meat-seafood?sub=chicken"]').click();
      await expect(page).toHaveURL(/\/category\/meat-seafood\?sub=chicken/);
    },
  );

  test(
    "Subcategory filter shows only matching products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/category/meat-seafood?sub=chicken");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(1);
      await expect(page.locator('p.font-semibold', { hasText: "Chicken Breast" })).toBeVisible();
    },
  );
});