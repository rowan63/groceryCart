import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  // category screen - displays 0 posts when there are no posts
  if (posts.length === 0) return <div>0 posts.</div>

  return (
    <div className="py-6">
      {posts.map((post) => (
        <BlogListItem key={post.id} post={post} />
      ))}
    </div>
  );
}
export default BlogList;