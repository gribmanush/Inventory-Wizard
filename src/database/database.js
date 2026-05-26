import { db } from '../config/firebase';
import {
  collection, doc, setDoc, getDoc, getDocs, addDoc,
  updateDoc, query, where, orderBy, deleteDoc,
} from 'firebase/firestore';

// ─── Users ────────────────────────────────────────────────────────────────────

export async function dbGetUserById(userId) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? { user_id: snap.id, ...snap.data() } : null;
}

export async function dbUpdateUser(userId, { fullName, businessName }) {
  await updateDoc(doc(db, 'users', userId), {
    full_name: fullName,
    business_name: businessName || null,
  });
}

export async function dbUpdateUserAvatar(userId, avatarUri) {
  await updateDoc(doc(db, 'users', userId), { avatar_uri: avatarUri });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function dbCreateProduct({
  name, brand, sku, barcode, quantity, lowStockThreshold,
  costPrice, sellingPrice, location, imageUri, userId,
}) {
  const docRef = await addDoc(collection(db, 'users', userId, 'products'), {
    name,
    brand: brand || null,
    sku: sku || null,
    barcode: barcode || null,
    quantity: quantity || 0,
    low_stock_threshold: lowStockThreshold || 0,
    cost_price: costPrice || null,
    selling_price: sellingPrice || null,
    location: location || null,
    image_uri: imageUri || null,
  });
  return { lastInsertRowId: docRef.id };
}

export async function dbGetProductsByUser(userId) {
  const snap = await getDocs(query(
    collection(db, 'users', userId, 'products'),
    orderBy('name'),
  ));
  return snap.docs.map(d => ({ product_id: d.id, ...d.data() }));
}

export async function dbGetProductByBarcode(barcode, userId) {
  const snap = await getDocs(query(
    collection(db, 'users', userId, 'products'),
    where('barcode', '==', barcode),
  ));
  if (snap.empty) return null;
  return { product_id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function dbGetProductByBarcodeOrName(queryStr, userId) {
  const barcodeSnap = await getDocs(query(
    collection(db, 'users', userId, 'products'),
    where('barcode', '==', queryStr),
  ));
  if (!barcodeSnap.empty) {
    return { product_id: barcodeSnap.docs[0].id, ...barcodeSnap.docs[0].data() };
  }
  const allSnap = await getDocs(collection(db, 'users', userId, 'products'));
  const lower = queryStr.toLowerCase();
  const match = allSnap.docs.find(d => d.data().name?.toLowerCase().includes(lower));
  return match ? { product_id: match.id, ...match.data() } : null;
}

export async function dbGetProductById(productId, userId) {
  const snap = await getDoc(doc(db, 'users', userId, 'products', productId));
  return snap.exists() ? { product_id: snap.id, ...snap.data() } : null;
}

export async function dbUpdateProductQuantity(productId, quantity, userId) {
  await updateDoc(doc(db, 'users', userId, 'products', productId), { quantity });
}

export async function dbSearchProducts(queryStr, userId) {
  const snap = await getDocs(collection(db, 'users', userId, 'products'));
  const lower = queryStr.toLowerCase();
  return snap.docs
    .map(d => ({ product_id: d.id, ...d.data() }))
    .filter(p =>
      p.name?.toLowerCase().includes(lower) ||
      p.sku?.toLowerCase().includes(lower) ||
      p.barcode?.toLowerCase().includes(lower) ||
      p.brand?.toLowerCase().includes(lower),
    );
}

export async function dbGetLowStockProducts(userId) {
  const snap = await getDocs(collection(db, 'users', userId, 'products'));
  return snap.docs
    .map(d => ({ product_id: d.id, ...d.data() }))
    .filter(p => p.low_stock_threshold > 0 && p.quantity <= p.low_stock_threshold);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function dbCreateOrder({
  soNumber, customerName, customerEmail, userId,
  shippingAddress, paymentMethod, notes, paymentStatus,
}) {
  const docRef = await addDoc(collection(db, 'users', userId, 'orders'), {
    so_number: soNumber || null,
    order_date: new Date().toISOString(),
    customer_name: customerName || null,
    customer_email: customerEmail || null,
    shipping_address: shippingAddress || null,
    payment_method: paymentMethod || null,
    payment_status: paymentStatus || 'unpaid',
    notes: notes || null,
    status: 'pending',
    total_amount: 0,
  });
  return { lastInsertRowId: docRef.id };
}

export async function dbGetOrdersByUser(userId) {
  const snap = await getDocs(query(
    collection(db, 'users', userId, 'orders'),
    orderBy('order_date', 'desc'),
  ));
  return snap.docs.map(d => ({ order_id: d.id, ...d.data() }));
}

export async function dbGetOrderBySoNumber(soNumber, userId) {
  const snap = await getDocs(query(
    collection(db, 'users', userId, 'orders'),
    where('so_number', '==', soNumber),
  ));
  if (snap.empty) return null;
  return { order_id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function dbGetOrderById(orderId, userId) {
  const snap = await getDoc(doc(db, 'users', userId, 'orders', orderId));
  return snap.exists() ? { order_id: snap.id, ...snap.data() } : null;
}

export async function dbAddOrderItem({ orderId, productId, quantity, unitPrice, userId, productName, barcode }) {
  await addDoc(collection(db, 'users', userId, 'orders', orderId, 'items'), {
    product_id: productId,
    product_name: productName || 'Unknown',
    barcode: barcode || null,
    quantity,
    unit_price: unitPrice || 0,
  });
  const itemsSnap = await getDocs(collection(db, 'users', userId, 'orders', orderId, 'items'));
  const total = itemsSnap.docs.reduce((sum, d) => sum + d.data().quantity * d.data().unit_price, 0);
  await updateDoc(doc(db, 'users', userId, 'orders', orderId), { total_amount: total });
}

export async function dbGetOrderItems(orderId, userId) {
  const snap = await getDocs(collection(db, 'users', userId, 'orders', orderId, 'items'));
  return snap.docs.map(d => ({ order_item_id: d.id, ...d.data() }));
}

export async function dbGetNewOrdersCount(userId) {
  const snap = await getDocs(query(
    collection(db, 'users', userId, 'orders'),
    where('status', '==', 'pending'),
  ));
  return snap.size;
}

export async function dbUpdateOrderStatus(orderId, status, userId) {
  await updateDoc(doc(db, 'users', userId, 'orders', orderId), { status });
}
