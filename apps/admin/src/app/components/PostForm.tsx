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
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                        {errors.title?._errors?.[0] && <p className="text-xs text-red-500">{errors.title._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
                        {errors.description?._errors?.[0] && <p className="text-xs text-red-500">{errors.description._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="content" className="text-sm font-medium text-gray-700">Content</label>
                        {preview ? (
                            <div data-test-id="content-preview" className="border border-gray-300 rounded-md px-3 py-2 text-sm min-h-40 prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                        ) : (
                            <textarea id="content" ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none font-mono" />
                        )}
                        {errors.content?._errors?.[0] && <p className="text-xs text-red-500">{errors.content._errors[0]}</p>}
                        <button type="button" onClick={preview ? handleClosePreview : handlePreview} className="self-start text-xs text-gray-600 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50">
                            {preview ? "Close Preview" : "Preview"}
                        </button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">Image URL</label>
                        <input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                        {errors.imageUrl?._errors?.[0] && <p className="text-xs text-red-500">{errors.imageUrl._errors[0]}</p>}
                        {imageUrl && <img data-test-id="image-preview" src={imageUrl} alt="preview" className="mt-2 rounded-md w-full max-h-48 object-cover" />}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="tags" className="text-sm font-medium text-gray-700">Tags</label>
                        <input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                        {errors.tags?._errors?.[0] && <p className="text-xs text-red-500">{errors.tags._errors[0]}</p>}
                    </div>
                    {saveError && <p className="text-sm text-red-500 font-medium">{saveError}</p>}
                    <button type="button" onClick={handleSave} className="self-start bg-gray-900 text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-gray-700">Save</button>
                </div>
            </div>
        </main>
    );

    function renderMarkdown(md: string): string {
        return md
            .replace(/^### (.+)$/gm, "<h3>$1</h3>")
            .replace(/^## (.+)$/gm, "<h2>$1</h2>")
            .replace(/^# (.+)$/gm, "<h1>$1</h1>")
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>")
            .replace(/\n/g, "<br />");
    }