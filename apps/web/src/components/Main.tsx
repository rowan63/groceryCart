import type { Post } from "@prisma/client";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <main className={className}>
      <BlogList posts={posts} />
    </main>
  );
}
