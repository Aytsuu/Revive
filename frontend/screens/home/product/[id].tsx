import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams(); // ← grabs the dynamic "id" from the URL

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold">Product Detail</Text>
      <Text className="mt-2 text-gray-700">Product ID: {id}</Text>
    </View>
  );
}
