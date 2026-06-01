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

test.describe("ADMIN LIST SCREEN", () => {
  test(
    "Shows all products after login",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      const articles = page.locator("article");
      await expect(articles).not.toHaveCount(0);
    },
  );

  test(
    "Filter by name shows matching products",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.getByLabel("Filter by Name").fill("Chicken");
      await expect(page.locator("article")).toHaveCount(1);
      await expect(page.getByText("Chicken Breast", { exact: true })).toBeVisible();
    },
  );

  test(
    "Filter by name shows no results for no match",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.getByLabel("Filter by Name").fill("xyz123notaproduct");
      await expect(page.locator("article")).toHaveCount(0);
    },
  );

  test(
    "Filter by category shows matching products",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.getByLabel("Filter by Category").selectOption("bakery");
      await expect(page.getByText("Sourdough Bread", { exact: true })).toBeVisible();
      await expect(page.getByText("Croissants", { exact: true })).toBeVisible();
    },
  );

  test(
    "Filter by category combined with name filter works",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.getByLabel("Filter by Category").selectOption("meat-seafood");
      await page.getByLabel("Filter by Name").fill("Salmon");
      await expect(page.locator("article")).toHaveCount(1);
      await expect(page.getByText("Atlantic Salmon", { exact: true })).toBeVisible();
    },
  );

  test(
    "Clicking edit navigates to edit page",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.locator("article").first().getByRole("link", { name: "Edit" }).click();
      await expect(page).toHaveURL(/\/product\/\d+/);
    },
  );

  test(
    "Add product button navigates to create page",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.getByRole("link", { name: "Add product" }).click();
      await expect(page).toHaveURL(/\/products\/create/);
    },
  );

  test(
    "Toggle active button works and persists after reload",
    { tag: "@a3" },
    async ({ page }) => {
      await seed();
      await adminLogin(page);
      const article = page.locator("article").first();
      await article.getByRole("button", { name: "Active" }).click();
      await expect(article.getByRole("button", { name: "Inactive" })).toBeVisible();
      await page.waitForLoadState("networkidle");
      await expect(page.locator("article").first().getByRole("button", { name: "Inactive" })).toBeVisible();
    },
  );

  test(
    "Sale items are displayed with SALE wording",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await expect(page.locator("article").filter({ hasText: "SALE" }).first()).toBeVisible();
    },
  );
});