# NovaShop

Full-stack e-commerce starter that pairs an Express + MySQL API with a Vite-powered React frontend.

## Project structure

```
novashop-react/
├─ backend/         # Express REST API + MySQL access
│  ├─ config/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ scripts/      # utility scripts (admin seeder)
│  └─ sql/          # schema definition
└─ frontend/        # React storefront built with Vite
```

## Quick start

1. **Database**
   - Run the SQL found in `backend/sql/schema.sql` to create `novashop_db` and all tables.
   - Seed an admin user either manually (see script output for credentials) or via `npm run seed` inside `backend`.
2. **Backend**
   ```bash
   cd backend
   cp .env.example .env   # update DB credentials + JWT secret if needed
   npm install
   npm run dev
   ```
   The API listens on `http://localhost:4000`.
3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The storefront runs on `http://localhost:5173` and talks to the backend via `http://localhost:4000/api`.

### Environment variables (`backend/.env`)

```
PORT=4000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=novashop_db
JWT_SECRET=some_long_random_secret
```

### Default admin seed

The seeder (`npm run seed` in `backend`) creates:

- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

Override `ADMIN_NAME`, `ADMIN_EMAIL`, or `ADMIN_PASSWORD` in `.env` before running the script if you prefer different credentials.

## Backend highlights

- Express server with CORS + Helmet + Morgan configured in `backend/server.js`.
- Centralized MySQL pool helper (`backend/config/db.js`) and lightweight model helpers under `backend/models`.
- Authentication & authorization middleware (`protect`, `optionalAuth`, `requireRole`) in `backend/middleware/authMiddleware.js`.
- Routes:
  - `authRoutes` (`/api/auth`) – register, login, current user profile.
  - `productRoutes` (`/api/products`) – public catalog plus admin CRUD (manager/admin roles enforced).
  - `orderRoutes` (`/api/orders`) – guest checkout, attach user if token present, and `/my` history for authenticated users.
  - `adminRoutes` (`/api/admin`) – stats + order drilldowns (admin/manager required).
- Order creation recalculates totals server-side, stores order items, and decrements stock inside a transaction.

## Frontend highlights

- React + Vite app with routing handled by `react-router-dom` v7.
- Global providers in `src/context`:
  - `AuthContext` manages JWT, persists it in `localStorage`, and auto-fetches `/api/auth/me`.
  - `CartContext` manages cart items, quantities, and totals with `localStorage` persistence.
- `src/api.js` standardizes REST calls (GET/POST/PUT/DELETE) to the backend.
- Pages cover storefront (home, listing, details, cart, checkout, auth) and admin tooling (dashboard, orders, products).
- `ProtectedRoute` component guards admin routes and redirects unauthorized users.

## SQL schema summary

Tables: `users`, `products`, `orders`, `order_items` with foreign keys and role enums as described in the requirements. Review or modify `backend/sql/schema.sql` before running migrations in phpMyAdmin or the MySQL CLI.

## Next steps

- Configure SSL, logging, and error monitoring before production use.
- Swap MySQL credentials for a managed service and add secrets management.
- Extend admin routes for updating order statuses, uploading images, etc.
