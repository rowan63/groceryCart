import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("CATEGORY SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test(
    "(Bakery) Category shows correct products",
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
    "Invalid category shows no products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/category/abc");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(0);
    },
  );

  test(
    "Subcategory filter updates URL and shows only matching products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/category/meat-seafood");

      await page.locator('a[href="/category/meat-seafood?sub=chicken"]').click();
      await expect(page).toHaveURL(/\/category\/meat-seafood\?sub=chicken/);

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(1);
      await expect(page.locator('p.font-semibold', { hasText: "Chicken Breast" })).toBeVisible();
    },
  );
});