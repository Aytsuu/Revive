import { useLocalSearchParams } from 'expo-router';
import { Image, Platform, SafeAreaView, View, Text, StatusBar } from 'react-native';
import { products } from '../home';

export default function ProductDetail() {
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const product = products.find(p => p.id === productId);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: androidPaddingTop }}
      className="bg-white px-6"
    >
      <View className='justify-center items-center'>
        <Text className='mt-10'>Product ID: {id}</Text>
        <Image
          source={product!.image}
          className="w-64 h-96"
          resizeMode="cover"
        />

      </View>
    </SafeAreaView>
  );
}
