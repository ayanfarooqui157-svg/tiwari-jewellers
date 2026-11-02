# TIWARI JWELLERS – Luxury E-Commerce Platform

A full-stack luxury jewellery e-commerce platform crafted with modern React, Tailwind CSS, Express.js, and persistent state management.

---

## 🌟 Architecture Overview

```
tiwari-jewellers/
├── client/                     # Frontend Application (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Luxury Navbar, Footer, Drawers, Modals, Newsletter
│   │   ├── context/            # ShopContext (Cart, Wishlist, Auth state, API client)
│   │   ├── pages/              # Shop, ProductDetail, Checkout, Profile, Admin, Contact, About
│   │   ├── App.jsx             # Main router and view coordinator
│   │   └── main.jsx            # Entry point
│   ├── vite.config.js          # Vite config with API proxy to localhost:5000
│   └── package.json
│
├── server/                     # Backend API (Node.js + Express + Persistent JSON Engine)
│   ├── config/                 # Environment variables and configuration
│   ├── data/
│   │   ├── products.js         # Default dataset (products, categories, orders, coupons)
│   │   ├── store.js            # Persistent DataStore engine with auto-flushing to db.json
│   │   └── db.json             # Local runtime data (created automatically; not committed)
│   ├── middleware/             # JWT auth guard, request logger, error handlers
│   ├── routes/
│   │   ├── auth.routes.js      # Register, login, profile, wishlist, address management
│   │   ├── products.routes.js  # Catalog filtering, search, reviews
│   │   ├── categories.routes.js# Categories with dynamic product count
│   │   ├── orders.routes.js    # Order checkout, dispatch tracking
│   │   ├── payment.routes.js   # Razorpay order generation & verification
│   │   ├── delivery.routes.js  # Indian PIN code logistics estimator
│   │   ├── coupons.routes.js   # Coupon validation and promo vouchers
│   │   ├── contact.routes.js   # Customer concierge inquiries
│   │   ├── newsletter.routes.js# VIP Club newsletter subscriptions
│   │   └── admin.routes.js     # Executive analytics, product CRUD, order status
│   ├── test-api.js             # Automated API integration verification suite
│   ├── .env.example            # Environment variable template
│   ├── package.json            # Server dependencies
│   └── server.js               # Express application entrypoint
│
└── package.json                # Root concurrent scripts
```

---

## 🚀 Quick Start

### Configure the server

Copy `server/.env.example` to `server/.env` and set a unique `JWT_SECRET` (for
example, generate one with
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
The server exits with an explicit error if the key is missing. To connect
MongoDB Atlas, set `MONGO_URI` in the root `.env` file; the app waits for that
connection before starting. The root `.env` is ignored by Git. Without a
MongoDB URI, the API continues to use its local JSON datastore.

### 1. Run Both Frontend and Backend Concurrently

Run this command from the repository root (the directory containing this
README), not from `client/`:

```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 2. Run Independently

- **Start Backend:**
  ```bash
  npm run dev:server
  ```
- **Start Frontend:**
  ```bash
  npm run dev:client
  ```

### 3. Run Tests and Checks

```bash
npm test
```
Runs 19 backend integration tests, then checks the frontend lint and production build. The backend test runner starts and stops its own local API server; it does not require MongoDB.

---

## 📡 REST API Documentation

### Products & Catalog
- `GET /api/products` – Query products with filters: `category`, `material`, `metal`, `minPrice`, `maxPrice`, `search`, `sort`, `badge`, `inStock`
- `GET /api/products/:id` – Single product details + related category recommendations
- `POST /api/products/:id/reviews` – Submit verified customer review with rating

### Categories
- `GET /api/categories` – List all product categories with live item count

### Authentication & Patron Profiles
- `POST /api/auth/register` – Sign up new user (secure bcrypt password hashing + JWT)
- `POST /api/auth/login` – Authenticate user and issue 7-day JWT token
- `GET /api/auth/me` – Retrieve authenticated user profile, saved addresses, and wishlist
- `PUT /api/auth/profile` – Update patron details
- `POST /api/auth/wishlist/toggle` – Toggle product in persistent user wishlist
- `POST /api/auth/addresses` – Add delivery address to user account
- `DELETE /api/auth/addresses/:id` – Delete saved address

### Orders & Logistics
- `POST /api/orders` – Place order, deduct inventory, generate tracking number
- `GET /api/orders` – Retrieve order history (supports `?email=...`)
- `GET /api/orders/:id` – View individual order details
- `GET /api/orders/track/:trackingNumber` – Live multi-stage tracking timeline

### Payments
- `POST /api/payment/razorpay/create-order` – Create order with paise calculations
- `POST /api/payment/razorpay/verify` – Verify payment signature

### Delivery & Pincode Checker
- `GET /api/delivery/pincode/:pincode` – 6-digit Indian PIN verification, realistic courier estimate and city mapping

### Promotional Coupons
- `POST /api/coupons/validate` – Validate discount codes (`TIWARI10`, `FESTIVE15`, `SPARKLE500`) with minimum order constraints
- `GET /api/coupons` – List available promo vouchers

### Contact & Concierge
- `POST /api/contact` – Submit private appointment or bespoke inquiry (generates ticket ID, e.g. `TJ-INQ-1042`)
- `GET /api/contact` – List all inquiries (administrative)
- `PATCH /api/contact/:id/status` – Update status (`pending`, `contacted`, `resolved`)

### Newsletter
- `POST /api/newsletter/subscribe` – Subscribe email to VIP Club and receive `TIWARI10` voucher code
- `GET /api/newsletter/subscribers` – List subscribers

### Administration Portal
- `GET /api/admin/stats` – Real-time revenue, orders, customer counts, low stock alerts, category distribution
- `POST /api/admin/products` – Add new jewellery piece to catalog
- `PUT /api/admin/products/:id` – Edit existing product specifications
- `DELETE /api/admin/products/:id` – Remove product from boutique
- `PATCH /api/admin/orders/:id/status` – Update order lifecycle status (`Processing`, `Shipped`, `Delivered`, `Cancelled`)
- `GET /api/admin/inquiries` – Access consultation tickets submitted by patrons
