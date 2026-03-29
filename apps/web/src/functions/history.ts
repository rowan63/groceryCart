export function history(posts: { date: Date; active: boolean }[]): string[] {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts
  return posts
    .filter((p) => p.active)
    .map((p) => `${p.date.getFullYear()}/${p.date.getMonth() + 1}`)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => {
      const [aYear = "0", aMonth = "0"] = a.split("/");
      const [bYear = "0", bMonth = "0"] = b.split("/");
      const yearDiff = Number(bYear) - Number(aYear);
      return yearDiff !== 0 ? yearDiff : Number(bMonth) - Number(aMonth);
    })
}
