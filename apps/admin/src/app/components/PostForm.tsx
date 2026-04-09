"use client";
import { useState, useRef, useEffect } from "react";
import type { Post } from "@prisma/client";
import { updatePost, createPost } from "../actions";
import { useRouter } from "next/navigation";


type Errors = {
    _errors?: string[];
    title?: { _errors: string[] };
    description?: { _errors: string[] };
    content?: { _errors: string[] };
    imageUrl?: { _errors: string[] };
    tags?: { _errors: string[] };
};

export function PostForm({ post }: { post?: Post }) {
    const [title, setTitle] = useState(post?.title ?? "");
    const [description, setDescription] = useState(post?.description ?? "");
    const [content, setContent] = useState(post?.content ?? "");
    const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
    const [tags, setTags] = useState(post?.tags ?? "");
    const [errors, setErrors] = useState<Errors>({});
    const [saveError, setSaveError] = useState("");
    const [preview, setPreview] = useState(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const cursorPos = useRef<number>(0);
    const prevPreview = useRef(false);

    useEffect(() => {
        if (prevPreview.current === true && preview === false) {
            if (contentRef.current) {
                contentRef.current.focus();
                contentRef.current.setSelectionRange(cursorPos.current, cursorPos.current);
            }
        }
        prevPreview.current = preview;
    }, [preview]);

    async function handleSave() {
        setErrors({});
        setSaveError("");

        const formData = new FormData();
        formData.set("title", title);
        formData.set("description", description);
        formData.set("content", content);
        formData.set("imageUrl", imageUrl);
        formData.set("tags", tags);

        const result = post
            ? await updatePost(post.urlId, formData)
            : await createPost(formData);

        if (result?.error) {
            setErrors(result.error as unknown as Errors);
            setSaveError("Please fix the errors before saving");
        }
    }

    function handlePreview() {
        if (contentRef.current) {
            cursorPos.current = contentRef.current.selectionStart ?? 0;
        }
        setPreview(true);
    }

    function handleClosePreview() {
        setPreview(false);
    }

    return (
        <main>
            <div>
                <label htmlFor="title">Title</label>
                <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                {errors.title?._errors?.[0] && <p>{errors.title._errors[0]}</p>}
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description?._errors?.[0] && <p>{errors.description._errors[0]}</p>}
            </div>
            <div>
                <label htmlFor="content">Content</label>
                {preview ? (
                    <div data-test-id="content-preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                ) : (
                    <textarea id="content" ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} />
                )}
                {errors.content?._errors?.[0] && <p>{errors.content._errors[0]}</p>}
                <button type="button" onClick={preview ? handleClosePreview : handlePreview}>
                    {preview ? "Close Preview" : "Preview"}
                </button>
            </div>
            <div>
                <label htmlFor="imageUrl">Image URL</label>
                <input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                {errors.imageUrl?._errors?.[0] && <p>{errors.imageUrl._errors[0]}</p>}
                <img data-test-id="image-preview" src={imageUrl} alt="preview" />
            </div>
            <div>
                <label htmlFor="tags">Tags</label>
                <input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                {errors.tags?._errors?.[0] && <p>{errors.tags._errors[0]}</p>}
            </div>
            {saveError && <p>{saveError}</p>}
            <button type="button" onClick={handleSave}>Save</button>
        </main>
    );
}

function renderMarkdown(md: string): string {
    return md
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br />");
}