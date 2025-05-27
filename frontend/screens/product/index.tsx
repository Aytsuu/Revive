import { useLocalSearchParams } from 'expo-router';
import {
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  ScrollView,
} from 'react-native';
import { products } from '../home';

export default function ProductDetail() {
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const product = products.find(p => p.id === productId);

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
          <Text className="text-2xl font-bold text-[#162c39]">₱9,999.00</Text>
          <Text className="text-lg font-semibold text-gray-800 mt-2">Phone Name</Text>
          <Text className="text-base text-gray-600 mt-2">
            This is a high-quality smartphone with a stunning display, excellent battery life,
            and powerful performance — perfect for gaming, photography, and productivity.
          </Text>
        </View>

        {/* Product Rating */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-[#162c39] mb-1">Rating</Text>
          <View className="flex-row items-center space-x-2">
            <Text className="text-yellow-500 text-xl">★★★★☆</Text>
            <Text className="text-gray-700">(4.5 / 5)</Text>
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
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 pb-6 bg-white border-t border-gray-200 flex-row justify-between">
        <TouchableOpacity className="flex-1 mr-2 bg-yellow-400 py-3 rounded-xl items-center">
          <Text className="text-white font-semibold">Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 ml-2 bg-[#162c39] py-3 rounded-xl items-center">
          <Text className="text-white font-semibold">Buy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
