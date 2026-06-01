import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("SEARCH SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test(
    "Search finds correct products and updates URL",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/search?q=Croissants");
      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(1);
      await expect(page.locator('[data-test-id^="product-"]', { hasText: "Croissants" })).toBeVisible();
      await expect(page).toHaveURL(/q=Croissants/);
    },
  );

  test(
    "Invalid search shows no products",
    { tag: "@a1" },
    async ({ page }) => {
      await page.goto("/search?q=xyz123");
      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(0);
      await expect(page.getByText("No products found.")).toBeVisible();
    },
  );

  test(
    "Search with category filter shows correct products",
    { tag: "@a2" },
    async ({ page }) => {
      await page.goto("/search?q=fresh&category=fruit-veg");
      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(1);
      await expect(page.locator('[data-test-id^="product-"]', { hasText: "Broccoli" })).toBeVisible();
    },
  );

  test(
    "Search with category filter updates URL",
    { tag: "@a2" },
    async ({ page }) => {
      await page.goto("/search?q=chicken");
      await page.getByRole("combobox").selectOption("meat-seafood");
      await expect(page).toHaveURL(/category=meat-seafood/);
    },
  );

  test(
    "Search with special characters returns no results",
    { tag: "@a2" },
    async ({ page }) => {
      await page.goto("/search?q=@@@");
      const articles = page.locator('[data-test-id^="product-"]');
      await expect(articles).toHaveCount(0);
      await expect(page.getByText("No products found.")).toBeVisible();
    },
  );
});