import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogList({ posts }: { posts: Post[] }) {
  // category screen - displays 0 posts when there are no posts
  if (posts.length === 0) return <div>0 posts.</div>

  return (
    <div className="py-6">
      {posts.map((post) => (
        <article key={post.id} data-testid={`blog-post-${post.id}`}>
          <Link href={`/post/${post.urlId}`}>
            {post.title}
          </Link>
          <p>{post.description}</p>
          <img src={post.imageUrl} alt={post.title} />
          <p>{post.category}</p>
          <p>{post.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
          <p>{post.views} views</p>
          <p>{post.likes} likes</p>
          <div>
            {post.tags.split(",").map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export default BlogList;
