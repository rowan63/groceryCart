import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";
import { AddToCartButton } from "@/components/Menu/AddToCartButton";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const product = await client.db.product.findUnique({ where: { id: parseInt(urlId) } });

  if (!product) return <AppLayout>Product not found</AppLayout>;

  const categoryNames: Record<string, string> = {
    "meat-seafood": "Poultry, Meat and Seafood",
    "fruit-veg": "Fruit and Veg",
    "dairy-fridge": "Dairy, Eggs and Fridge",
    "bakery": "Bakery",
    "snacks": "Snacks and Confectionary",
  };

  return (
    <AppLayout>
      <article data-test-id={`product-${product.id}`} className="py-6 px-4 max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4">
          <a href={`/category/${product.category}`} className="font-medium text-[#1D9E75] hover:underline">
            {categoryNames[product.category] ?? product.category}
          </a>
          <span>·</span>
          <span>{product.subcategory}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-64 h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-2 mt-auto">
              {product.onSpecial && product.salePrice && (
                <div className="text-2xl font-semibold text-[#1D9E75]">${product.salePrice.toFixed(2)}</div>
              )}
              <div className={`${product.onSpecial ? "text-lg line-through text-gray-400" : "text-2xl font-semibold text-[#1D9E75]"}`}>${product.price.toFixed(2)}</div>
              {product.onSpecial && (
                <span className="bg-[#1D9E75] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ON SPECIAL</span>
              )}
            </div>            <div className="text-xs text-gray-400">{product.stock} in stock</div>
            <div className="max-w-xs">
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>
      </article>
    </AppLayout>
  );
}