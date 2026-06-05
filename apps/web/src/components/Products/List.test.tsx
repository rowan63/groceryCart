import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ProductList } from "./List";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const products = [
  { id: 1, name: "Chicken Breast", description: "Free range", price: 12.99, salePrice: null, onSpecial: false, imageUrl: null, category: "meat", subcategory: "Chicken", stock: 10, active: true },
];

test("renders no products message when empty", async () => {
  const { getByText } = render(<ProductList products={[]} />);
  await expect.element(getByText("No products found.")).toBeVisible();
});

test("renders all products", async () => {
  const { getByText } = render(<ProductList products={products} />);
  await expect.element(getByText("Chicken Breast")).toBeVisible();
});
