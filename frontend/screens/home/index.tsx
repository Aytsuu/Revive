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
} from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';

const categories = ['All', 'Phones', 'Cases', 'Chargers', 'Headphones'];

const products = [
  { id: '1', image: require('../../assets/images/phone1.jpg') },
  { id: '2', image: require('../../assets/images/phone2.jpg') },
  { id: '3', image: require('../../assets/images/phone3.jpg') },
  { id: '4', image: require('../../assets/images/phone4.jpg') },
  { id: '5', image: require('../../assets/images/phone5.jpg') },
];

export default () => {
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

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
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="bg-gray-100 rounded-xl mb-4 w-[48%] overflow-hidden">
                <Image
                  source={item.image}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <Text className="p-2 font-medium text-gray-800">
                  Product {item.id}
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
