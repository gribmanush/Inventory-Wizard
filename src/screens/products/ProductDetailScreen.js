import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import HelpModal from '../../components/HelpModal';
import useHelpModal from '../../hooks/useHelpModal';

export default function ProductDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { helpVisible, showHelp, hideHelp } = useHelpModal('ProductDetail');
  const product = route.params?.product;

  if (!product) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLow = product.low_stock_threshold > 0 && product.quantity <= product.low_stock_threshold;

  const rows = [
    { label: 'Brand', value: product.brand || '—', icon: 'pricetag-outline' },
    { label: 'Barcode', value: product.barcode || '—', icon: 'barcode-outline' },
    { label: 'SKU', value: product.sku || '—', icon: 'bookmark-outline' },
    { label: 'Location', value: product.location || '—', icon: 'location-outline' },
    { label: 'Cost Price', value: product.cost_price != null ? `$${Number(product.cost_price).toFixed(2)}` : '—', icon: 'cash-outline' },
    { label: 'Selling Price', value: product.selling_price != null ? `$${Number(product.selling_price).toFixed(2)}` : '—', icon: 'storefront-outline' },
    { label: 'Low Stock Threshold', value: product.low_stock_threshold > 0 ? String(product.low_stock_threshold) : '—', icon: 'warning-outline' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <TouchableOpacity onPress={showHelp} style={{ width: 40, alignItems: 'flex-end' }}>
          <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Product image */}
        {product.image_uri ? (
          <Image source={{ uri: product.image_uri }} style={styles.productImage} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="cube-outline" size={64} color={colors.primary} />
          </View>
        )}

        {/* Name + stock */}
        <View style={styles.nameRow}>
          <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
          <View style={[styles.stockBadge, { backgroundColor: isLow ? colors.error + '18' : colors.success + '18' }]}>
            <Text style={[styles.stockQty, { color: isLow ? colors.error : colors.success }]}>
              {product.quantity}
            </Text>
            <Text style={[styles.stockLabel, { color: isLow ? colors.error : colors.success }]}>in stock</Text>
          </View>
        </View>

        {/* Low stock warning */}
        {isLow && (
          <View style={[styles.alertBanner, { backgroundColor: colors.error + '12', borderColor: colors.error }]}>
            <Ionicons name="warning-outline" size={16} color={colors.error} />
            <Text style={[styles.alertText, { color: colors.error }]}>
              Stock is below threshold — restock soon
            </Text>
          </View>
        )}

        {/* Info rows */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {rows.map((row, i) => (
            <View
              key={row.label}
              style={[
                styles.infoRow,
                { borderBottomColor: colors.border },
                i === rows.length - 1 && styles.infoRowLast,
              ]}
            >
              <View style={styles.infoLeft}>
                <Ionicons name={row.icon} size={16} color={colors.textSecondary} style={styles.rowIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{row.label}</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>{row.value}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
      <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="ProductDetail" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  scroll: { padding: 16, paddingBottom: 40 },
  productImage: {
    width: '100%', height: 220, borderRadius: 16, marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%', height: 220, borderRadius: 16, marginBottom: 20,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  nameRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12,
  },
  productName: { fontSize: 22, fontWeight: '700', flex: 1, marginRight: 12 },
  stockBadge: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
  },
  stockQty: { fontSize: 24, fontWeight: '800', lineHeight: 28 },
  stockLabel: { fontSize: 11, fontWeight: '600' },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 16,
  },
  alertText: { fontSize: 13, fontWeight: '500', flex: 1 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginTop: 4 },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { marginRight: 10 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600', textAlign: 'right', maxWidth: '50%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15 },
});
