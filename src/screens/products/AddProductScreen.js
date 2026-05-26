import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { dbCreateProduct } from '../../database/database';
import { containsProfanity } from '../../utils/profanity';
import BarcodeScannerModal from '../../components/BarcodeScannerModal';
import HelpModal from '../../components/HelpModal';
import useHelpModal from '../../hooks/useHelpModal';

// Defined outside component so React never remounts it on re-render
function ProductField({ label, hint, keyboard, value, onChangeText, error, colors, onScan }) {
  const s = fieldStyles;
  return (
    <View style={s.fieldGroup}>
      <Text style={[s.label, { color: colors.textSecondary }]}>{label}</Text>
      {onScan ? (
        <View style={[s.inputRow, { backgroundColor: colors.inputBg, borderColor: error ? colors.error : colors.border }]}>
          <TextInput
            style={[s.inputFlex, { color: colors.text }]}
            placeholder={hint || label}
            placeholderTextColor={colors.textSecondary}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboard || 'default'}
          />
          <TouchableOpacity onPress={onScan} style={s.scanBtn}>
            <Ionicons name="barcode-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={[s.input, {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          }]}
          placeholder={hint || label}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboard || 'default'}
        />
      )}
      {error ? <Text style={[s.errorText, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, borderWidth: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingRight: 6 },
  inputFlex: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  scanBtn: { padding: 6 },
  errorText: { fontSize: 12, marginTop: 4, marginLeft: 2 },
});

export default function AddProductScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const { helpVisible, showHelp, hideHelp } = useHelpModal('AddProduct');
  const [form, setForm] = useState({
    name: '', brand: '', barcode: '', sku: '',
    quantity: '', lowStockThreshold: '',
    costPrice: '', sellingPrice: '', location: '',
  });
  const [imageUri, setImageUri] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const s = useMemo(() => makeStyles(colors), [colors]);

  const showPhotoOptions = () => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Take a Picture', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const set = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setErrors(p => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) {
      e.name = 'Product name is required.';
    } else if (containsProfanity(form.name)) {
      e.name = 'Product name contains inappropriate language.';
    }
    if (form.brand && containsProfanity(form.brand)) {
      e.brand = 'Brand contains inappropriate language.';
    }
    if (form.quantity && isNaN(Number(form.quantity))) {
      e.quantity = 'Quantity must be a number.';
    }
    if (form.costPrice && isNaN(Number(form.costPrice))) {
      e.costPrice = 'Cost price must be a number.';
    }
    if (form.sellingPrice && isNaN(Number(form.sellingPrice))) {
      e.sellingPrice = 'Selling price must be a number.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await dbCreateProduct({
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        barcode: form.barcode.trim() || null,
        sku: form.sku.trim() || null,
        quantity: Number(form.quantity) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 0,
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : null,
        location: form.location.trim() || null,
        imageUri: imageUri,
        userId: user.user_id,
      });
      setSuccess(true);
    } catch {
      Alert.alert('Error', 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setImageUri(null);
    setForm({ name: '', brand: '', barcode: '', sku: '', quantity: '', lowStockThreshold: '', costPrice: '', sellingPrice: '', location: '' });
  };

  if (success) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
        <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.text }]}>Add Product</Text>
          <TouchableOpacity onPress={showHelp} style={{ width: 40, alignItems: 'flex-end' }}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={s.successContainer}>
          <View style={[s.successIcon, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
          </View>
          <Text style={[s.successTitle, { color: colors.text }]}>New Product has been added!</Text>
          <TouchableOpacity style={[s.primaryBtn, { backgroundColor: colors.primary }]} onPress={resetForm}>
            <Text style={s.primaryBtnText}>Add Another</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.secondaryBtn, { borderColor: colors.border }]} onPress={() => navigation.navigate('Products')}>
            <Text style={[s.secondaryBtnText, { color: colors.text }]}>View Products</Text>
          </TouchableOpacity>
        </View>
        <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="AddProduct" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Add Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={[s.photoBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={showPhotoOptions}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={s.photoPreview} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={32} color={colors.textSecondary} />
              <Text style={[s.photoText, { color: colors.textSecondary }]}>Choose photo</Text>
            </>
          )}
        </TouchableOpacity>

        <ProductField label="Product Name *" field="name" value={form.name} onChangeText={v => set('name', v)} error={errors.name} colors={colors} />
        <ProductField label="Product Brand" field="brand" value={form.brand} onChangeText={v => set('brand', v)} error={errors.brand} colors={colors} />
        <ProductField label="Product Barcode" field="barcode" keyboard="numeric" value={form.barcode} onChangeText={v => set('barcode', v)} error={errors.barcode} colors={colors} onScan={() => setScannerVisible(true)} />

        <TouchableOpacity
          style={[s.additionalToggle, { borderColor: colors.border }]}
          onPress={() => setShowAdditional(p => !p)}
        >
          <Text style={[s.additionalToggleText, { color: colors.primary }]}>Additional Information</Text>
          <Ionicons name={showAdditional ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
        </TouchableOpacity>

        {showAdditional && (
          <View style={[s.additionalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ProductField label="SKU" hint="Stock Keeping Unit" value={form.sku} onChangeText={v => set('sku', v)} error={errors.sku} colors={colors} />
            <ProductField label="Quantity" keyboard="numeric" hint="0" value={form.quantity} onChangeText={v => set('quantity', v)} error={errors.quantity} colors={colors} />
            <ProductField label="Low Stock Threshold" keyboard="numeric" hint="Alert when stock falls below this" value={form.lowStockThreshold} onChangeText={v => set('lowStockThreshold', v)} error={errors.lowStockThreshold} colors={colors} />
            <ProductField label="Cost Price ($)" keyboard="decimal-pad" value={form.costPrice} onChangeText={v => set('costPrice', v)} error={errors.costPrice} colors={colors} />
            <ProductField label="Selling Price ($)" keyboard="decimal-pad" value={form.sellingPrice} onChangeText={v => set('sellingPrice', v)} error={errors.sellingPrice} colors={colors} />
            <ProductField label="Storage Location" hint="e.g. Shelf A3" value={form.location} onChangeText={v => set('location', v)} error={errors.location} colors={colors} />
          </View>
        )}

        <TouchableOpacity
          style={[s.primaryBtn, { backgroundColor: colors.primary, marginTop: 24 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Add Product</Text>}
        </TouchableOpacity>
      </ScrollView>

      <BarcodeScannerModal
        visible={scannerVisible}
        onScanned={data => set('barcode', data)}
        onClose={() => setScannerVisible(false)}
      />
      <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="AddProduct" />
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
    scroll: { padding: 16, paddingBottom: 40 },
    photoBox: {
      height: 120, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed',
      alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      overflow: 'hidden',
    },
    photoPreview: { width: '100%', height: '100%', borderRadius: 10 },
    photoText: { fontSize: 13, marginTop: 6 },
    additionalToggle: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingVertical: 12, borderTopWidth: 1, marginTop: 6, marginBottom: 4,
    },
    additionalToggleText: { fontSize: 14, fontWeight: '600' },
    additionalBox: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 4 },
    primaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 12 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    secondaryBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
    secondaryBtnText: { fontSize: 15, fontWeight: '600' },
    successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    successTitle: { fontSize: 20, fontWeight: '700', marginBottom: 32, textAlign: 'center' },
  });
}
