import React, { useRef, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity, Switch,
  StyleSheet, ScrollView, Animated, TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useDrawer } from '../contexts/DrawerContext';

export default function DrawerModal() {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { isOpen, closeDrawer } = useDrawer();
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -300,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const navigate = (screen, params) => {
    closeDrawer();
    setTimeout(() => navigation.navigate(screen, params), 10);
  };

  const handleLogout = () => {
    closeDrawer();
    logout();
  };

  if (!isOpen) return null;

  const s = makeStyles(colors);

  return (
    <Modal transparent animationType="none" visible={isOpen} onRequestClose={closeDrawer}>
      <View style={s.overlay}>
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={s.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[s.drawer, { transform: [{ translateX: slideAnim }], backgroundColor: colors.drawerBg }]}>
          {/* Header */}
          <View style={[s.header, { borderBottomColor: colors.border }]}>
            <View style={[s.avatar, { backgroundColor: colors.primary }]}>
              <Text style={s.avatarText}>
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <Text style={[s.userName, { color: colors.text }]} numberOfLines={1}>
              {user?.full_name || 'User'}
            </Text>
            <Text style={[s.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>
              {user?.email || ''}
            </Text>
          </View>

          <ScrollView>
            {[
              { icon: 'person-outline', label: 'Profile', onPress: () => navigate('Profile') },
              { icon: 'help-circle-outline', label: 'Help', onPress: () => navigate('Help') },
              { icon: 'document-text-outline', label: 'Terms and Conditions', onPress: () => navigate('Terms') },
            ].map(item => (
              <TouchableOpacity
                key={item.label}
                style={[s.menuItem, { borderBottomColor: colors.divider }]}
                onPress={item.onPress}
              >
                <Ionicons name={item.icon} size={22} color={colors.primary} style={s.menuIcon} />
                <Text style={[s.menuLabel, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={[s.menuItem, { borderBottomColor: colors.divider }]}>
              <Ionicons name="moon-outline" size={22} color={colors.primary} style={s.menuIcon} />
              <Text style={[s.menuLabel, { color: colors.text, flex: 1 }]}>Color Theme</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#D1D5DB', true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity style={[s.menuItem, s.logoutItem]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" style={s.menuIcon} />
              <Text style={[s.menuLabel, { color: '#EF4444' }]}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    overlay: { flex: 1, flexDirection: 'row' },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
    drawer: {
      position: 'absolute',
      left: 0, top: 0, bottom: 0,
      width: 290,
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    header: {
      padding: 20,
      paddingTop: 52,
      borderBottomWidth: 1,
      marginBottom: 8,
    },
    avatar: {
      width: 56, height: 56, borderRadius: 28,
      alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    },
    avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
    userName: { fontSize: 17, fontWeight: '600', marginBottom: 2 },
    userEmail: { fontSize: 13 },
    menuItem: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
    },
    menuIcon: { marginRight: 14 },
    menuLabel: { fontSize: 15 },
    logoutItem: { marginTop: 8, borderBottomWidth: 0 },
  });
}
