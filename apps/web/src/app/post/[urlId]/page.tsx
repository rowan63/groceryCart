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

  return (
    <AppLayout>
      <article data-testid={`blog-post-${post.id}`}>
        <h1>{post.title}</h1>
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
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </AppLayout>
  );
}