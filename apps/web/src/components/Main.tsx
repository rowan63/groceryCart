import type { Product } from "@prisma/client";
import ProductList from "./Products/List";
import { SpecialsList } from "./Products/SpecialList";

export function Main({
  products,
  specials,
  className,
}: {
  products: Product[];
  specials: Product[];
  className?: string;
}) {
  return (
    <main className={className}>
      {specials.length > 0 && <SpecialsList products={specials} />}
      <ProductList products={products} />
    </main>
  );
}