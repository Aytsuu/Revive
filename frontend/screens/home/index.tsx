import {
  SafeAreaView,
  Text,
  Platform,
  StatusBar,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable
} from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useGetProduct } from '../inventory/queries/inventoryFetch';

const categories = ['All', 'Apple', 'Samsung', 'Pixel', 'Xiaomi'];

export default () => {
  const router = useRouter();
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const { data: products, isLoading } = useGetProduct();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: androidPaddingTop }}
      className="bg-white px-6"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between pt-5">
          <Text className="text-3xl text-[#31394d] font-bold font-poppins">
            Choose your phone
          </Text>
          <Feather name="search" size={28} color="black" />
        </View>

        {/* Banner */}
        <View className="mt-4">
          <Image
            source={require('../../assets/images/phone1.jpg')}
            className="w-full h-40 rounded-xl"
            resizeMode="cover"
          />
        </View>

        {/* Category Boxes */}
        <View className="flex-row justify-between mt-6">
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              className="bg-gray-200 px-3 py-2 rounded-xl"
            >
              <Text className="text-sm font-medium text-gray-700">{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Product Grid */}
        <View className="mt-6">
          <FlatList
            data={products}
            keyExtractor={(item) => item.prod_id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/(product)/details',
                    params: {  
                      prod_id: item.prod_id,
                      prod_name: item.prod_name,
                      prod_details: item.prod_details,
                      prod_brand: item.prod_brand,
                      prod_price: item.prod_price,
                      prod_stock: item.prod_stock,
                      prod_image: item.prod_image
                    },
                  })
                }
                className="bg-gray-100 rounded-xl mb-4 w-[48%] overflow-hidden"
              >
                <Image
                  source={{ uri: item.prod_image }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <Text className="p-2 font-medium text-gray-800">
                  {item.prod_name}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
