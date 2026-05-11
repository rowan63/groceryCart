"use client";

import { history } from "@/functions/history";
import { useEffect, useState } from "react";
import { SummaryItem } from "./SummaryItem";

const months = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

export function HistoryList({ selectedYear, selectedMonth, orders }: { selectedYear?: string; selectedMonth?: string; orders: { createdAt: Date }[] }) {
  const [historyItems, setHistoryItems] = useState<{ month: number; year: number; count: number }[]>([]);

   useEffect(() => {
    history(orders).then(setHistoryItems);
  }, [orders]);


  return (
    <>
      {historyItems.map((item) => {
        const label = `${months[item.month]}, ${item.year}`;
        return (
          <SummaryItem
            key={`${item.year}/${item.month}`}
            name={label}
            link={`/history/${item.year}/${item.month}`}
            title={`History / ${label}`}
            count={item.count}
            isSelected={selectedYear === item.year.toString() && selectedMonth === item.month.toString()}
          />
        );
      })}
    </>
  );
}