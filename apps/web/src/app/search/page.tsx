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
      <div>{products.map(p => <div key={p.id}>{p.name}</div>)}</div>
    </AppLayout>
  );
}