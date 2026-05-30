"use client"

import type { Product } from "@prisma/client";
import { AddToCartButton } from "@/components/Menu/AddToCartButton";

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) return <div className="text-sm text-gray-400 py-6">No products found.</div>

  return (
    <div className="py-4 grid grid-cols-4 gap-3">
      {products.map((product) => (
        <a key={product.id} data-test-id={`product-${product.id}`} href={`/product/${product.id}`} className="border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-colors flex flex-col p-2 gap-2">
          <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex flex-col gap-1 px-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{product.description}</p>
            <p className="text-sm font-semibold text-[#1D9E75] mt-1 mb-1">${product.price}</p>
            <AddToCartButton productId={product.id} />
          </div>
        </a>
      ))}
    </div>
  );
}
export default ProductList;