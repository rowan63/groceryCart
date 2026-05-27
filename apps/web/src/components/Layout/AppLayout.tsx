import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { RightMenu } from "../Menu/RightMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
  category,
}: PropsWithChildren<{ query?: string; category?: string }>) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <div className="sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <LeftMenu />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Content>
          <TopMenu query={query} category={category} />
          {children}
        </Content>
      </div>
      <div className="sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <RightMenu />
      </div>
    </div>
  );
}
