# FreshCart

A full-stack B2C grocery store application built with Next.js, Prisma, and TailwindCSS.

## Live Demo

- **Web**: https://grocery-cart-web.vercel.app/
- **Admin**: https://grocery-cart-admin.vercel.app/

## Features

### Web App
- Browse products by category, subcategory, or search
- On special section with sale pricing
- Add to cart, update quantities, remove items
- Checkout with mock payment
- Order history organised by month
- User registration and login
- Dark/light theme
- Fully mobile responsive

### Admin App
- Secure admin login (separate auth from web users)
- View, search and filter all products
- Create and edit products with full validation
- Put products on sale with a sale price
- Toggle products active/inactive
- View all users and their order history

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API routes and server actions
- **Database**: Prisma ORM
- **Auth**: JWT via HTTP-only cookies
- **Testing**: Vitest (unit), Playwright (E2E)
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

Make sure you have `pnpm` and `turbo` installed:

```bash
pnpm add -g turbo
```

### Install dependencies

```bash
pnpm install
```

### Environment variables

Copy `.env.example` to `.env` in `apps/admin` and `packages/db` and fill in your variables:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Run the project

```bash
turbo dev
```

- Web app: http://localhost:3001
- Admin app: http://localhost:3002

### Run tests

```bash
# Unit tests
pnpm test

# E2E tests
turbo test-1   # Web client part 1
turbo test-2   # Web client part 2
turbo test-3   # Admin
```

## API Documentation

See [APIWEBDOC.md](./APIWEBDOC.md) and [APIADMINDOC.md](./APIADMINDOC.md) for full API documentation.
