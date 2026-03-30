import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="flex flex-row gap-8"
    >
      <Link href={`/post/${post.urlId}`}>{post.title.replace(/!$/, "")}</Link>
      <p>{post.description}</p>
      <img src={post.imageUrl} alt={post.title} />
      <p>{post.category}</p>
      <p>{post.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
      <p>{post.views} views</p>
      <p>{post.likes} likes</p>
      <div>
        {post.tags.split(",").map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </article>
  );
}