import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("SEARCH SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test(
    "Search finds single product",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/search?q=Croissants");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(1);
      await expect(page.locator('p.font-semibold', { hasText: "Croissants" })).toBeVisible();
    },
  );

  test(
    "Search finds multiple products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/search?q=fresh");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(4);
    },
  );

  test(
    "Invalid search shows no products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/search?q=xyz123");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(0);
      await expect(page.getByText("0 products.")).toBeVisible();
    },
  );

  test(
    "Search is case insensitive",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/search?q=chicken");

      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(1);
      await expect(page.locator('p.font-semibold', { hasText: "Chicken Breast" })).toBeVisible();
    },
  );
});