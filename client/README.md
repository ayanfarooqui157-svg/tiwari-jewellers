# TIWARI JWELLERS client

The Vite development server proxies `/api` and `/uploads` requests to the
backend at `http://localhost:5000`. Start both applications from the repository
root so the backend is available:

```bash
npm run dev
```

Before starting the backend, configure `server/.env` with a non-empty
`JWT_SECRET`. To enable MongoDB, set `MONGO_URI` in the repository-root `.env`.
If you start only this client with `npm run dev` from the
`client` directory, API requests will fail until the backend is started
separately from the repository root with `npm run dev:server`.

The client is available at [http://localhost:3000](http://localhost:3000).
