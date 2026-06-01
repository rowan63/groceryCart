import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeEach(async () => {
  await seed();
});

async function adminLogin(page: any) {
  await page.goto("/");
  await page.getByLabel("Email").fill("admin@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator("article")).not.toHaveCount(0);
}

async function goToFirstProduct(page: any) {
  await adminLogin(page);
  await page.locator("article").first().getByRole("link", { name: "Edit" }).click();
}

test.describe("ADMIN UPDATE FORM", () => {
  test(
    "Accessing create page when logged out redirects to login",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/products/create");
      await expect(page.getByLabel("Email")).toBeVisible();
    },
  );

  test(
    "Accessing edit page when logged out redirects to login",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/product/1");
      await expect(page.getByLabel("Email")).toBeVisible();
    },
  );

  test(
    "Create form shows all fields",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/products/create");

      await expect(page.getByLabel("Name")).toBeVisible();
      await expect(page.getByLabel("Description")).toBeVisible();
      await expect(page.getByLabel("Price")).toBeVisible();
      await expect(page.getByLabel("Category", { exact: true })).toBeVisible();
      await expect(page.getByLabel("Subcategory")).toBeVisible();
      await expect(page.getByLabel("Stock")).toBeVisible();
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    },
  );

  test(
    "Edit form loads existing product data",
    { tag: "@a3" },
    async ({ page }) => {
      await goToFirstProduct(page);

      const nameValue = await page.getByLabel("Name").inputValue();
      expect(nameValue.length).toBeGreaterThan(0);

      const priceValue = await page.getByLabel("Price").inputValue();
      expect(priceValue.length).toBeGreaterThan(0);
    },
  );

  test(
    "Missing name shows error",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/products/create");

      await page.getByLabel("Price").fill("9.99");
      await page.getByLabel("Category", { exact: true }).selectOption("bakery");
      await page.getByLabel("Stock").fill("10");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Name is required")).toBeVisible();
    },
  );

  test(
    "Negative price shows error",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/products/create");

      await page.getByLabel("Name").fill("Test Product");
      await page.getByLabel("Price").fill("-5");
      await page.getByLabel("Category", { exact: true }).selectOption("bakery");
      await page.getByLabel("Stock").fill("10");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Price must be positive")).toBeVisible();
    },
  );

  test(
    "Negative stock shows error",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/products/create");

      await page.getByLabel("Name").fill("Test Product");
      await page.getByLabel("Price").fill("9.99");
      await page.getByLabel("Category", { exact: true }).selectOption("bakery");
      await page.getByLabel("Stock").fill("-1");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Stock cannot be negative")).toBeVisible();
    },
  );

  test(
    "Missing category shows error",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/products/create");

      await page.getByLabel("Name").fill("Test Product");
      await page.getByLabel("Price").fill("9.99");
      await page.getByLabel("Stock").fill("10");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Category is required")).toBeVisible();
    },
  );

  test(
    "Please fix errors message shows when form is invalid",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/products/create");

      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Please fix the errors before saving")).toBeVisible();
    },
  );

  test(
    "Valid product creation shows success message",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/products/create");

      await page.getByLabel("Name").fill("Test Product");
      await page.getByLabel("Description").fill("A test product");
      await page.getByLabel("Price").fill("9.99");
      await page.getByLabel("Category", { exact: true }).selectOption("bakery");
      await page.getByLabel("Subcategory").fill("Bread");
      await page.getByLabel("Stock").fill("10");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Product created successfully")).toBeVisible();
    },
  );

  test(
    "Created product appears in product list",
    { tag: "@a3" },
    async ({ page }) => {
      await adminLogin(page);
      await page.goto("/products/create");

      await page.getByLabel("Name").fill("Unique Test Product XYZ");
      await page.getByLabel("Description").fill("A test product");
      await page.getByLabel("Price").fill("9.99");
      await page.getByLabel("Category", { exact: true }).selectOption("bakery");
      await page.getByLabel("Subcategory").fill("Bread");
      await page.getByLabel("Stock").fill("10");
      await page.getByRole("button", { name: "Save" }).click();

      await page.goto("/");
      await expect(page.getByText("Unique Test Product XYZ", { exact: true }).first()).toBeVisible();
    },
  );

  test(
    "Valid update shows success message",
    { tag: "@a3" },
    async ({ page }) => {
      await goToFirstProduct(page);

      await page.getByLabel("Name").fill("Updated Product Name");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Product updated successfully")).toBeVisible();
    },
  );

  test(
    "Updated product reflects changes on list page",
    { tag: "@a3" },
    async ({ page }) => {
      await goToFirstProduct(page);

      await page.getByLabel("Name").fill("Updated Name");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Product updated successfully")).toBeVisible();

      await page.goto("http://localhost:3002/");
      await page.reload();
      await expect(page.locator("article").filter({ hasText: "Updated Name" })).toBeVisible();
    },
  );
});