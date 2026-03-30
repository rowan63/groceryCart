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
        className={`flex justify-between items-center py-1 px-2 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${isSelected ? "selected bg-indigo-100 dark:bg-indigo-900 font-semibold text-indigo-700 dark:text-indigo-300" : ""}`}      >
        <span>{name}</span>
        {" "}
        <span data-test-id="post-count">{count}</span>
      </a>
    </li>
  );
}
