"use client"

import type { Product } from "@prisma/client";
import { AddToCartButton } from "@/components/Menu/AddToCartButton";

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) return <div>0 products.</div>

  return (
    <div className="py-6 grid grid-cols-3 gap-6">
      {products.map((product) => (
        <a key={product.id} data-test-id={`product-${product.id}`} href={`/product/${product.id}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <p className="font-semibold">{product.name}</p>
          <p className="text-gray-500 text-sm">{product.description}</p>
          <p className="font-bold text-indigo-600 mt-2">${product.price}</p>
          <AddToCartButton productId={product.id} />
        </a>
      ))}
    </div>
  );
}
export default ProductList;