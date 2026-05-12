import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const products = await client.db.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
      ]
    }
  });

  return (
    <AppLayout query={q}>
      <div className="py-6">
        <p className="text-sm text-gray-500 mb-4">{products.length} results for "{q}"</p>
        <div className="grid grid-cols-3 gap-6">
          {products.map(p => (
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