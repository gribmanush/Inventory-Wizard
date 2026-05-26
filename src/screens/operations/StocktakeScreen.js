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
import { dbGetProductByBarcodeOrName, dbUpdateProductQuantity } from '../../database/database';

export default function StocktakeScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [barcode, setBarcode] = useState('');
  const [productInHand, setProductInHand] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [lastProduct, setLastProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { helpVisible, showHelp, hideHelp } = useHelpModal('Stocktake');

  const handleUpdate = async () => {
    setError('');
    setSuccess(false);
    if (!barcode.trim()) { setError('Enter a product barcode or name.'); return; }
    if (!productInHand.trim() || isNaN(Number(productInHand)) || Number(productInHand) < 0) {
      setError('Enter a valid stock count.'); return;
    }
    setLoading(true);
    try {
      const product = await dbGetProductByBarcodeOrName(barcode.trim(), user.user_id);
      if (!product) { setError(`Product not found for "${barcode}".`); return; }
      await dbUpdateProductQuantity(product.product_id, Number(productInHand), user.user_id);
      setLastProduct({ ...product, newQty: Number(productInHand) });
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBarcode('');
    setProductInHand('');
    setError('');
    setSuccess(false);
    setLastProduct(null);
  };

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Stocktake</Text>
        <TouchableOpacity onPress={showHelp} style={{ width: 40, alignItems: 'flex-end' }}>
          <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={[s.fieldGroup]}>
          <Text style={[s.label, { color: colors.textSecondary }]}>Product Barcode or Name</Text>
          <View style={[s.inputRow, { backgroundColor: colors.inputBg, borderColor: error ? colors.error : colors.border }]}>
            <TextInput
              style={[s.inputFlex, { color: colors.text }]}
              placeholder="Scan or enter barcode / name"
              placeholderTextColor={colors.textSecondary}
              value={barcode}
              onChangeText={v => { setBarcode(v); setError(''); setSuccess(false); }}
            />
            <TouchableOpacity onPress={() => setScannerVisible(true)} style={s.scanBtn}>
              <Ionicons name="barcode-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.fieldGroup}>
          <Text style={[s.label, { color: colors.textSecondary }]}>Product in Hand (Count)</Text>
          <TextInput
            style={[s.input, { backgroundColor: colors.inputBg, borderColor: error ? colors.error : colors.border, color: colors.text }]}
            placeholder="Enter actual stock count"
            placeholderTextColor={colors.textSecondary}
            value={productInHand}
            onChangeText={v => { setProductInHand(v); setError(''); setSuccess(false); }}
            keyboardType="numeric"
          />
        </View>

        {error ? (
          <View style={[s.alertCard, { backgroundColor: colors.error + '12', borderColor: colors.error }]}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={[s.alertText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}

        {success && lastProduct ? (
          <View style={[s.alertCard, { backgroundColor: colors.success + '12', borderColor: colors.success }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[s.alertText, { color: colors.success }]}>
              Successfully Updated product amount!
            </Text>
          </View>
        ) : null}

        {success && lastProduct ? (
          <View style={[s.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[s.resultName, { color: colors.text }]}>{lastProduct.name}</Text>
            {lastProduct.barcode ? <Text style={[s.resultSub, { color: colors.textSecondary }]}>Barcode: {lastProduct.barcode}</Text> : null}
            <View style={s.qtyRow}>
              <View style={s.qtyBox}>
                <Text style={[s.qtyLabel, { color: colors.textSecondary }]}>Previous</Text>
                <Text style={[s.qtyValue, { color: colors.textSecondary }]}>{lastProduct.quantity}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
              <View style={s.qtyBox}>
                <Text style={[s.qtyLabel, { color: colors.textSecondary }]}>Updated</Text>
                <Text style={[s.qtyValue, { color: colors.success }]}>{lastProduct.newQty}</Text>
              </View>
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={[s.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Update Information</Text>}
        </TouchableOpacity>

        {success && (
          <TouchableOpacity style={[s.secondaryBtn, { borderColor: colors.border }]} onPress={handleReset}>
            <Text style={[s.secondaryBtnText, { color: colors.text }]}>Stocktake Another</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BarcodeScannerModal
        visible={scannerVisible}
        onScanned={data => { setBarcode(data); setError(''); setSuccess(false); }}
        onClose={() => setScannerVisible(false)}
      />
      <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="Stocktake" />
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
    headerTitle: { fontSize: 18, fontWeight: '700' },
    scroll: { padding: 20, paddingBottom: 40 },
    fieldGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
    input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, borderWidth: 1 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingRight: 6 },
    inputFlex: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
    scanBtn: { padding: 6 },
    alertCard: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 12,
    },
    alertText: { fontSize: 13, flex: 1 },
    resultCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 20 },
    resultName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    resultSub: { fontSize: 13, marginBottom: 12 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    qtyBox: { alignItems: 'center', gap: 4 },
    qtyLabel: { fontSize: 12, fontWeight: '500' },
    qtyValue: { fontSize: 24, fontWeight: '700' },
    primaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 12 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    secondaryBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
    secondaryBtnText: { fontSize: 15, fontWeight: '600' },
  });
}
