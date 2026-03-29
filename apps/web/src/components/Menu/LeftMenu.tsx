import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  const activePosts = posts.filter((p) => p.active);
  return (
    <div>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div>Top Links and blog name</div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <div>
            <CategoryList posts={activePosts} />
          </div>
          <div>
            <HistoryList selectedYear="" selectedMonth="" posts={activePosts} />
          </div>
          <div>
            <TagList selectedTag="" posts={activePosts} />
          </div>
          <div>Admin</div>
        </ul>
      </nav>
    </div>
  );
}
