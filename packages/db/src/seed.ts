export async function seed() {
  // NodeNext module resolution requires explicit extensions for relative imports.
  const { client } = await import("./client.js");
  const { posts } = await import("./data.js");

  /**
   * Deterministic seeding used by Playwright.
   *
   * Summary:
   * - Tests need predictable data every run.
   * - We wipe the tables and insert the same 4 demo posts (id 1..4).
   * - Likes are stored in 2 places:
   *   1) `Post.likes` (the counter we display)
   *   2) `Like` rows (so we can enforce "one like per user/IP")
   */
  const seedPosts = posts.filter((p: { id: number }) => p.id <= 4);

  await client.db.like.deleteMany();
  await client.db.post.deleteMany();

  for (const post of seedPosts) {
    await client.db.post.create({
      data: {
        id: post.id,
        urlId: post.urlId,
        title: post.title,
        content: post.content,
        description: post.description,
        imageUrl: post.imageUrl,
        category: post.category,
        tags: post.tags
          .split(",")
          .map((t: string) => t.trim())
          .join(","),
        date: post.date,
        views: post.views,
        likes: post.likes,
        active: post.active,
      },
    });

    // create like entries so we can enforce "one like per IP"
    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
}
