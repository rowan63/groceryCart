import { isLoggedIn } from "../../../utils/auth";
import { login } from "../../actions";
import { ProductForm } from "../../components/ProductForm";

export default async function CreateProduct() {
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

    return <ProductForm />;
}