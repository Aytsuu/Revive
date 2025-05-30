import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

type Cart = {
  cart_id: string;
  cart_quantity: string;
  prod_id: string;
  prod_name: string;
  prod_price: string;
  prod_image: string;
  acc: string
};

type TransactionDetails = {
  transactionId: string;
  date: string;
  items: Cart[];
  totalPrice: number;
};

export default function CheckoutDetails() {
  const { transactionDetails } = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [modalVisible, setModalVisible] = useState(false);

  let parsedDetails: TransactionDetails | null = null;

  if (transactionDetails && typeof transactionDetails === 'string') {
    try {
      parsedDetails = JSON.parse(decodeURIComponent(transactionDetails));
    } catch (error) {
      console.error('Failed to parse transaction details:', error);
    }
  }

  if (!parsedDetails) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Invalid or missing transaction data.</Text>
      </View>
    );
  }

  const { transactionId, date, items, totalPrice } = parsedDetails;

  const paymentOptions = [
    { label: 'Cash on Delivery', value: 'Cash on Delivery' },
    { label: 'RevivePay', value: 'RevivePay' },
    { label: 'Credit Card', value: 'Credit Card' },
  ];

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-lg font-semibold mb-2">Transaction ID: {transactionId}</Text>
      <Text className="text-gray-600 mb-4">Date: {new Date(date).toLocaleString()}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.prod_id}
        renderItem={({ item }) => (
          <View 
            key={item.prod_id}
            className="flex-row items-center justify-between bg-gray-100 rounded-lg p-3 mb-3"
          >

            {/* Left side: Image */}
            <Image
              source={{ uri: item.prod_image }}
              style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
              resizeMode="contain"
            />

            {/* Middle: Name, quantity, color */}
            <View className="flex-1">
              <Text className="font-medium text-lg">{item.prod_name}</Text>
              <Text className="text-sm text-gray-600">Quantity: {item.cart_quantity}</Text>
              <Text className="text-sm text-gray-600">Color: Black</Text>
            </View>

            {/* Right side: Price */}
            <Text className="text-base font-semibold">₱{+item.prod_price * +item.cart_quantity}</Text>
          </View>
        )}
      />

      {/* Payment Method selector */}
      <View className="mt-6">
        <Text className="text-lg font-semibold mb-2">Payment Method:</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="border border-gray-400 rounded-md px-4 py-3"
        >
          <Text className="text-gray-800 font-medium">{paymentMethod}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
          <View className="bg-white rounded-lg w-11/12 max-w-sm p-6">
            <Text className="text-xl font-semibold mb-4">Select Payment Method</Text>
            {paymentOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  setPaymentMethod(option.value);
                  setModalVisible(false);
                }}
                className={`p-3 rounded-md mb-2 ${
                  paymentMethod === option.value ? 'bg-[#31394d]' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    paymentMethod === option.value ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 bg-gray-300 rounded-md py-2"
            >
              <Text className="text-center font-semibold text-gray-700">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom bar with total price and Place Order */}
      <View className="flex-row justify-between items-center mt-8">
        <Text className="text-xl font-semibold">Total: ₱{totalPrice.toFixed(2)}</Text>

        <TouchableOpacity
          className="bg-[#31394d] px-6 py-3 rounded-md"
          onPress={() => alert(`Order Placed! Payment method: ${paymentMethod}`)}
        >
          <Text className="text-white font-semibold">Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
