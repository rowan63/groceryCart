import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article data-test-id={`blog-post-${post.id}`} className="flex gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
      <img src={post.imageUrl} alt={post.title} className="w-48 h-32 object-cover rounded-lg flex-shrink-0" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{post.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <span className="font-medium text-indigo-600 dark:text-indigo-400">{post.category}</span>
        </div>
        <Link href={`/post/${post.urlId}`} className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600">
          {post.title.replace(/!$/, "")}
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{post.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
          <div className="flex gap-2">
            {post.tags.split(",").map((tag) => (
              <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}