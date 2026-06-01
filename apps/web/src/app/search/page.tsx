import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";
import { ProductList } from "@/components/Products/List";


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const products = await client.db.product.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    },
  });

  return (
    <AppLayout query={q} category={category}>
      <ProductList products={products} />
    </AppLayout>
  );
}