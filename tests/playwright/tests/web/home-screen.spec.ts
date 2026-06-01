import { seed } from "@repo/db/seed";
import { expect, test, type Page } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("HOME SCREEN", () => {
  test("Add to cart when logged out redirects to login", { tag: "@a1" }, async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");
    await page.locator('[data-test-id^="product-"]').first().getByText("Add to cart").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("Home page shows all products", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    const articles = page.locator('[data-test-id^="product-"]');
    await expect(articles).toHaveCount(15);
  });

  test("Categories are displayed in the left menu and work", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-label="Toggle left menu"]').click();
    await expect(page.getByText("Poultry, Meat & Seafood")).toBeVisible();
    await expect(page.getByText("Fruit & Veg")).toBeVisible();
    await expect(page.getByText("Dairy, Eggs & Fridge")).toBeVisible();
    await expect(page.getByText("Bakery")).toBeVisible();
    await expect(page.getByText("Snacks & Confectionery")).toBeVisible();
    await page.locator('nav').getByRole("link", { name: "Bakery" }).click();
    await expect(page).toHaveURL(/\/category\/bakery/);
  });

  test("Subcategories are displayed under categories in left menu and work", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-label="Toggle left menu"]').click();
    await page.locator('button', { hasText: "▼" }).first().click();
    await expect(page.locator('nav').getByRole("link", { name: "Chicken" })).toBeVisible();
    await expect(page.locator('nav').getByRole("link", { name: "Beef" })).toBeVisible();
    await expect(page.locator('nav').getByRole("link", { name: "Lamb" })).toBeVisible();
    await expect(page.locator('nav').getByRole("link", { name: "Seafood", exact: true })).toBeVisible();
    await page.locator('nav').getByRole("link", { name: "Chicken" }).click();
    await expect(page).toHaveURL(/sub=chicken/);
  });

  test("Searching from home page navigates to search page", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Search").first().fill("Chicken");
    await expect(page).toHaveURL(/\/search\?q=Chicken/);
  });

  test("Dark mode toggle switches theme", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const currentTheme = await html.getAttribute("data-theme");
    await page.locator('button[aria-label="Toggle theme"]').click();
    if (currentTheme === "dark") {
      await expect(html).toHaveAttribute("data-theme", "light");
    } else {
      await expect(html).toHaveAttribute("data-theme", "dark");
    }
  });

  test("Right menu shows sign in button and redirects to login page", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.getByText("Log In").click();
    await expect(page.getByText("Sign in to add items to your cart.")).toBeVisible();
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("Right menu shows register link and redirects to register page", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.getByText("Log In").click();
    await page.getByRole("link", { name: /register/i }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("Clicking a product navigates to product detail page", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-test-id^="product-"]').first().click();
    await expect(page).toHaveURL(/\/product\/\d+/);
  });

  test("Right menu shows cart when logged in", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: /Cart/ })).toBeVisible();
    await expect(page.getByText("Logout")).toBeVisible();
  });

  test("Add to cart when logged in adds to cart", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");
    await page.locator('[data-test-id^="product-"]').first().getByText("Add to cart").click();
    await expect(page.getByText(/Cart \(\d+\)/)).toBeVisible();
  });

  test("Specials row shows on special products", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('span').filter({ hasText: /^Specials$/ })).toBeVisible();
    const specialItems = page.locator('[data-test-id^="special-"]');
    await expect(specialItems).toHaveCount(4);
  });
});