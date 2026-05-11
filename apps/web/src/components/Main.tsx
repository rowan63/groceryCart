import type { Product } from "@prisma/client";
import ProductList from "./Blog/List";

export function Main({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <main className={className}>
      <ProductList products={products} />
    </main>
  );
}