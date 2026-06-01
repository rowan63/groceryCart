import type { Product } from "@prisma/client";
import { AddToCartButton } from "../Menu/AddToCartButton";

export function SpecialsList({ products }: { products: Product[] }) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1D9E75]">Specials</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {products.map(product => (
                    <a key={product.id} href={`/product/${product.id}`} data-test-id={`special-${product.id}`}
                        className="flex-shrink-0 w-40 border-2 border-[#1D9E75] rounded-xl bg-white dark:bg-gray-800 flex flex-col p-2 gap-2 relative">
                        <span className="absolute top-2 right-2 bg-[#1D9E75] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">ON SPECIAL</span>
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex flex-col gap-1 px-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{product.name}</p>
                            <div className="flex items-center gap-1">
                                {product.salePrice && <p className="text-sm font-bold text-[#1D9E75]">${product.salePrice.toFixed(2)}</p>}
                                <p className={`text-xs ${product.salePrice ? "line-through text-gray-400" : "font-semibold text-[#1D9E75]"}`}>${product.price.toFixed(2)}</p>
                            </div>
                            <AddToCartButton productId={product.id} />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}