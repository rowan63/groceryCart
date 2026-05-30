import type { Product } from "@prisma/client";
import Link from "next/link";

export function ProductListItem({ product }: { product: Product }) {
  return (
    <article data-test-id={`product-${product.id}`} className="flex gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
      <img src={product.imageUrl} alt={product.name} className="w-40 h-28 object-cover rounded-xl flex-shrink-0" />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span className="font-medium text-[#1D9E75]">{product.category}</span>
          <span>·</span>
          <span>{product.subcategory}</span>
        </div>
        <Link href={`/product/${product.id}`} className="text-base font-semibold text-gray-900 dark:text-white hover:text-[#1D9E75] transition-colors">
          {product.name}
        </Link>
        <p className="text-gray-400 dark:text-gray-400 text-xs line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mt-auto">
          <span className="font-semibold text-[#1D9E75] text-sm">${product.price.toFixed(2)}</span>
          <span>{product.stock} in stock</span>
        </div>
      </div>
    </article>
  );
}