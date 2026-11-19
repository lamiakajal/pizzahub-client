# PizzaHub Client

PizzaHub is a pizza ordering and delivery platform. Customers browse menus from local pizza shops and place orders, vendors (restaurants) manage their menu and orders and can upgrade to Premium, and admins review menu items, manage users and watch payments.

This repository is the web app (Next.js). The REST API lives in the server repository.

- Live site: `https://your-pizzahub-site.vercel.app` (placeholder, replace after deployment)
- Client repo: https://github.com/lamiakajal/pizzahub-client
- Server repo: https://github.com/lamiakajal/pizzahub-server

## Features

**Customers**
- Browse and search the public menu, filter by category, location and price, sort and paginate.
- View item details and place an order with a delivery date, address and message.
- Track and cancel pending orders from the dashboard.

**Vendors**
- Create and edit a business profile and menu items with images.
- Accept or reject incoming orders.
- Free plan: up to 3 active items. Premium: unlimited items, featured placement on the home page and a Premium badge.

**Admins**
- Overview dashboard with totals and charts.
- Approve, reject, pause or delete menu items.
- Search users, view their details, block and unblock accounts.
- Read-only list of subscription transactions.

**General**
- Email/password and Google sign in (Better Auth).
- Role based dashboards: customer, vendor and admin.
- Search, filter, sort and pagination on the menu.
- Light and dark mode.
- Fully responsive, with loading, error and empty states.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, shadcn/ui (`radix-ui`), `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`
- Better Auth (MongoDB adapter, Google OAuth, JWT plugin)
- `mongodb` driver (used by Better Auth and the admin seed script)
- `motion` (Framer Motion) for animations, `sonner` for toasts
- `recharts` for the admin charts
- `stripe` for the Premium payment success page

## Getting started

Requirements: Node.js 20 or newer, a MongoDB Atlas database and the running PizzaHub server.

```bash
git clone https://github.com/lamiakajal/pizzahub-client.git
cd pizzahub-client
npm install
cp .env.example .env.local
```

Fill in `.env.local` (see below), then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000. The server API must be running at the address in `NEXT_PUBLIC_API_URL`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run seed:admin -- email` | Promote an existing account to admin |

Admin accounts are never created through public sign up. Sign up normally, then run the seed script with that account's email.

## Environment variables

Set these in `.env.local` (names only, never commit real values):

| Name | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (same database as the server) |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `BETTER_AUTH_URL` | Public URL of this client app |
| `NEXT_PUBLIC_API_URL` | URL of the Express API |
| `GOOGLE_CLIENT_ID` | Google OAuth client id |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `IMGBB_API_KEY` | ImgBB key for image uploads |
| `STRIPE_SECRET_KEY` | Stripe key used to verify a completed checkout |

## Implementation notes for challenges

### 1. Advanced search and price sorting

The menu page reads its filters from the URL (`/menu?search=...&sort=price_asc`) and calls the public endpoint `GET /api/menu-items`. Because the state lives in the URL, results can be shared and the back button works.

| Query parameter | Effect |
| --- | --- |
| `search` | Case-insensitive match on item name or description |
| `category` | Exact category name |
| `location` | Case-insensitive exact location |
| `minPrice`, `maxPrice` | Price range (inclusive) |
| `sort` | `newest` (default), `price_asc`, `price_desc` or `featured` |
| `page`, `limit` | Pagination (default 9 per page, max 24) |

On the server this becomes one MongoDB aggregation: a `$match` built from the filters (always `status: "approved"`), a `$lookup` for the vendor, an `$addFields` stage that computes `isPremium`, a `$sort` chosen from the `sort` value, and a `$facet` that returns the requested page and the total count in a single query. `featured` sorts Premium vendors first, then newest. See the server README for the details.

### 2. JWT verification

1. Signing in creates a Better Auth session. The `jwt()` plugin exposes a signing key set at `/api/auth/jwks`.
2. Client components call `authClient.token()` to get a short-lived JWT.
3. `apiRequest` in `src/lib/api-client.ts` sends it as `Authorization: Bearer <token>`.
4. The Express `authenticate` middleware verifies the signature against the JWKS of this app, then loads the user from MongoDB, so role and block status are never taken from the token. A bad or missing token returns 401, a blocked account returns 403.
5. `requireRole(...)` then checks the role from the database and returns 403 when it does not match.

Server components use `requireUser` and `requireRole` from `src/lib/session.ts`, which read the session fresh from the database for every request.

## Project structure

```
src/app/(site)        Public pages (home, menu, sign in, sign up)
src/app/dashboard     Customer, vendor and admin dashboards
src/components        UI, layout, menu, home, admin and vendor components
src/lib               Auth, API helpers, types and utilities
scripts               One-off scripts such as the admin seed
```
