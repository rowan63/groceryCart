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
      <a
        href={link}
        title={title ?? name}
        className={isSelected ? "selected" : ""}
      >
        <span>{name}</span>
        {" "}
        <span data-test-id="post-count">{count}</span>
      </a>
    </li>
  );
}
