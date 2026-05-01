"use client";

import { useState, useEffect } from "react";

export function LikeButton({ postId, initialLikes }: { postId: number; initialLikes: number }) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        fetch(`/api/likes?postId=${postId}`)
            .then(res => res.json())
            .then(data => setLiked(data.liked));
    }, [postId]);

    async function handleLike() {
        if (liked) {
            await fetch("/api/likes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId }),
            });
            setLikes(likes - 1);
            setLiked(false);
        } else {
            const res = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId }),
            });
            if (res.ok) {
                setLikes(likes + 1);
                setLiked(true);
            }
        }
    }

    return (
        <button
            data-test-id="like-button"
            onClick={handleLike}
            className={`px-3 py-1 rounded-full text-sm font-medium ${liked ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>
            {liked ? "♥ Liked" : "♡ Like"} {likes} likes
        </button>
    );
}