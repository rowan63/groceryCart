import { AppLayout } from "@/components/Layout/AppLayout";
import { products } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  return (
    <AppLayout>
      <div>History for {month}/{year}</div>
    </AppLayout>
  );
}