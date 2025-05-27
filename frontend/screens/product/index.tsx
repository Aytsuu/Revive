import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { products } from '../home';

const { height } = Dimensions.get('window');

export default function ProductDetail() {
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const product = products.find(p => p.id === productId);


  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [modalAction, setModalAction] = useState<'addToCart' | 'buy' | null>(null);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-6">
        <View className="justify-center items-center">
          <Image
            source={product!.image}
            className="w-64 h-96 mt-4"
            resizeMode="cover"
          />
        </View>

        {/* Description Section */}
        <View className="mt-6">
          <View className='flex-row items-center justify-between'>
            <Text className="text-2xl font-bold text-[#162c39]">₱9,999.00</Text>
            <Text className="text-base font-bold text-[#162c39]">2 Sold</Text>
          </View>
          <Text className="text-lg font-semibold text-gray-800 mt-2">Phone Name</Text>
          <Text className="text-base text-gray-600 mt-2">
            This is a high-quality smartphone with a stunning display, excellent battery life,
            and powerful performance — perfect for gaming, photography, and productivity.
          </Text>
        </View>

        {/* Product Rating */}
        <View className="mt-6">
          <View className="flex-row items-center space-x-2">
            <View className='flex-row items-center'>
              <Text className="text-yellow-500 text-xl">★★★★☆</Text>
              <Text className="text-gray-700">(4.5 / 5)</Text>
            </View>
            <View className='flex-row'>
              <Text className="text-base font-semibold text-[#162c39]">Product Ratings</Text>
              <Text className="text-base font-semibold text-[#162c39]">(2)</Text>
            </View>
          </View>
        </View>

        {/* Feedback Section */}
        <View className="mt-10">
          <Text className="text-xl font-semibold text-[#162c39] mb-2">Customer Feedback</Text>
          <View className="bg-gray-100 p-4 rounded-lg mb-2">
            <Text className="font-semibold">Juan Dela Cruz</Text>
            <Text className="text-gray-700 mt-1">Great phone! Battery lasts long and very smooth.</Text>
          </View>
          <View className="bg-gray-100 p-4 rounded-lg mb-2">
            <Text className="font-semibold">Maria Santos</Text>
            <Text className="text-gray-700 mt-1">Camera quality is top notch. Super worth it.</Text>
          </View>
        </View>
      </ScrollView>

{/* Sticky Buttons at the Bottom */}
{!showModal && (
        <View className="absolute bottom-0 left-0 right-0 px-6 py-4 pb-6 bg-white border-t border-gray-200 flex-row justify-between">
          <TouchableOpacity
            className="flex-1 mr-2 bg-yellow-400 py-3 rounded-xl items-center"
            onPress={() => {
              setModalAction('addToCart');
              setShowModal(true);
            }}
          >
            <Text className="text-white font-semibold">Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 ml-2 bg-[#162c39] py-3 rounded-xl items-center"
            onPress={() => {
              setModalAction('buy');
              setShowModal(true);
            }}
          >
            <Text className="text-white font-semibold">Buy</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Sheet Modal */}
      {showModal && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 10,
            height: height * 0.4,
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            className="absolute right-5 top-3 z-10"
          >
            <Text className="text-xl text-gray-400">✕</Text>
          </TouchableOpacity>

          {/* Color Options */}
          <Text className="text-lg font-semibold mb-2">Choose Color:</Text>
          <View className="flex-row space-x-3 mb-4">
            {['Black', 'White', 'Blue'].map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-full ${
                  selectedColor === color ? 'bg-[#162c39]' : 'bg-gray-200'
                }`}
              >
                <Text className={`font-semibold ${selectedColor === color ? 'text-white' : 'text-black'}`}>
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity Selector */}
          <Text className="text-lg font-semibold mb-2">Quantity:</Text>
          <View className="flex-row items-center justify-start space-x-6 mb-4">
            <TouchableOpacity
              onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="bg-gray-300 w-10 h-10 rounded-full items-center justify-center"
            >
              <Text className="text-xl">−</Text>
            </TouchableOpacity>
            <Text className="text-lg">{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(prev => prev + 1)}
              className="bg-gray-300 w-10 h-10 rounded-full items-center justify-center"
            >
              <Text className="text-xl">+</Text>
            </TouchableOpacity>
          </View>

          {/* Final Action Button */}
          <View>
            {modalAction === 'addToCart' && (
              <TouchableOpacity
                className="bg-yellow-400 py-3 rounded-xl items-center"
                onPress={() => {
                  setShowModal(false);
                  // Add to Cart logic here
                }}
              >
                <Text className="text-white font-semibold">Add to Cart</Text>
              </TouchableOpacity>
            )}
            {modalAction === 'buy' && (
              <TouchableOpacity
                className="bg-[#162c39] py-3 rounded-xl items-center"
                onPress={() => {
                  setShowModal(false);
                  // Buy logic here
                }}
              >
                <Text className="text-white font-semibold">Buy</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}
