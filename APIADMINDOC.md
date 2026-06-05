# Admin API Documentation

Base URL: `/api`

The admin app uses a mix of a REST endpoint for authentication and Next.js server actions for product management. Auth is handled via an `auth_token` HTTP-only cookie.

---

## Endpoints

- [Login](#post-apiauthlogin)
- [Logout](#delete-apiauthlogin)

---

## Auth

### POST /api/auth/login

Logs the admin in using a password and sets the `auth_token` cookie.

**Body**
```json
{
  "password": "yourpassword"
}
```

**200 OK**
```json
{
  "success": true
}
```

**401** if the password is wrong
```json
{
  "error": "Invalid password"
}
```

---

### DELETE /api/auth/login

Logs the admin out by clearing the `auth_token` cookie. No body needed.

**200 OK**
```json
{
  "success": true
}
```

---

## Server Actions

Product management in the admin app is handled via Next.js server actions rather than REST endpoints. These are called directly from the UI and are not publicly accessible HTTP endpoints.

| Action | Description |
|---|---|
| `login(formData)` | Authenticates an admin user by email/password, sets auth cookie, redirects to `/` |
| `logout()` | Clears the auth cookie and redirects to `/` |
| `createProduct(formData)` | Creates a new product. Validates name, description, price, category, subcategory, stock, imageUrl, onSpecial, salePrice |
| `updateProduct(id, formData)` | Updates an existing product by ID with the same fields as create |
| `toggleActive(id, active)` | Toggles a product's active status on or off |
| `revalidateProducts()` | Revalidates the product listing cache |

All product fields are validated with Zod before hitting the database. If validation fails, the action returns `{ error: ... }` with the field errors rather than throwing.