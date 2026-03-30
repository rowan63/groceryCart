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
  const historyItems = await history(posts);

  // TODO: use the "history" function on "functions" directory to get the history
  //       and render all history items using the SummaryItem component
  return (
    <>
      {historyItems.map((item) => {
        const monthName = months[item.month];
        const label = `${monthName}, ${item.year}`;
        return (
          <SummaryItem
            key={`${item.year}/${item.month}`}
            name={label}
            link={`/history/${item.year}/${item.month}`}
            title={`History / ${label}`}
            count={item.count}
            isSelected={
              selectedYear === item.year.toString() &&
              selectedMonth === item.month.toString()
            }
          />
        );
      })}
    </>
  );
}