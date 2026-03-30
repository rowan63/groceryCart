export async function history(
  posts: { date: Date; active: boolean }[]
): Promise<{ month: number; year: number; count: number }[]> {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts

  const filtered = posts.filter((p) => p.active);

  const map = new Map<string, { month: number; year: number; count: number }>();

  for (const post of filtered) {
    const year = post.date.getFullYear();
    const month = post.date.getMonth() + 1;
    const key = `${year}/${month}`;

    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { year, month, count: 1 });
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });
}
