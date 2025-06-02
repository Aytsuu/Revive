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
  ActivityIndicator,
  TextInput
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
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (products) {
      setLocalProducts(products);
    }
  }, [products]);

  const filteredProducts = localProducts.filter((product) => {
    const name = product.prod_name.toLowerCase();
    const categoryMatch =
      selectedCategory === 'All' ||
      product.prod_name.split(' ')[0].toLowerCase() === selectedCategory.toLowerCase();

    const searchMatch = name.includes(searchQuery.toLowerCase());

    return isSearching ? searchMatch : categoryMatch;
  });

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: androidPaddingTop }}
      className="bg-white px-6"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between pt-5">
          {isSearching ? (
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 flex-1 mr-2">
              <Feather name="search" size={20} color="gray" />
              <TextInput
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                className="flex-1 ml-2 py-2"
              />
              <TouchableOpacity onPress={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}>
                <Feather name="x" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text className="text-3xl text-[#31394d] font-bold font-poppins">
                Choose your phone
              </Text>
              <TouchableOpacity onPress={() => setIsSearching(true)}>
                <Feather name="search" size={28} color="black" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Banner */}
        <View className="mt-4">
          <Image
            source={require('../../assets/images/phone1.jpg')}
            className="w-full h-40 rounded-xl"
            resizeMode="cover"
          />
        </View>

        {/* Categories (hidden while searching) */}
        {!isSearching && (
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
        )}

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
};
