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
  
  test("Show 15 products", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    const articles = page.locator('[data-test-id^="product-"]');
    await expect(articles).toHaveCount(15);
  });

  test("Products have add to cart button", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    const first = page.locator('[data-test-id^="product-"]').first();
    await expect(first.getByText("Add to cart")).toBeVisible();
  });

  test("Category links show in left menu", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Poultry, Meat & Seafood")).toBeVisible();
    await expect(page.getByText("Fruit & Veg")).toBeVisible();
    await expect(page.getByText("Dairy, Eggs & Fridge")).toBeVisible();
    await expect(page.getByText("Bakery")).toBeVisible();
    await expect(page.getByText("Snacks & Confectionery")).toBeVisible();
  });

  test("Subcategory links show under category", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Chicken" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Beef" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Lamb" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Seafood" })).toBeVisible();
  });

  test("Clicking category navigates to category page", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Bakery" }).click();
    await expect(page).toHaveURL(/\/category\/bakery/);
  });

  test("Search navigates to search results", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Search").fill("Chicken");
    await expect(page).toHaveURL(/\/search\?q=Chicken/);
  });

  test("Dark mode toggle switches theme", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    const html = await page.getAttribute("html", "data-theme");
    if (html === "dark") {
      await page.getByText("Light Mode").click();
      await expect(await page.getAttribute("html", "data-theme")).toBe("light");
    } else {
      await page.getByText("Dark Mode").click();
      await expect(await page.getAttribute("html", "data-theme")).toBe("dark");
    }
  });

  test("Right menu shows sign in when logged out", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Sign in to add items to your cart.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
  });

  test("Register link shows when logged out", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /register/i })).toBeVisible();
  });

  test("Clicking product navigates to detail page", { tag: "@a1" }, async ({ page }) => {
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
  });

  test("Logout button shows when logged in", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");
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
});