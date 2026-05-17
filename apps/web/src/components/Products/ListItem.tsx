import type { Product } from "@prisma/client";
import Link from "next/link";

export function ProductListItem({ product }: { product: Product }) {
  return (
    <article data-test-id={`product-${product.id}`} className="flex gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
      <img src={product.imageUrl} alt={product.name} className="w-48 h-32 object-cover rounded-lg flex-shrink-0" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-indigo-600 dark:text-indigo-400">{product.category}</span>
          <span>{product.subcategory}</span>
        </div>
        <Link href={`/product/${product.id}`} className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600">
          {product.name}
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>${product.price.toFixed(2)}</span>
          <span>{product.stock} in stock</span>
        </div>
      </div>
    </article>
  );
}