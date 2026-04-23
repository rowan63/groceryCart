import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";
import { marked } from "marked";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const post = posts.find((p) => p.urlId === urlId);

  if (!post) return <AppLayout>Article not found</AppLayout>;

  const contentHtml = await marked(post.content);
  // converts markdown to html

  return (
    <AppLayout>
      <article data-test-id={`blog-post-${post.id}`} className="max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{post.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <span className="font-medium text-indigo-600 dark:text-indigo-400">{post.category}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          <a href={`/post/${post.urlId}`} className="hover:text-indigo-600">{post.title}</a>
        </h1>
        <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-6" />
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
          <div className="flex gap-2">
            {post.tags.split(",").map((tag) => (
              <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">#{tag}</span>
            ))}
          </div>
        </div>
        <div data-test-id="content-markdown" className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        {/* dangerouslySetInnerHTML inserts the data into a div element */}
      </article>
    </AppLayout>
  );
}