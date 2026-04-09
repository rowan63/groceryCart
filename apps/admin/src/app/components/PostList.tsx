"use client";

import type { Post } from "@prisma/client";
import { useState } from "react";

export function PostList({ posts }: { posts: Post[] }) {
    const [search, setSearch] = useState("");
    const [tag, setTag] = useState("");
    const [date, setDate] = useState("");
    const [sort, setSort] = useState("date-desc");
    const [visibility, setVisibility] = useState("all");

    const filtered = posts.filter((p) => {
        if (search && !p.title.includes(search) && !p.content.includes(search)) return false;
        if (tag && !p.tags.includes(tag)) return false;
        if (date && new Date(p.date) < new Date(date)) return false;
        if (visibility === "active" && !p.active) return false;
        if (visibility === "inactive" && p.active) return false;
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === "title-asc") return a.title.localeCompare(b.title);
        if (sort === "title-desc") return b.title.localeCompare(a.title);
        if (sort === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
        return new Date(b.date).getTime() - new Date(a.date).getTime(); // date-desc default
    });

    return (
        <div>
            <label htmlFor="search">Filter by Content:</label>
            <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} />

            <label htmlFor="tag">Filter by Tag:</label>
            <input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} />

            <label htmlFor="date">Filter by Date Created:</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <label htmlFor="sort">Sort By:</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date-desc">Date Descending</option>
                <option value="date-asc">Date Ascending</option>
                <option value="title-asc">Title Ascending</option>
                <option value="title-desc">Title Descending</option>
            </select>

            <label htmlFor="visibility">Filter by Visibility:</label>
            <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            <a href="/posts/create">Create Post</a>

            {sorted.map((post) => (
                <article key={post.id}>
                    <img src={post.imageUrl} alt={post.title} />
                    <a href={`/post/${post.urlId}`}>{post.title}</a>
                    <p>{post.category}</p>
                    <p>{post.tags.split(",").map(t => `#${t.trim()}`).join(", ")}</p>
                    <button onClick={() => alert("Status changed")}>{post.active ? "Active" : "Inactive"}</button>
                    <p>Posted on {new Date(post.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                </article>
            ))}
        </div>
    );
}