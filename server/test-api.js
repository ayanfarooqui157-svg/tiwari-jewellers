import assert from 'assert';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { unlink } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

let BASE_URL = process.env.TEST_API_URL?.replace(/\/$/, '') || '';
const SERVER_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const TEST_DATA_FILE = path.join(tmpdir(), `tiwari-jewellers-test-${randomUUID()}.json`);
let serverProcess;
let serverOutput = '';

function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(error => {
        if (error) reject(error);
        else resolve(port);
      });
    });
  });
}

async function ensureServerRunning() {
  if (BASE_URL) {
    const response = await fetch(`${BASE_URL}/health`, {
      signal: AbortSignal.timeout(1000)
    });
    if (!response.ok) {
      throw new Error(`Test API health check failed with status ${response.status}`);
    }
    return;
  }

  const port = process.env.TEST_PORT || await findAvailablePort();
  BASE_URL = `http://127.0.0.1:${port}/api`;
  serverProcess = spawn(process.execPath, ['server.js'], {
    cwd: SERVER_DIRECTORY,
    env: {
      ...process.env,
      PORT: String(port),
      TIWARI_DATA_FILE: TEST_DATA_FILE,
      MONGO_URI: '',
      MONGODB_URI: '',
      JWT_SECRET: process.env.JWT_SECRET || 'tiwari-api-test-secret'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  for (const stream of [serverProcess.stdout, serverProcess.stderr]) {
    stream.setEncoding('utf8');
    stream.on('data', chunk => {
      serverOutput = `${serverOutput}${chunk}`.slice(-4000);
    });
  }

  for (let attempt = 0; attempt < 50; attempt++) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`API server exited before becoming ready.\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${BASE_URL}/health`, {
        signal: AbortSignal.timeout(500)
      });
      if (response.ok) return;
    } catch {
      // The server may still be starting.
    }

    await delay(200);
  }

  serverProcess.kill();
  throw new Error(`API server did not become ready.\n${serverOutput}`);
}

