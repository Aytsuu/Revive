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
  Pressable,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useGetProduct } from '../inventory/queries/inventoryFetch';

const categories = ['All', 'Xiaomi', 'Apple', 'Huawei', 'Samsung'];

type Product = {
  prod_id: string;
  prod_name: string;
  prod_details: string;
  prod_brand: string;
  prod_price: string;
  prod_stock: string;
  prod_image?: string; 
};

export default () => {
  const router = useRouter();
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const { data: products, isLoading } = useGetProduct();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sync fetched products with local state
  useEffect(() => {
    if (products) {
      setLocalProducts(products);
    }
  }, [products]);

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? localProducts 
    : localProducts.filter(product => 
        product.prod_name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        product.prod_details.toLowerCase().includes(selectedCategory.toLowerCase())
      );

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
          <TouchableOpacity>
            <Feather name="search" size={28} color="black" />
          </TouchableOpacity>
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
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-6"
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              className={`px-4 py-2 rounded-xl mr-3 ${
                selectedCategory === cat ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text className={`text-sm font-medium ${
                selectedCategory === cat ? 'text-white' : 'text-gray-700'
              }`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Grid */}
        <View className="mt-6 mb-10">
          {isLoading ? (
            <View className="flex-1 justify-center items-center py-10">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500">No products found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
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
                  <View className="aspect-square">
                    <Image
                      source={{ uri: item.prod_image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="p-2">
                    <Text className="font-medium text-gray-800" numberOfLines={1}>
                      {item.prod_name}
                    </Text>
                    <Text className="font-bold text-blue-600 mt-1">
                      ₱{item.prod_price}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}