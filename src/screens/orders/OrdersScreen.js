import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { dbGetOrdersByUser, dbGetOrderItems, dbUpdateOrderStatus } from '../../database/database';
import HelpModal from '../../components/HelpModal';
import useHelpModal from '../../hooks/useHelpModal';

const STATUS_COLORS = {
  pending: '#F59E0B',
  completed: '#10B981',
  cancelled: '#EF4444',
};

export default function OrdersScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { helpVisible, showHelp, hideHelp } = useHelpModal('Orders');
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [orderItems, setOrderItems] = useState({});

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      (async () => {
        setOrders(await dbGetOrdersByUser(user.user_id));
      })();
    }, [user])
  );

  const toggleExpand = async (orderId) => {
    if (expanded === orderId) {
      setExpanded(null);
    } else {
      setExpanded(orderId);
      if (!orderItems[orderId]) {
        const items = await dbGetOrderItems(orderId, user.user_id);
        setOrderItems(p => ({ ...p, [orderId]: items }));
      }
    }
  };

  const markComplete = async (orderId) => {
    await dbUpdateOrderStatus(orderId, 'completed', user.user_id);
    setOrders(p => p.map(o => o.order_id === orderId ? { ...o, status: 'completed' } : o));
  };

  const s = makeStyles(colors);

  const renderOrder = ({ item }) => {
    const date = new Date(item.order_date);
    const dateStr = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const isExpanded = expanded === item.order_id;
    const items = orderItems[item.order_id] || [];
    const statusColor = STATUS_COLORS[item.status] || '#6B7280';

    return (
      <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity style={s.cardHeader} onPress={() => toggleExpand(item.order_id)}>
          <View style={s.cardHeaderLeft}>
            <Text style={[s.soNumber, { color: colors.text }]}>SO: {item.so_number || '—'}</Text>
            <Text style={[s.customerName, { color: colors.textSecondary }]}>
              {item.customer_name || 'Unknown'} · {dateStr}
            </Text>
          </View>
          <View style={s.cardHeaderRight}>
            <View style={[s.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[s.statusText, { color: statusColor }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={18} color={colors.textSecondary}
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={[s.expandedBody, { borderTopColor: colors.border }]}>
            {item.shipping_address ? (
              <Text style={[s.detailText, { color: colors.textSecondary }]}>
                Shipping: {item.shipping_address}
              </Text>
            ) : null}
            {item.payment_method ? (
              <Text style={[s.detailText, { color: colors.textSecondary }]}>
                Payment: {item.payment_method} ({item.payment_status})
              </Text>
            ) : null}
            {item.total_amount > 0 && (
              <Text style={[s.detailText, { color: colors.text }]}>
                Total: ${item.total_amount.toFixed(2)}
              </Text>
            )}

            {items.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={[s.itemsLabel, { color: colors.textSecondary }]}>Items</Text>
                {items.map(oi => (
                  <View key={oi.order_item_id} style={[s.itemRow, { borderBottomColor: colors.divider }]}>
                    <Text style={[s.itemName, { color: colors.text }]}>{oi.product_name}</Text>
                    <Text style={[s.itemQty, { color: colors.primary }]}>×{oi.quantity}</Text>
                  </View>
                ))}
              </View>
            )}

            {item.status === 'pending' && (
              <TouchableOpacity
                style={[s.completeBtn, { backgroundColor: colors.success + '18', borderColor: colors.success }]}
                onPress={() => markComplete(item.order_id)}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
                <Text style={[s.completeBtnText, { color: colors.success }]}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>Orders</Text>
        <View style={s.headerRight}>
          <TouchableOpacity onPress={showHelp}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AddOrder')}>
            <Ionicons name="add" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="Orders" />
      <FlatList
        data={orders}
        keyExtractor={item => String(item.order_id)}
        renderItem={renderOrder}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="cart-outline" size={48} color={colors.textSecondary} />
            <Text style={[s.emptyText, { color: colors.textSecondary }]}>No orders yet.</Text>
          </View>
        }
      />
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
    title: { fontSize: 18, fontWeight: '700' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 70, justifyContent: 'flex-end' },
    list: { padding: 12, paddingBottom: 30 },
    card: { borderRadius: 12, marginBottom: 10, borderWidth: 1, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
    cardHeaderLeft: { flex: 1 },
    soNumber: { fontSize: 15, fontWeight: '600' },
    customerName: { fontSize: 12, marginTop: 2 },
    cardHeaderRight: { flexDirection: 'row', alignItems: 'center' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    statusText: { fontSize: 12, fontWeight: '600' },
    expandedBody: { padding: 14, paddingTop: 12, borderTopWidth: 1 },
    detailText: { fontSize: 13, marginBottom: 4 },
    itemsLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1 },
    itemName: { fontSize: 13 },
    itemQty: { fontSize: 13, fontWeight: '600' },
    completeBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, marginTop: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1,
    },
    completeBtnText: { fontSize: 13, fontWeight: '600' },
    empty: { alignItems: 'center', marginTop: 60, gap: 12 },
    emptyText: { fontSize: 14 },
  });
}
