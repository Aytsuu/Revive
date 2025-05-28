import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Alert,
} from 'react-native';

type CartItem = {
  id: string;
  name: string;
  image: any;
  quantity: number;
  price: number;
  color: string;
};

const initialCart: CartItem[] = [
  {
    id: '1',
    name: 'Phone 1',
    image: require('../../assets/images/phone1.jpg'),
    quantity: 1,
    color: 'Red',
    price: 599,
  },
  {
    id: '2',
    name: 'Phone 2',
    image: require('../../assets/images/phone2.jpg'),
    quantity: 2,
    color: 'Blue',
    price: 749,
  },
];

export default function Cart() {
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  // State to track cart items (make it dynamic to remove items)
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  // State to track selected items by id
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Toggle selection of an item
  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Remove item from cart by id
  const removeItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from the cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCartItems(prev => prev.filter(item => item.id !== id));
            setSelectedItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(id); // also remove from selected if needed
              return newSet;
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Confirm checkout for selected items
  const confirmCheckoutSelected = () => {
    if (selectedItems.size === 0) {
      Alert.alert('No items selected', 'Please select items to checkout.');
      return;
    }

    const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
    const selectedNames = selectedCartItems.map(item => item.name).join(', ');

    // Calculate total price of selected items (price * quantity)
    const totalPrice = selectedCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    Alert.alert(
      'Confirm Checkout',
      `Are you sure you want to checkout: ${selectedNames}?\n\nTotal Price: ₱${totalPrice}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            Alert.alert('Success', 'Checked out: ' + selectedNames);
            setSelectedItems(new Set());
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem: ListRenderItem<CartItem> = ({ item }) => {
    const isSelected = selectedItems.has(item.id);

    return (
      <View className="mb-4 p-3 border-[1px] border-gray-300 rounded-lg relative">
        {/* "X" Remove button at top right */}
        <TouchableOpacity
          onPress={() => removeItem(item.id)}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-gray-300 justify-center items-center"
        >
          <Text className="text-black font-bold">×</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-4 flex-1">
            <TouchableOpacity
              onPress={() => toggleSelectItem(item.id)}
              className={`w-6 h-6 border-2 rounded-md justify-center items-center ${
                isSelected ? 'bg-[#31394d] border-[#31394d]' : 'border-gray-400'
              }`}
            >
              {isSelected && <Text className="text-white font-bold">✓</Text>}
            </TouchableOpacity>

            <Image
              source={item.image}
              style={{ width: 80, height: 80, borderRadius: 8 }}
            />

            <View>
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-gray-600">Variant: {item.color}</Text>
              <Text className="text-gray-600">Quantity: {item.quantity}</Text>
              <Text className="text-gray-800 font-medium">₱{item.price}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: androidPaddingTop ?? 0 }}
      className="bg-white px-6"
    >
      {cartItems.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg">Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
          />

          <TouchableOpacity
            className="absolute bottom-4 left-6 right-6 bg-[#31394d] py-3 rounded-md items-center"
            onPress={confirmCheckoutSelected}
          >
            <Text className="text-white text-lg font-bold">Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}
