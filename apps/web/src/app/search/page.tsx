import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";
import { ProductList } from "@/components/Products/List";


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
      ],
    },
  });

  return (
    <AppLayout query={q}>
      <ProductList products={products} />
    </AppLayout>
  );
}