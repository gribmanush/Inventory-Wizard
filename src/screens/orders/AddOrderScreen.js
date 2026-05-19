import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { dbCreateOrder, dbAddOrderItem, dbGetProductByBarcodeOrName } from '../../database/database';

const STEP_DETAILS = 1;
const STEP_ITEMS = 2;
const STEP_SUCCESS = 3;

export default function AddOrderScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [step, setStep] = useState(STEP_DETAILS);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1 form
  const [form, setForm] = useState({
    merchantName: '', soNumber: '', deliveryAddress: '', paymentStatus: 'unpaid',
  });
  const [formErrors, setFormErrors] = useState({});

  // Step 2 item
  const [barcode, setBarcode] = useState('');
  const [amountOrdered, setAmountOrdered] = useState('');
  const [addedItems, setAddedItems] = useState([]);
  const [itemError, setItemError] = useState('');

  const setF = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setFormErrors(p => ({ ...p, [field]: undefined }));
  };

  const validateDetails = () => {
    const e = {};
    if (!form.merchantName.trim()) e.merchantName = 'Merchant name is required.';
    if (!form.soNumber.trim()) e.soNumber = 'SO number is required.';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateOrder = () => {
    if (!validateDetails()) return;
    setLoading(true);
    try {
      const result = dbCreateOrder({
        soNumber: form.soNumber.trim(),
        customerName: form.merchantName.trim(),
        shippingAddress: form.deliveryAddress.trim(),
        paymentStatus: form.paymentStatus,
        userId: user.user_id,
      });
      setOrderId(result.lastInsertRowId);
      setStep(STEP_ITEMS);
    } catch {
      Alert.alert('Error', 'Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setItemError('');
    if (!barcode.trim()) { setItemError('Enter a product barcode or name.'); return; }
    if (!amountOrdered.trim() || isNaN(Number(amountOrdered)) || Number(amountOrdered) <= 0) {
      setItemError('Enter a valid amount.'); return;
    }
    const product = dbGetProductByBarcodeOrName(barcode.trim(), user.user_id);
    if (!product) { setItemError('Product not found. Check the barcode or name.'); return; }
    dbAddOrderItem({ orderId, productId: product.product_id, quantity: Number(amountOrdered), unitPrice: product.selling_price || 0 });
    setAddedItems(p => [...p, { ...product, orderedQty: Number(amountOrdered) }]);
    setBarcode('');
    setAmountOrdered('');
  };

  const handleDone = () => setStep(STEP_SUCCESS);

  const s = makeStyles(colors);

  if (step === STEP_SUCCESS) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
        <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <View style={{ width: 40 }} />
          <Text style={[s.headerTitle, { color: colors.text }]}>Add Order</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.successContainer}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={[s.successTitle, { color: colors.text }]}>New order has been created!</Text>
          <Text style={[s.successSub, { color: colors.textSecondary }]}>
            SO: {form.soNumber} · {addedItems.length} item{addedItems.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity
            style={[s.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              setStep(STEP_DETAILS);
              setForm({ merchantName: '', soNumber: '', deliveryAddress: '', paymentStatus: 'unpaid' });
              setAddedItems([]); setOrderId(null);
            }}
          >
            <Text style={s.primaryBtnText}>Create New Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.secondaryBtn, { borderColor: colors.border }]} onPress={() => navigation.navigate('Orders')}>
            <Text style={[s.secondaryBtnText, { color: colors.text }]}>View Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === STEP_ITEMS) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
        <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setStep(STEP_DETAILS)} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.text }]}>Add Items · {form.soNumber}</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[s.sectionLabel, { color: colors.textSecondary }]}>Add products to this order</Text>

          <View style={s.fieldGroup}>
            <Text style={[s.label, { color: colors.textSecondary }]}>Product Barcode or Name</Text>
            <TextInput
              style={[s.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              placeholder="Scan or type barcode / name"
              placeholderTextColor={colors.textSecondary}
              value={barcode}
              onChangeText={setBarcode}
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={[s.label, { color: colors.textSecondary }]}>Amount Ordered</Text>
            <TextInput
              style={[s.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              placeholder="Quantity"
              placeholderTextColor={colors.textSecondary}
              value={amountOrdered}
              onChangeText={setAmountOrdered}
              keyboardType="numeric"
            />
          </View>

          {itemError ? <Text style={[s.errorText, { color: colors.error }]}>{itemError}</Text> : null}

          <TouchableOpacity style={[s.primaryBtn, { backgroundColor: colors.primary }]} onPress={handleAddItem}>
            <Text style={s.primaryBtnText}>Add Item to Order</Text>
          </TouchableOpacity>

          {addedItems.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[s.sectionLabel, { color: colors.textSecondary }]}>Added Items ({addedItems.length})</Text>
              {addedItems.map((item, i) => (
                <View key={i} style={[s.itemRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="cube-outline" size={18} color={colors.primary} style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.itemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[s.itemSub, { color: colors.textSecondary }]}>{item.barcode || 'No barcode'}</Text>
                  </View>
                  <Text style={[s.itemQty, { color: colors.primary }]}>×{item.orderedQty}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={[s.doneBtn, { borderColor: colors.primary }]} onPress={handleDone}>
            <Text style={[s.doneBtnText, { color: colors.primary }]}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 1
  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Add Order</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {[
          { label: 'Merchant Name *', field: 'merchantName' },
          { label: 'SO Number *', field: 'soNumber' },
          { label: 'Delivery Address', field: 'deliveryAddress' },
        ].map(({ label, field }) => (
          <View key={field} style={s.fieldGroup}>
            <Text style={[s.label, { color: colors.textSecondary }]}>{label}</Text>
            <TextInput
              style={[s.input, { backgroundColor: colors.inputBg, borderColor: formErrors[field] ? colors.error : colors.border, color: colors.text }]}
              placeholder={label.replace(' *', '')}
              placeholderTextColor={colors.textSecondary}
              value={form[field]}
              onChangeText={v => setF(field, v)}
            />
            {formErrors[field] && <Text style={[s.errorText, { color: colors.error }]}>{formErrors[field]}</Text>}
          </View>
        ))}

        <View style={s.fieldGroup}>
          <Text style={[s.label, { color: colors.textSecondary }]}>Payment Status</Text>
          <View style={s.toggleRow}>
            {['unpaid', 'paid', 'partial'].map(status => (
              <TouchableOpacity
                key={status}
                style={[s.toggleBtn, { borderColor: form.paymentStatus === status ? colors.primary : colors.border, backgroundColor: form.paymentStatus === status ? colors.primary + '18' : colors.surface }]}
                onPress={() => setF('paymentStatus', status)}
              >
                <Text style={[s.toggleBtnText, { color: form.paymentStatus === status ? colors.primary : colors.textSecondary }]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[s.primaryBtn, { backgroundColor: colors.primary, marginTop: 16 }]}
          onPress={handleCreateOrder}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Create New Order</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    safe: { flex: 1 },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
    },
    backBtn: { width: 40 },
    headerTitle: { fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
    scroll: { padding: 16, paddingBottom: 40 },
    sectionLabel: { fontSize: 13, fontWeight: '500', marginBottom: 12 },
    fieldGroup: { marginBottom: 14 },
    label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
    input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, borderWidth: 1 },
    errorText: { fontSize: 12, marginTop: 4 },
    toggleRow: { flexDirection: 'row', gap: 8 },
    toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, alignItems: 'center' },
    toggleBtnText: { fontSize: 13, fontWeight: '600' },
    primaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 12 },
    primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    secondaryBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
    secondaryBtnText: { fontSize: 15, fontWeight: '600' },
    doneBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 2, marginTop: 20, marginBottom: 8 },
    doneBtnText: { fontSize: 15, fontWeight: '700' },
    itemRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
    itemName: { fontSize: 14, fontWeight: '500' },
    itemSub: { fontSize: 12 },
    itemQty: { fontSize: 16, fontWeight: '700' },
    successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    successTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 8, textAlign: 'center' },
    successSub: { fontSize: 14, marginBottom: 32 },
  });
}
