export async function history(
  orders: { createdAt: Date }[]
): Promise<{ month: number; year: number; count: number }[]> {
  const map = new Map<string, { month: number; year: number; count: number }>();

  for (const order of orders) {
    const year = order.createdAt.getFullYear();
    const month = order.createdAt.getMonth() + 1;
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