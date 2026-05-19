import * as SQLite from 'expo-sqlite';

let _db = null;

export function getDb() {
  if (!_db) {
    _db = SQLite.openDatabaseSync('inventorywizard.db');
  }
  return _db;
}

export function initDatabase() {
  const db = getDb();

  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      business_name TEXT,
      signup_date TEXT NOT NULL,
      free_period_end TEXT NOT NULL,
      subscription_status TEXT DEFAULT 'free'
    );

    CREATE TABLE IF NOT EXISTS categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      sku TEXT,
      barcode TEXT,
      quantity INTEGER DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 0,
      cost_price REAL,
      selling_price REAL,
      category_id INTEGER,
      location TEXT,
      image_uri TEXT,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (category_id) REFERENCES categories(category_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT,
      so_number TEXT,
      order_date TEXT NOT NULL,
      customer_name TEXT,
      customer_email TEXT,
      total_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      user_id INTEGER NOT NULL,
      shipping_address TEXT,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'unpaid',
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
      change_type TEXT NOT NULL,
      quantity_change INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      reference_id INTEGER,
      reference_type TEXT,
      FOREIGN KEY (product_id) REFERENCES products(product_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
  `);
}

// ─── Users ───────────────────────────────────────────────────────────────────

export function dbCreateUser({ fullName, email, passwordHash, businessName }) {
  const db = getDb();
  const now = new Date().toISOString();
  const freePeriodEnd = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString();
  return db.runSync(
    `INSERT INTO users (full_name, email, password_hash, business_name, signup_date, free_period_end)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [fullName, email, passwordHash, businessName || null, now, freePeriodEnd]
  );
}

export function dbGetUserByEmail(email) {
  return getDb().getFirstSync('SELECT * FROM users WHERE email = ?', [email]);
}

export function dbGetUserById(userId) {
  return getDb().getFirstSync('SELECT * FROM users WHERE user_id = ?', [userId]);
}

export function dbUpdateUser(userId, { fullName, businessName }) {
  getDb().runSync(
    'UPDATE users SET full_name = ?, business_name = ? WHERE user_id = ?',
    [fullName, businessName || null, userId]
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function dbCreateProduct({ name, brand, sku, barcode, quantity, lowStockThreshold, costPrice, sellingPrice, categoryId, location, imageUri, userId }) {
  const db = getDb();
  const result = db.runSync(
    `INSERT INTO products (name, brand, sku, barcode, quantity, low_stock_threshold, cost_price, selling_price, category_id, location, image_uri, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, brand || null, sku || null, barcode || null, quantity || 0, lowStockThreshold || 0, costPrice || null, sellingPrice || null, categoryId || null, location || null, imageUri || null, userId]
  );
  return result;
}

export function dbGetProductsByUser(userId) {
  return getDb().getAllSync('SELECT * FROM products WHERE user_id = ? ORDER BY name ASC', [userId]);
}

export function dbGetProductByBarcode(barcode, userId) {
  return getDb().getFirstSync('SELECT * FROM products WHERE barcode = ? AND user_id = ?', [barcode, userId]);
}

export function dbGetProductByBarcodeOrName(query, userId) {
  const like = `%${query}%`;
  return getDb().getFirstSync(
    'SELECT * FROM products WHERE user_id = ? AND (barcode = ? OR name LIKE ?)',
    [userId, query, like]
  );
}

export function dbGetProductById(productId) {
  return getDb().getFirstSync('SELECT * FROM products WHERE product_id = ?', [productId]);
}

export function dbUpdateProductQuantity(productId, quantity, userId, changeType, refId, refType) {
  const db = getDb();
  const old = db.getFirstSync('SELECT quantity FROM products WHERE product_id = ?', [productId]);
  const diff = quantity - (old ? old.quantity : 0);
  db.runSync('UPDATE products SET quantity = ? WHERE product_id = ?', [quantity, productId]);
  if (diff !== 0) {
    db.runSync(
      `INSERT INTO transactions (change_type, quantity_change, timestamp, product_id, user_id, reference_id, reference_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [changeType || 'manual', diff, new Date().toISOString(), productId, userId, refId || null, refType || null]
    );
  }
}

export function dbSearchProducts(query, userId) {
  const like = `%${query}%`;
  return getDb().getAllSync(
    'SELECT * FROM products WHERE user_id = ? AND (name LIKE ? OR sku LIKE ? OR barcode LIKE ? OR brand LIKE ?)',
    [userId, like, like, like, like]
  );
}

export function dbGetLowStockProducts(userId) {
  return getDb().getAllSync(
    'SELECT * FROM products WHERE user_id = ? AND low_stock_threshold > 0 AND quantity <= low_stock_threshold',
    [userId]
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function dbCreateOrder({ soNumber, customerName, customerEmail, userId, shippingAddress, paymentMethod, notes }) {
  const db = getDb();
  const result = db.runSync(
    `INSERT INTO orders (so_number, order_date, customer_name, customer_email, user_id, shipping_address, payment_method, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [soNumber || null, new Date().toISOString(), customerName || null, customerEmail || null, userId, shippingAddress || null, paymentMethod || null, notes || null]
  );
  return result;
}

export function dbGetOrdersByUser(userId) {
  return getDb().getAllSync('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [userId]);
}

export function dbGetOrderBySoNumber(soNumber, userId) {
  return getDb().getFirstSync('SELECT * FROM orders WHERE so_number = ? AND user_id = ?', [soNumber, userId]);
}

export function dbGetOrderById(orderId) {
  return getDb().getFirstSync('SELECT * FROM orders WHERE order_id = ?', [orderId]);
}

export function dbAddOrderItem({ orderId, productId, quantity, unitPrice }) {
  getDb().runSync(
    'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
    [orderId, productId, quantity, unitPrice || 0]
  );
  const total = getDb().getFirstSync(
    'SELECT SUM(quantity * unit_price) as t FROM order_items WHERE order_id = ?',
    [orderId]
  );
  getDb().runSync('UPDATE orders SET total_amount = ? WHERE order_id = ?', [total?.t || 0, orderId]);
}

export function dbGetOrderItems(orderId) {
  return getDb().getAllSync(
    `SELECT oi.*, p.name as product_name, p.barcode, p.brand
     FROM order_items oi
     JOIN products p ON oi.product_id = p.product_id
     WHERE oi.order_id = ?`,
    [orderId]
  );
}

export function dbGetNewOrdersCount(userId) {
  const result = getDb().getFirstSync(
    "SELECT COUNT(*) as cnt FROM orders WHERE user_id = ? AND status = 'pending'",
    [userId]
  );
  return result?.cnt || 0;
}

export function dbUpdateOrderStatus(orderId, status) {
  getDb().runSync('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
}
