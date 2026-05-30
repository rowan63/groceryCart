import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";
import { Main } from "@/components/Main";

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
      <div className="py-4">
        <div className="flex gap-2 mb-6 flex-wrap">
          <a href={`/category/${name}`} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!sub ? "bg-[#1D9E75] text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
            All
          </a>
          {subcategories.map(s => (
            <a key={s} href={`/category/${name}?sub=${encodeURIComponent(s.toLowerCase().replace(/ /g, "-"))}`} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${sub === s.toLowerCase().replace(/ /g, "-") ? "bg-[#1D9E75] text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
              {s}
            </a>
          ))}
        </div>
        <Main products={filtered} />
      </div>
    </AppLayout>
  );
}