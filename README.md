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
- Track and cancel pending orders from the dashboard, with a status timeline for each order.

**Vendors**
- Create and edit a business profile and menu items with images.
- Accept or reject incoming orders.
- Free plan: up to 3 active items. Premium: unlimited items, featured placement on the home page and a Premium badge.

**Admins**
- Overview dashboard with totals and charts (vendors and customers get stat cards and charts too).
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

## Orders flow

1. A customer opens an approved menu item and sends an order with a delivery date, delivery address and an optional message. Only customers can order: vendors and admins cannot, and nobody can order their own item.
2. A new order is `pending`. The delivery date is stored as the start of that day (UTC) and cannot be in the past.
3. A customer cannot hold two open (`pending` or `accepted`) orders for the same item and delivery date. The server answers `409`, and a unique partial index backs this up.
4. While an order is `pending`, the vendor can accept or reject it, once. The customer can cancel it. After that the status is final.

| Status | Set by | Meaning |
| --- | --- | --- |
| `pending` | System | Waiting for the restaurant |
| `accepted` | Vendor | The restaurant will deliver it |
| `rejected` | Vendor | The restaurant declined it |
| `cancelled` | Customer | The customer withdrew it |

Customers do not pay online. Stripe is used only for the vendor Premium subscription.

## Premium subscription flow

1. A vendor opens **Subscription** in the dashboard and clicks Upgrade. The client calls `POST /api/vendor/subscription/checkout`.
2. The server creates a Stripe Checkout Session in `subscription` mode with the vendor id in the metadata, and returns its URL.
3. After paying, Stripe sends the customer to `/payment/success?session_id=...`. That page is a server component that retrieves the session from Stripe and checks `status === "complete"`. It only shows the result: it does not grant Premium.
4. Premium is activated **only** by the verified webhook `POST /api/stripe/webhook`. The route uses `express.raw`, is mounted before `express.json()`, and checks the Stripe signature.
5. Handled events: `checkout.session.completed` (activate Premium, record the transaction), `invoice.payment_succeeded` (renewal, extend Premium), `invoice.payment_failed` (record the failure) and `customer.subscription.deleted` (revoke Premium).
6. Transactions are idempotent: `stripeSessionId` is unique, a Checkout Session id for the first payment and `invoice_<id>` for renewals, so a retried event never creates a duplicate.

To test locally, forward events with the Stripe CLI (`stripe listen --forward-to localhost:5000/api/stripe/webhook`), copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`, and pay with the test card `4242 4242 4242 4242` (any future expiry, any CVC).

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

### 2. Stripe Premium subscription

The vendor Subscription page asks the server for a Checkout Session URL and redirects to Stripe. The success page (`/payment/success`) is a server component: it retrieves the session with `STRIPE_SECRET_KEY` and shows the result only when `status === "complete"`. Premium itself is granted by the verified webhook on the server, never by this page. See "Premium subscription flow" above and the server README.

### 3. JWT verification

1. Signing in creates a Better Auth session. The `jwt()` plugin exposes a signing key set at `/api/auth/jwks`.
2. Client components call `authClient.token()` to get a short-lived JWT.
3. `apiRequest` in `src/lib/api-client.ts` sends it as `Authorization: Bearer <token>`.
4. The Express `authenticate` middleware verifies the signature against the JWKS of this app, then loads the user from MongoDB, so role and block status are never taken from the token. A bad or missing token returns 401, a blocked account returns 403.
5. `requireRole(...)` then checks the role from the database and returns 403 when it does not match.

Server components use `requireUser` and `requireRole` from `src/lib/session.ts`, which read the session fresh from the database for every request.

## Optional features

- **Dark mode:** a theme toggle in the navbar and dashboard. The choice is saved in the browser and applied before first paint.
- **Order status timeline:** the details panel of every order shows a vertical timeline for customers and vendors: order placed, then either waiting for the restaurant or the final step (accepted, rejected or cancelled) with its date.

## Deployment

Fill these in after deploying (placeholders for now):

| Item | Value |
| --- | --- |
| Live site | `https://your-pizzahub-site.vercel.app` |
| Live API | `https://your-pizzahub-api.vercel.app` |
| Admin test account | email: `<admin email>` / password: `<admin password>` |
| Vendor test account | email: `<vendor email>` / password: `<vendor password>` |
| Customer test account | email: `<customer email>` / password: `<customer password>` |

Production checklist: set every environment variable on both apps, set `CLIENT_URL` on the server to the live site, add the live Google OAuth redirect URI, and register the live webhook URL (`<live API>/api/stripe/webhook`) in Stripe.

## Project structure

```
src/app/(site)        Public pages (home, menu, sign in, sign up)
src/app/dashboard     Customer, vendor and admin dashboards
src/components        UI, layout, menu, home, admin and vendor components
src/lib               Auth, API helpers, types and utilities
scripts               One-off scripts such as the admin seed
```

## Deploying to Vercel

1. Deploy the server first and copy its URL.
2. Import the `pizzahub-client` repository in Vercel (Framework Preset: Next.js).
3. Add these environment variables before the first build: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the live client URL), `NEXT_PUBLIC_API_URL` (the live server URL), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `IMGBB_API_KEY`, `STRIPE_SECRET_KEY`.
4. In the Google Cloud console, add the live client URL as an authorized JavaScript origin and `https://<client-url>/api/auth/callback/google` as an authorized redirect URI.
5. Set `CLIENT_URL` and `BETTER_AUTH_URL` on the server to the live client URL, then redeploy the server.
6. Open the live site, reload a private route such as `/dashboard` while signed in, and check that you stay signed in.
