import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../utils/auth";
import { login } from "../../actions";
import { ProductForm } from "../../components/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h1>
                    <form action={login} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            <input id="password" name="password" type="password" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                        </div>
                        <button type="submit" className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700">Sign In</button>
                    </form>
                </div>
            </main>
        );
    }

    const product = await client.db.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) notFound();

    return <ProductForm product={product} />;
}