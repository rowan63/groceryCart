import { AppLayout } from "@/components/Layout/AppLayout";
import { OrderList } from "@/components/Products/OrderList";

export default async function Page({ params }: { params: Promise<{ year: string; month: string }> }) {
  const { year, month } = await params;

  return (
    <AppLayout>
      <OrderList year={year} month={month} />
    </AppLayout>
  );
}