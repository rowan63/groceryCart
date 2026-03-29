import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = await tags(posts);

  return (
    <LinkList title="Tags">
      {/* Todo implement, use the summary item */}
      {postTags.map((tag) => (
        <SummaryItem
          key={tag.name}
          name={tag.name}
          count={tag.count}
          link={`/tags/${toUrlPath(tag.name)}`}
          title={`Tag / ${tag.name}`}
          isSelected={selectedTag === toUrlPath(tag.name)}
        />
      ))}
    </LinkList>
  );
}
