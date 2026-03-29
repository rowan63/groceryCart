import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  // TODO: Implement the summary item
  // must show the number of posts in that category and the name
  // if if is selected it must show in different color/background
  return (
    <li>
      <Link
        href={link}
        title={title ?? name}
        style={{ backgroundColor: isSelected ? "#e0e0e0" : "transparent", fontWeight: isSelected ? "bold" : "normal" }}
      >
        {name}
        <span data-testid="post-count">{count}</span>
      </Link>
    </li>
  );

}
