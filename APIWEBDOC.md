# Web API Documentation

Base URL: `/api`

Auth is handled with an `auth_token` HTTP-only cookie. You get this cookie when you log in and it's sent automatically with every request. Protected endpoints will return 401 if it's missing or invalid.

---

## Endpoints

- [Register](#post-apiauthregister)
- [Login](#post-apiauthlogin)
- [Logout](#post-apiauthlogout)
- [Get Current User](#get-apiauthuser)
- [Get Cart](#get-apicart)
- [Add to Cart](#post-apicart)
- [Update Cart Item](#patch-apicart)
- [Remove Cart Item](#delete-apicart)
- [Place Order](#post-apiorders)
- [Get Orders](#get-apiorders)
- [Get Subcategories](#get-apisubcategories)
- [Seed Database](#get-apiseed)

---

## Auth

### POST /api/auth/register

Creates a new user account.

**Body**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Smith"
}
```

**200 OK**
```json
{
  "success": true,
  "userId": 1
}
```

**400** if the email is already taken
```json
{
  "error": "Email already in use"
}
```

---

### POST /api/auth/login

Logs the user in and sets the `auth_token` cookie.

**Body**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**200 OK**
```json
{
  "success": true
}
```

**401** if credentials are wrong
```json
{
  "error": "Invalid email or password"
}
```

---

### POST /api/auth/logout

Clears the auth cookie. No body needed.

**200 OK**
```json
{
  "success": true
}
```

---

### GET /api/auth/user

Returns the logged in user's info. Returns an empty object if not logged in, no error.

**200 OK** (logged in)
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "user"
}
```

**200 OK** (not logged in)
```json
{}
```

---

## Cart

All cart endpoints require the `auth_token` cookie.

### GET /api/cart

Gets the user's cart with all items and product details.

**200 OK**
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "cartId": 1,
      "productId": 3,
      "quantity": 2,
      "product": {
        "id": 3,
        "name": "Chicken Breast",
        "price": 12.99,
        "salePrice": null,
        "imageUrl": "https://example.com/image.jpg"
      }
    }
  ]
}
```

**401** if not logged in

---

### POST /api/cart

Adds a product to the cart. If it's already there, the quantity gets incremented.

**Body**
```json
{
  "productId": 3,
  "quantity": 1
}
```

**200 OK**
```json
{
  "success": true
}
```

**401** if not logged in

---

### PATCH /api/cart

Updates the quantity of a cart item. Set quantity to 0 or less to remove it.

**Body**
```json
{
  "cartItemId": 1,
  "quantity": 3
}
```

**200 OK**
```json
{
  "success": true
}
```

**401** if not logged in

---

### DELETE /api/cart

Removes an item from the cart.

**Body**
```json
{
  "cartItemId": 1
}
```

**200 OK**
```json
{
  "success": true
}
```

**401** if not logged in

---

## Orders

All order endpoints require the `auth_token` cookie.

### POST /api/orders

Turns the user's cart into an order. Uses sale price where available, creates the order, then clears the cart. No body needed.

**201 Created**
```json
{
  "orderId": 7
}
```

**400** if the cart is empty
```json
{
  "error": "Cart is empty"
}
```

**401** if not logged in

---

### GET /api/orders

Gets all orders for the logged in user, newest first.

**200 OK**
```json
[
  {
    "id": 7,
    "userId": 1,
    "total": 25.98,
    "createdAt": "2026-06-03T09:00:00.000Z",
    "items": [
      {
        "id": 1,
        "orderId": 7,
        "productId": 3,
        "quantity": 2,
        "price": 12.99,
        "product": {
          "id": 3,
          "name": "Chicken Breast"
        }
      }
    ]
  }
]
```

**401** if not logged in

---

## Products

### GET /api/subcategories

Returns all active product categories and their subcategories.

**200 OK**
```json
{
  "meat-seafood": ["Chicken", "Beef", "Fish"],
  "dairy-eggs": ["Milk", "Cheese", "Eggs"],
  "bakery": ["Bread", "Pastries"]
}
```

---

## Seed

### GET /api/seed

Seeds the database with test data. Only works when the `E2E` environment variable is set.

**200 OK**
```json
{
  "message": "Seeded"
}
```

**501** if E2E is not set
```
Not Available
```