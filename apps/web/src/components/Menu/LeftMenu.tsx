import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  const activePosts = posts.filter((p) => p.active);
  return (
    <div className="w-64 min-h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-8">
      <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">Full Stack Blog</a>
      <nav>
        <ul className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Categories</p>
            <CategoryList posts={posts} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">History</p>
            <HistoryList selectedYear="" selectedMonth="" posts={activePosts} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Tags</p>
            <TagList selectedTag="" posts={activePosts} />
          </div>
        </ul>
      </nav>
    </div>
  );
}
