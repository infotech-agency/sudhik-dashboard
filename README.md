# SHUDDHIK&trade; Admin Dashboard

A professional, corporate-style admin dashboard for the SHUDDHIK&trade; premium temple &amp; sacred surface cleaner e-commerce platform. Built with React, Vite, Tailwind CSS, Chart.js, and Axios. Connects to an existing Node.js/Express/MongoDB REST API.

## Theme

- **Primary (deep maroon/wine):** `#4A1020`
- **Background (cream):** `#FDF6EC`
- **Accent (gold/mustard):** `#C9A227`
- Serif headings (Cormorant Garamond), sans-serif body (Inter)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend API

# 3. Start the dev server
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL of the Express REST API | `http://localhost:5000/api` |
| `VITE_AUTH_TOKEN_KEY` | localStorage key for the admin JWT | `shuddhik_admin_token` |

## Pointing at the Backend

All API calls go through a centralized Axios instance (`src/api/client.ts`) that:

1. Reads `VITE_API_BASE_URL` as the base URL
2. Attaches the admin JWT (from `localStorage`) as `Authorization: Bearer <token>` on every request
3. Auto-redirects to `/login` on a `401` response

Resource service files live in `src/api/` — one per backend resource (`auth.ts`, `dashboard.ts`, `products.ts`, `orders.ts`, `users.ts`, `reviews.ts`, `coupons.ts`, `categories.ts`). Components never call Axios directly; they go through these service files.

## Folder Structure

```
src/
  api/            -> axios instance + one service file per resource
  components/
    common/       -> DataTable, Modal, StatCard, Badge, Toast, Spinner,
                     EmptyState, ConfirmDialog, Sidebar, Topbar, Layout,
                     ProtectedRoute
    charts/       -> RevenueLineChart, OrdersBarChart, MonthlySalesChart,
                     StatusDoughnutChart, PaymentSplitChart, TopUsersChart
    products/     -> ProductForm, ImageUploader, FaqEditor
    orders/       -> OrderDetailDrawer, StatusBadge
    users/        -> UserDetailDrawer
    reviews/      -> StarRating
    coupons/      -> CouponForm
  context/        -> AuthContext, ToastContext
  hooks/          -> useApi (reusable data-fetching hook)
  pages/          -> Login, Dashboard, Products, Orders, Users, Reviews,
                     Coupons, Categories
  utils/          -> format (currency/date), chartConfig
  App.tsx         -> routing + providers
  main.tsx        -> entry
```

## Features

- **Login** — admin email/password auth with JWT persistence
- **Dashboard** — revenue trend, orders, monthly sales, top spending users, order-status & payment-method breakdowns, quick stat cards
- **Products** — data table with thumbnails, search/filter/pagination, create/edit modal with image upload (drag-and-drop), rich sections (benefits, ingredients, how-to-use, specifications, shipping, FAQs), delete confirmation
- **Orders** — filterable table (status, payment method, date range), detail drawer with shipping address, itemized list, payment & Shiprocket info, status update, AWB generation, tracking, cancellation
- **Users** — searchable table, detail drawer with profile, lifetime spend, full order history
- **Reviews** — table with visual star ratings, filters (product, rating, reviewer), delete moderation, average-rating stat row
- **Coupons** — CRUD for flat/percentage discount codes with min order, expiry, usage limit, active toggle
- **Categories** — CRUD for product categories

Reusable `DataTable` and `Modal` components are used across all sections — no duplicated table/modal code.

## Backend Additions Required

Two features are not present in the existing API and need backend additions (same MVC pattern as Products):

### 1. Coupons

- **Model:** `Coupon` with fields: `code`, `discountType` (`flat` | `percentage`), `value`, `minOrderAmount`, `expiryDate`, `usageLimit`, `usedCount`, `active`
- **Routes:** `GET/POST/PUT/DELETE /api/coupons`
- **Order flow:** in the Order creation controller, validate the submitted coupon code, check expiry/usage limits, and recompute `totalAmount` accordingly.

### 2. Reviews (admin-all endpoint)

- The frontend uses `GET /api/reviews` (with optional `product`, `rating`, `search` query params) to list all reviews across products for moderation.
- If only `GET /api/reviews/product/:productId` exists, the frontend falls back to looping over products — but a single admin-all endpoint is recommended for performance.
- `DELETE /api/reviews/:id` is required for moderation.

## Build

```bash
npm run build   # production build
npm run typecheck
```
