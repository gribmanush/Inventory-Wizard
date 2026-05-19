import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { DrawerProvider } from '../contexts/DrawerContext';
import DrawerModal from './DrawerModal';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import AddProductScreen from '../screens/products/AddProductScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import AddOrderScreen from '../screens/orders/AddOrderScreen';
import PackOrderScreen from '../screens/operations/PackOrderScreen';
import StockLookupScreen from '../screens/operations/StockLookupScreen';
import StocktakeScreen from '../screens/operations/StocktakeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HelpScreen from '../screens/misc/HelpScreen';
import TermsScreen from '../screens/misc/TermsScreen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <DrawerProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="AddOrder" component={AddOrderScreen} />
        <Stack.Screen name="PackOrder" component={PackOrderScreen} />
        <Stack.Screen name="StockLookup" component={StockLookupScreen} />
        <Stack.Screen name="Stocktake" component={StocktakeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
      <DrawerModal />
    </DrawerProvider>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();
  return user ? <MainStack /> : <AuthStack />;
}
