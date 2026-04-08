import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {

  const { year, month } = await params;
  // again 
  const filteredPosts = posts.filter((p) => {
    const postYear = p.date.getFullYear().toString();
    const postMonth = (p.date.getMonth() + 1).toString();
    return p.active && postYear === year && postMonth === month;
  });

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
