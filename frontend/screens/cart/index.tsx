import React, { useState } from 'react';
import {
  Image,
  Platform,
  View,
  Text,
  StatusBar,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGetCarList } from './queries/cartFetch';
import { useSelector } from 'react-redux';
import { selectAccount } from '@/redux/accountSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Cart = {
  cart_id: string;
  cart_quantity: string;
  prod_id: string;
  prod_name: string;
  prod_price: string;
  prod_image: string;
  acc: string
};

export default function Cart() {
  const insets = useSafeAreaInsets();
  const account = useSelector(selectAccount)
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const { data: cartList, isLoading } = useGetCarList(account.id);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const removeSelectedItems = () => {
    if (selectedItems.size === 0) {
      Alert.alert('No items selected', 'Please select items to remove.');
      return;
    }

    Alert.alert(
      'Remove Items',
      'Are you sure you want to remove the selected items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            
            setSelectedItems(new Set());
          },
        },
      ],
      { cancelable: true }
    );
  };

  const confirmCheckoutSelected = () => {
  if (selectedItems.size === 0) {
    Alert.alert('No items selected', 'Please select items to checkout.');
    return;
  }

  const selectedCartItems = cartList.filter((item: any) => selectedItems.has(item.id));
  const totalPrice = selectedCartItems.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );

  const transactionDetails = {
    items: selectedCartItems,
    transactionId: `TXN-${Date.now()}`, // ✅ unique and easy to debug
    date: new Date().toISOString(),     // ✅ ISO string (safe to transmit as text)
    totalPrice,
  };

  router.push({
    pathname: '/(product)/checkoutDetails',
    params: {
      transactionDetails: encodeURIComponent(JSON.stringify(transactionDetails)), // ✅ safely encode
    },
  });
};

  const adjustQuantity = (id: string, delta: number) => {
    
  };

  const renderItem: ListRenderItem<Cart> = ({ item }) => {
    const isSelected = selectedItems.has(item.cart_id);

    return (
      <View className="mb-4 p-3 border-[1px] border-gray-300 rounded-lg relative">
        <View className="flex-row justify-between">
          <View className="flex-row items-center space-x-4 flex-1">
            <TouchableOpacity
              onPress={() => toggleSelectItem(item.cart_id)}
              className={`w-6 h-6 border-2 rounded-md justify-center items-center ${isSelected ? 'bg-[#31394d] border-[#31394d]' : 'border-gray-400'
                }`}
            >
              {isSelected && <Text className="text-white font-bold">✓</Text>}
            </TouchableOpacity>

            <Image
              source={{ uri: item.prod_image }}
              style={{ width: 80, height: 80, borderRadius: 8 }}
            />

            <View>
              <Text className="text-lg font-semibold">{item.prod_name}</Text>
              <Text className="text-gray-600">Variant: Black</Text>
              <Text className="text-gray-800 font-medium">₱{item.prod_price}</Text>
            </View>
          </View>

          {/* Quantity controls */}
          <View className="flex-row justify-end items-center top-7 space-x-3">
            <TouchableOpacity
              className="w-7 h-7 bg-gray-200 rounded-full justify-center items-center"
              onPress={() => adjustQuantity(item.cart_id, -1)}
            >
              <Text className="text-lg font-bold">−</Text>
            </TouchableOpacity>
            <Text className="font-semibold">{item.cart_quantity}</Text>
            <TouchableOpacity
              className="w-7 h-7 bg-gray-200 rounded-full justify-center items-center"
              onPress={() => adjustQuantity(item.prod_id, 1)}
            >
              <Text className="text-lg font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if(isLoading) return;
  
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: androidPaddingTop ?? 0 }}
      className="bg-white px-6"
    >
      {cartList?.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg">Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartList}
            renderItem={renderItem}
            keyExtractor={item => item.cart_id}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {/* Bottom Buttons */}
          <View className="absolute bottom-4 left-6 right-6 flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-300 py-3 rounded-md items-center"
              onPress={removeSelectedItems}
            >
              <Text className="text-black text-base font-semibold">Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#31394d] py-3 rounded-md items-center"
              onPress={confirmCheckoutSelected}
            >
              <Text className="text-white text-base font-semibold">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
