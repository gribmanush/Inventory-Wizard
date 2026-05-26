import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import BarcodeScannerModal from '../../components/BarcodeScannerModal';
import HelpModal from '../../components/HelpModal';
import useHelpModal from '../../hooks/useHelpModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  dbGetOrderBySoNumber, dbGetProductByBarcodeOrName,
  dbUpdateProductQuantity,
} from '../../database/database';

const STEP_SO = 1;
const STEP_PACK = 2;
const STEP_DONE = 3;

export default function PackOrderScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const { helpVisible, showHelp, hideHelp } = useHelpModal('PackOrder');
  const [step, setStep] = useState(STEP_SO);
  const [soInput, setSoInput] = useState('');
  const [soError, setSoError] = useState('');
  const [order, setOrder] = useState(null);

  const [barcode, setBarcode] = useState('');
  const [amountPacked, setAmountPacked] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [packError, setPackError] = useState('');
  const [lastPacked, setLastPacked] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEnterSO = async () => {
    setSoError('');
    if (!soInput.trim()) { setSoError('Enter an SO number.'); return; }
    const found = await dbGetOrderBySoNumber(soInput.trim(), user.user_id);
    if (!found) { setSoError(`Order "${soInput}" not found.`); return; }
    setOrder(found);
    setStep(STEP_PACK);
  };

  const handlePackProduct = async () => {
    setPackError('');
    if (!barcode.trim()) { setPackError('Enter a product barcode.'); return; }
    if (!amountPacked.trim() || isNaN(Number(amountPacked)) || Number(amountPacked) <= 0) {
      setPackError('Enter a valid amount.'); return;
    }
    setLoading(true);
    try {
      const product = await dbGetProductByBarcodeOrName(barcode.trim(), user.user_id);
      if (!product) { setPackError('Product not found. Check the barcode.'); setLoading(false); return; }
      const newQty = Math.max(0, product.quantity - Number(amountPacked));
      await dbUpdateProductQuantity(product.product_id, newQty, user.user_id);
      setLastPacked({ product, packed: Number(amountPacked) });
      setStep(STEP_DONE);
    } catch {
      setPackError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePackAnother = () => {
    setBarcode('');
    setAmountPacked('');
    setPackError('');
    setLastPacked(null);
    setStep(STEP_PACK);
  };

  const s = makeStyles(colors);

  if (step === STEP_DONE && lastPacked) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
        <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.text }]}>Pack Order</Text>
          <TouchableOpacity onPress={showHelp} style={{ width: 40, alignItems: 'flex-end' }}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={s.stepContainer}>
          <View style={[s.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[s.resultLabel, { color: colors.textSecondary }]}>Product Barcode</Text>
            <Text style={[s.resultValue, { color: colors.text }]}>{lastPacked.product.barcode || lastPacked.product.name}</Text>
            <View style={[s.successBanner, { backgroundColor: colors.success + '18', borderColor: colors.success }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[s.successBannerText, { color: colors.success }]}>
                Product has been packed!
              </Text>
            </View>
            <Text style={[s.resultSub, { color: colors.textSecondary }]}>
              {lastPacked.packed} unit{lastPacked.packed !== 1 ? 's' : ''} packed · {lastPacked.product.name}
            </Text>
          </View>
          <TouchableOpacity style={[s.primaryBtn, { backgroundColor: colors.primary }]} onPress={handlePackAnother}>
            <Text style={s.primaryBtnText}>Pack Another Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.secondaryBtn, { borderColor: colors.border }]} onPress={() => { setStep(STEP_SO); setSoInput(''); setOrder(null); }}>
            <Text style={[s.secondaryBtnText, { color: colors.text }]}>New Order</Text>
          </TouchableOpacity>
        </View>
        <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="PackOrder" />
      </SafeAreaView>
    );
  }

  if (step === STEP_PACK) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
        <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setStep(STEP_SO)} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.text }]}>Pack Order · {order?.so_number}</Text>
          <TouchableOpacity onPress={showHelp} style={{ width: 40, alignItems: 'flex-end' }}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.stepContainer} keyboardShouldPersistTaps="handled">
          <View style={[s.orderInfoCard, { backgroundColor: colors.bannerBlueBg }]}>
            <Ionicons name="cube-outline" size={16} color={colors.bannerBlueText} />
            <Text style={[s.orderInfoText, { color: colors.bannerBlueText }]}>
              Order for: {order?.customer_name || 'Unknown'} · SO: {order?.so_number}
            </Text>
          </View>

          <View style={s.fieldGroup}>
            <Text style={[s.label, { color: colors.textSecondary }]}>Product Barcode</Text>
            <View style={[s.inputRow, { backgroundColor: colors.inputBg, borderColor: packError ? colors.error : colors.border }]}>
              <TextInput
                style={[s.inputFlex, { color: colors.text }]}
                placeholder="Scan or enter barcode"
                placeholderTextColor={colors.textSecondary}
                value={barcode}
                onChangeText={setBarcode}
              />
              <TouchableOpacity onPress={() => setScannerVisible(true)} style={s.scanBtn}>
                <Ionicons name="barcode-outline" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.fieldGroup}>
            <Text style={[s.label, { color: colors.textSecondary }]}>Amount Packed</Text>
            <TextInput
              style={[s.input, { backgroundColor: colors.inputBg, borderColor: packError ? colors.error : colors.border, color: colors.text }]}
              placeholder="Quantity packed"
              placeholderTextColor={colors.textSecondary}
              value={amountPacked}
              onChangeText={setAmountPacked}
              keyboardType="numeric"
            />
          </View>

          {packError ? <Text style={[s.errorText, { color: colors.error }]}>{packError}</Text> : null}

          <TouchableOpacity style={[s.primaryBtn, { backgroundColor: colors.primary }]} onPress={handlePackProduct} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Pack Product</Text>}
          </TouchableOpacity>
        </ScrollView>

        <BarcodeScannerModal
          visible={scannerVisible}
          onScanned={data => { setBarcode(data); setPackError(''); }}
          onClose={() => setScannerVisible(false)}
        />
        <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="PackOrder" />
      </SafeAreaView>
    );
  }

  // Step 1: Enter SO number
  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Pack Order</Text>
        <TouchableOpacity onPress={showHelp} style={{ width: 40, alignItems: 'flex-end' }}>
          <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={s.stepContainer} keyboardShouldPersistTaps="handled">
        <Ionicons name="cube-outline" size={52} color={colors.primary} style={{ marginBottom: 20 }} />
        <Text style={[s.stepTitle, { color: colors.text }]}>Enter Order Number</Text>
        <Text style={[s.stepSub, { color: colors.textSecondary }]}>Enter the SO number to start packing</Text>

        <View style={s.fieldGroup}>
          <Text style={[s.label, { color: colors.textSecondary }]}>SO Number for Packing</Text>
          <TextInput
            style={[s.input, { backgroundColor: colors.inputBg, borderColor: soError ? colors.error : colors.border, color: colors.text }]}
            placeholder="e.g. SO-0001"
            placeholderTextColor={colors.textSecondary}
            value={soInput}
            onChangeText={v => { setSoInput(v); setSoError(''); }}
          />
          {soError ? <Text style={[s.errorText, { color: colors.error }]}>{soError}</Text> : null}
        </View>

        <TouchableOpacity style={[s.primaryBtn, { backgroundColor: colors.primary }]} onPress={handleEnterSO}>
          <Text style={s.primaryBtnText}>Enter</Text>
        </TouchableOpacity>
      </ScrollView>
      <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="PackOrder" />
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
    stepContainer: { flexGrow: 1, padding: 24, alignItems: 'stretch' },
    stepTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    stepSub: { fontSize: 14, textAlign: 'center', marginBottom: 32, lineHeight: 20 },
    orderInfoCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, marginBottom: 20 },
    orderInfoText: { fontSize: 13, flex: 1 },
    fieldGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
    input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, borderWidth: 1 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingRight: 6 },
    inputFlex: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
    scanBtn: { padding: 6 },
    errorText: { fontSize: 12, marginTop: 4 },
    primaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 8, marginBottom: 12 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    secondaryBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
    secondaryBtnText: { fontSize: 15, fontWeight: '600' },
    resultCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 24 },
    resultLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
    resultValue: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    successBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
    successBannerText: { fontSize: 14, fontWeight: '600' },
    resultSub: { fontSize: 13 },
  });
}
