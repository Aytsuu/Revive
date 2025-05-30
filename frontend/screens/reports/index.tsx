import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StatusBar,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';

type CartItem = {
  id: string;
  name: string;
  image: any;
  quantity: number;
  price: number;
  color: string;
};

type TransactionDetails = {
  transactionId: string;
  date: string; // completion date
  customer: string;
  items: CartItem[];
  totalPrice: number;
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

// For demo, add some fake transactions:
const completedTransactions: TransactionDetails[] = [
  {
    transactionId: 'TXN001',
    date: '2025-05-25T14:30:00Z',
    customer: 'Juan Dela Cruz',
    items: [initialCart[0]],
    totalPrice: initialCart[0].price * initialCart[0].quantity,
  },
  {
    transactionId: 'TXN002',
    date: '2025-05-26T10:15:00Z',
    customer: 'Maria Clara',
    items: [initialCart[1]],
    totalPrice: initialCart[1].price * initialCart[1].quantity,
  },
];

export default function Reports() {
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails | null>(null);

  function openModal(transaction: TransactionDetails) {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setSelectedTransaction(null);
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: androidPaddingTop }}>
      <View className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold mb-4">Completed Orders</Text>

        <FlatList
          data={completedTransactions}
          keyExtractor={(item) => item.transactionId}
          renderItem={({ item }) => {
            const firstItem = item.items[0];
            return (
              <TouchableOpacity
                onPress={() => openModal(item)}
                activeOpacity={0.7}
                className="flex-row bg-gray-100 rounded-lg p-2 mb-3 relative"
                style={{ minHeight: 70 }}
              >
                {/* Left side: Image */}
                <Image
                  source={firstItem.image}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                  resizeMode="contain"
                />

                {/* Right side: Info */}
                <View className="flex-1 ml-3 justify-center">
                  {/* Completed badge top right */}
                  <View className="absolute top-2 right-2 bg-green-600 px-2 py-0.5 rounded-full z-10">
                    <Text className="text-white text-xs font-semibold">Completed</Text>
                  </View>

                  <Text className="text-lg font-semibold">{firstItem.name}</Text>

                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-xs text-gray-700 mt-0.5">
                        Quantity: {firstItem.quantity}
                      </Text>
                      <Text className="text-xs text-gray-700">Color: {firstItem.color}</Text>
                    </View>
                    <Text className="text-sm font-semibold mt-1 mr-3">
                      ₱{(firstItem.price * firstItem.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Modal for order details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.70)', // <-- This gives a black with 25% opacity
              paddingHorizontal: 20,
            }}
          >
            <View className="bg-white rounded-lg p-5 w-full max-w-md max-h-[80%]">
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-xl font-bold mb-2">Order Details</Text>

                {selectedTransaction && (
                  <>
                    <Text className="mb-1 text-gray-600">
                      Transaction ID: {selectedTransaction.transactionId}
                    </Text>
                    <Text className="mb-2 text-gray-600">
                      Completed Date: {new Date(selectedTransaction.date).toLocaleString()}
                    </Text>
                    <Text className="mb-2 text-gray-600">
                      Customer: {selectedTransaction.customer}
                    </Text>

                    {selectedTransaction.items.map((item) => (
                      <View
                        key={item.id}
                        className="flex-row items-center bg-gray-100 rounded-lg p-2 mb-3"
                      >
                        <Image
                          source={item.image}
                          style={{ width: 50, height: 50, borderRadius: 8 }}
                          resizeMode="contain"
                        />
                        <View className="ml-3 flex-1">
                          <Text className="font-semibold text-lg">{item.name}</Text>
                          <Text className="text-xs text-gray-700">
                            Quantity: {item.quantity} | Color: {item.color}
                          </Text>
                        </View>
                        <Text className="font-semibold">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    ))}

                    <Text className="text-lg font-bold mt-3">
                      Total: ₱{selectedTransaction.totalPrice.toFixed(2)}
                    </Text>
                  </>
                )}
              </ScrollView>

              <Pressable
                onPress={closeModal}
                className="mt-4 bg-[#31394d] rounded-md py-3"
                android_ripple={{ color: '#555' }}
              >
                <Text className="text-center text-white font-semibold">Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
