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
      <article data-test-id={`blog-post-${post.id}`}>
        <h1>
          <a href={`/post/${post.urlId}`}>{post.title}</a>
        </h1>
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
        <div data-test-id="content-markdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </AppLayout>
  );
}