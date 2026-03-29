import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  // TODO: use the "history" function on "functions" directory to get the history
  //       and render all history items using the SummaryItem component
  return (
    <>
      {historyItems.map((item) => {
        const [year, month] = item.split("/");
        const monthName = months[Number(month)];
        const label = `${monthName}, ${year}`;
        return (
          <SummaryItem
            key={item}
            name={label}
            link={`/history/${year}/${month}`}
            title={`History / ${label}`}
            count={posts.filter((p) => {
              const y = p.date.getFullYear().toString();
              const m = (p.date.getMonth() + 1).toString();
              return y === year && m === month;
            }).length}
            isSelected={selectedYear === year && selectedMonth === month}
          />
        );
      })}
    </>
  );
}
