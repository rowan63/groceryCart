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
      <article data-test-id={`product-${product.id}`} className="max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            {categoryNames[product.category] ?? product.category}
          </span>
          <span>{product.subcategory}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-xl mb-6" />
        )}
        <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
        <div className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</div>
        <div className="text-sm text-gray-500 mt-2">{product.stock} in stock</div>
        <div className="mt-6">
          <AddToCartButton productId={product.id} />
        </div>
      </article>
    </AppLayout>
  );
}