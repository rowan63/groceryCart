import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const products = await client.db.product.findMany({
    where: { active: true, category: name }
  });

  return (
    <AppLayout>
      <div>{products.map(p => <div key={p.id}>{p.name}</div>)}</div>
    </AppLayout>
  );
}