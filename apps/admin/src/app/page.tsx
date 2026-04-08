import { posts } from "@repo/db/data";
import { isLoggedIn } from "../utils/auth";
import { login, logout } from "./actions";
import styles from "./page.module.css";
export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
    <main>
      <h1>Sign into your account</h1>
      <form action={login}>
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" />
        <button type="submit">Sign In</button>
      </form>
    </main>
    );
  } else {
    return (
      <main>
        <h1>Admin of Full Stack Blog</h1>
        <form action={logout}>
          <button type="submit">Logout</button>
        </form>
        <ul>
          {posts.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      </main>
    );
  }
}