async function runTests() {
  console.log('🧪 Starting TIWARI JWELLERS Backend API Verification Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ ${name}:`, err.message);
    }
  }

  // 1. Health
  await test('GET /health - Server health and diagnostics', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.ok(data.brand);
  });

  // 2. Products
  await test('GET /products - Fetch all products', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length > 0);
  });

  await test('GET /products?category=rings - Filter products by category', async () => {
    const res = await fetch(`${BASE_URL}/products?category=rings`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.every(p => p.category.toLowerCase() === 'rings'));
  });

  let firstProductId = '';
  await test('GET /products/:id - Fetch single product with related items', async () => {
    const listRes = await fetch(`${BASE_URL}/products`);
    const listData = await listRes.json();
    firstProductId = listData.data[0].id;

    const res = await fetch(`${BASE_URL}/products/${firstProductId}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.id, firstProductId);
    assert.ok(Array.isArray(data.related));
  });

  await test('POST /products/:id/reviews - Submit review', async () => {
    const res = await fetch(`${BASE_URL}/products/${firstProductId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: 'Ananya Sharma',
        rating: 5,
        title: 'Exquisite craftsmanship',
        text: 'The gold finish and diamond sparkle are simply breathtaking.'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.author, 'Ananya Sharma');
  });

  // 3. Categories
  await test('GET /categories - Fetch categories with live counts', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data[0].itemCount !== undefined);
  });

  // 4. Coupons
  await test('POST /coupons/validate - Valid coupon TIWARI10', async () => {
    const res = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'TIWARI10', subtotal: 40000 })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.valid, true);
    assert.strictEqual(data.discountAmount, 4000);
  });

  await test('POST /coupons/validate - Invalid coupon rejection', async () => {
    const res = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'FAKECODE', subtotal: 40000 })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  // 5. Auth
  const testEmail = `patron.${Date.now()}@example.com`;
  let authToken = '';
  await test('POST /auth/register - Register customer with bcrypt hash & JWT', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Devika Patel',
        email: testEmail,
        password: 'secureSecret123',
        phone: '+91 97766 55443'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, testEmail);
    authToken = data.token;
  });

  await test('POST /auth/login - Login with registered credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'secureSecret123'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
  });

  await test('POST /auth/addresses - Add delivery address for user', async () => {
    const res = await fetch(`${BASE_URL}/auth/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        address: {
          fullName: 'Devika Patel',
          street: 'Bungalow 7, Juhu Tara Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400049',
          phone: '+91 97766 55443'
        }
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.strictEqual(data.data[0].city, 'Mumbai');
  });

  // 6. Orders & Checkout
  let createdOrderId = '';
  let trackingNumber = '';

  await test('POST /orders - Reject unauthenticated order placement', async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: 'Guest User', email: 'guest@example.com' },
        shippingAddress: { fullName: 'Guest', city: 'Mumbai', pincode: '400001' },
        items: [{ id: firstProductId, name: 'Sample', price: 1000, quantity: 1 }],
        pricing: { total: 1000 }
      })
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await test('POST /orders - Create order with authenticated user & deduct inventory', async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        customer: { name: 'Devika Patel', email: testEmail, phone: '+91 97766 55443' },
        shippingAddress: {
          fullName: 'Devika Patel',
          street: 'Bungalow 7, Juhu Tara Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400049',
          phone: '+91 97766 55443'
        },
        items: [{ id: firstProductId, name: 'Sample Item', price: 48999, quantity: 1, selectedSize: '14' }],
        pricing: { subtotal: 48999, discount: 4899, deliveryCharge: 0, total: 44100 },
        paymentMethod: 'Razorpay (Online Payment)',
        paymentStatus: 'Paid'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.id);
    assert.ok(data.data.trackingNumber);
    createdOrderId = data.data.id;
    trackingNumber = data.data.trackingNumber;
  });

  await test('GET /orders/track/:trackingNumber - Order tracking details', async () => {
    const res = await fetch(`${BASE_URL}/orders/track/${trackingNumber}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.trackingNumber, trackingNumber);
    assert.ok(Array.isArray(data.timeline));
  });

  // 7. Payment
  await test('POST /payment/razorpay/create-order - Create Razorpay order', async () => {
    const res = await fetch(`${BASE_URL}/payment/razorpay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 44100 })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.order.amount, 4410000);
  });

  // 8. Delivery Pincode
  await test('GET /delivery/pincode/:pincode - Indian PIN code estimator', async () => {
    const res = await fetch(`${BASE_URL}/delivery/pincode/560001`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.serviceable, true);
    assert.ok(data.estimatedDeliveryDate);
  });

  // 9. Contact / Inquiries
  await test('POST /contact - Customer appointment & inquiry submission', async () => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pooja Hegde',
        email: 'pooja.h@example.com',
        phone: '+91 99000 11223',
        subject: 'Bespoke Jewellery Consultation',
        message: 'Requesting appointment for diamond necklace trial at Mumbai showroom.'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.ticketId);
  });

  // 10. Newsletter
  await test('POST /newsletter/subscribe - Subscribe to VIP Club', async () => {
    const res = await fetch(`${BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `newsletter.${Date.now()}@example.com` })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.voucherCode, 'TIWARI10');
  });

  // 11. Admin (Strict Security & Access Control)
  await test('GET /admin/stats - Reject non-admin access', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  let adminToken = '';
  await test('POST /auth/login - Real admin authentication', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@tiwarijewellers.com',
        password: 'RoyalTiwari@Admin2026'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'admin');
    assert.ok(data.token);
    adminToken = data.token;
  });

  await test('GET /admin/stats - Executive analytics accessible with admin token', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.totalSales !== undefined);
    assert.ok(data.data.totalOrders !== undefined);
  });

  await test('PATCH /admin/orders/:id/status - Update order dispatch status with admin token', async () => {
    const res = await fetch(`${BASE_URL}/admin/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Shipped' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.orderStatus, 'Shipped');
  });

  console.log(`\n🎉 Verification Complete: ${passed}/${total} tests passed successfully!`);
  return passed === total;
}

async function main() {
  try {
    await ensureServerRunning();
    const allTestsPassed = await runTests();
    if (!allTestsPassed) {
      process.exitCode = 1;
      if (serverOutput) console.error(`\nAPI server output:\n${serverOutput}`);
    }
  } finally {
    if (serverProcess && serverProcess.exitCode === null) {
      const exited = new Promise(resolve => serverProcess.once('exit', resolve));
      serverProcess.kill();
      await exited;
    }

    if (!process.env.TEST_API_URL) {
      try {
        await unlink(TEST_DATA_FILE);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exitCode = 1;
});
