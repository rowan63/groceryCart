import type { Product } from "@prisma/client";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { ProductListItem } from "./ListItem";

const product: Product = {
  id: 1,
  name: "Chicken Breast",
  description: "Free range chicken breast",
  price: 12.99,
  salePrice: null,
  onSpecial: false,
  imageUrl: "https://example.com/image.jpg",
  category: "meat-seafood",
  subcategory: "Chicken",
  stock: 50,
  active: true,
};

test("renders product data", async () => {
  const { getByText, getByRole } = render(<ProductListItem product={product} />);
  await expect.element(getByRole("link", { name: "Chicken Breast" })).toBeVisible();
  await expect.element(getByText("Free range chicken breast")).toBeVisible();
  await expect.element(getByText("meat-seafood")).toBeVisible();
  await expect.element(getByText("Chicken", { exact: true }).first()).toBeVisible();
  await expect.element(getByText("$12.99")).toBeVisible();
  await expect.element(getByText("50 in stock")).toBeVisible();
});
