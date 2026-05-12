import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { name } = await params;
  const { sub } = await searchParams;

  const allProducts = await client.db.product.findMany({
    where: { active: true, category: name }
  });

  const subcategories = [...new Set(allProducts.map(p => p.subcategory))];

  const filtered = sub
    ? allProducts.filter(p => p.subcategory.toLowerCase().replace(/ /g, "-") === sub)
    : allProducts;

  return (
    <AppLayout>
      <div className="py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          <a href={`/category/${name}`} className={`px-4 py-2 rounded-full text-sm font-medium ${!sub ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}>
            All
          </a>
          {subcategories.map(s => (
            <a key={s} href={`/category/${name}?sub=${encodeURIComponent(s.toLowerCase().replace(/ /g, "-"))}`} className={`px-4 py-2 rounded-full text-sm font-medium ${sub === s.toLowerCase().replace(/ /g, "-") ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}>
              {s}
            </a>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {filtered.map(p => (
            <a key={p.id} href={`/product/${p.id}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-500 text-sm">{p.description}</p>
              <p className="font-bold text-indigo-600 mt-2">${p.price.toFixed(2)}</p>
            </a>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}