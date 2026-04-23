import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  // again
  const filteredPosts = posts.filter(
    (p) =>
      p.active &&
      p.tags
        .split(",")
        .map((t) => t.toLowerCase().replace(/\s+/g, "-"))
        .includes(tag.toLowerCase())
  );

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}