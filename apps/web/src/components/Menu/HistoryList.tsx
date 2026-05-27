"use client";

import { history } from "@/functions/history";
import { useEffect, useState } from "react";
import { SummaryItem } from "./SummaryItem";

const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function HistoryList({ selectedYear, selectedMonth }: { selectedYear?: string; selectedMonth?: string }) {
  const [historyItems, setHistoryItems] = useState<{ month: number; year: number; count: number }[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((orders) => {
        if (Array.isArray(orders)) {
          const parsed = orders.map((o: { createdAt: string }) => ({ createdAt: new Date(o.createdAt) }));
          history(parsed).then(setHistoryItems);
        }
      });
  }, []);

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