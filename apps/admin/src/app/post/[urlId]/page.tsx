import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../utils/auth";
import { login } from "../../actions";
import { PostForm } from "../../components/PostForm";
import { notFound } from "next/navigation";

export default async function UpdatePost({ params }: { params: Promise<{ urlId: string }> }) {
    const { urlId } = await params;
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        return (
            <main>
                <h1>Sign in to your account</h1>
                <form action={login}>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" />
                    <button type="submit">Sign In</button>
                </form>
            </main>
        );
    }

    const post = await client.db.post.findUnique({ where: { urlId } });
    if (!post) notFound();

    return <PostForm post={post} />;
}