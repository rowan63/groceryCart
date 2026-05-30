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
  count?: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li>
      <a
        href={link}
        title={title ?? name}
        className={`flex justify-between items-center py-1 px-2 rounded-md text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors ${isSelected ? "bg-[#E1F5EE] text-[#0F6E56] font-semibold dark:bg-[#085041] dark:text-[#5DCAA5]" : ""}`}
      >
        <span>{name}</span>
        {" "}
        <span data-test-id="count" className="text-gray-300 dark:text-gray-600 text-[10px]">{count}</span>
      </a>
    </li>
  );
}