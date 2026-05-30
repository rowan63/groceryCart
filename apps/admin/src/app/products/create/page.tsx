import { isLoggedIn } from "../../../utils/auth";
import { login } from "../../actions";
import { ProductForm } from "../../components/ProductForm";

export default async function CreateProduct() {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl border border-gray-100 w-full max-w-sm">
                    <div className="text-base font-bold text-[#1D9E75] mb-6">FreshCart Admin</div>
                    <h1 className="text-lg font-semibold text-gray-900 mb-6">Sign in</h1>
                    <form action={login} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-xs font-medium text-gray-600">Email</label>
                            <input id="email" name="email" type="email" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-xs font-medium text-gray-600">Password</label>
                            <input id="password" name="password" type="password" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        </div>
                        <button type="submit" className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors">Sign in</button>
                    </form>
                </div>
            </main>
        );
    }

    return <ProductForm />;
}