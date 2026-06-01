import { client } from "@repo/db/client";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";

export default async function Home() {
  const products = await client.db.product.findMany({
    where: { active: true }
  });
  const specials = products.filter(p => p.onSpecial);
  return (
    <AppLayout>
      <Main products={products} specials={specials} />
    </AppLayout>
  );
}