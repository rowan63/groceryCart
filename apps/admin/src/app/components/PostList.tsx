"use client";

import type { Post } from "@prisma/client";
import { useState } from "react";
import { toggleActive } from "../actions";


export function PostList({ posts }: { posts: Post[] }) {
    const [search, setSearch] = useState("");
    const [tag, setTag] = useState("");
    const [date, setDate] = useState("");
    const [sort, setSort] = useState("date-desc");
    const [visibility, setVisibility] = useState("all");
    const [postList, setPostList] = useState(posts);


    const filtered = postList.filter((p) => {
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
            <div className="flex flex-wrap gap-4 mb-6 items-end">
                <div className="flex flex-col gap-1">
                    <label htmlFor="search" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filter by Content:</label>
                    <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="tag" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filter by Tag:</label>
                    <input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="date" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filter by Date Created:</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="sort" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sort By:</label>
                    <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                        <option value="date-desc">Date Descending</option>
                        <option value="date-asc">Date Ascending</option>
                        <option value="title-asc">Title Ascending</option>
                        <option value="title-desc">Title Descending</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="visibility" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filter by Visibility:</label>
                    <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <a href="/posts/create" className="ml-auto bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700">Create Post</a>
            </div>
            <div className="flex flex-col gap-4">
                {sorted.map((post) => (
                    <article key={post.id} className="flex gap-4 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                        <img src={post.imageUrl} alt={post.title} className="w-40 h-28 object-cover rounded-md flex-shrink-0" />
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                                <span className="text-xs font-medium text-blue-600">{post.category}</span>
                            </div>
                            <a href={`/post/${post.urlId}`} className="text-base font-semibold text-gray-900 hover:text-gray-600">{post.title}</a>
                            <p className="text-xs text-gray-500">{post.tags.split(",").map((t: string) => `#${t.trim()}`).join(", ")}</p>
                            <div className="mt-auto flex items-center gap-2">
                                <button
                                    onClick={async () => {
                                        await toggleActive(post.id, post.active);
                                        setPostList(postList.map(p => p.id === post.id ? { ...p, active: !p.active } : p));
                                    }}
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${post.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {post.active ? "Active" : "Inactive"}
                                </button>
                                <span className="text-xs text-gray-400">Posted on {new Date(post.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}