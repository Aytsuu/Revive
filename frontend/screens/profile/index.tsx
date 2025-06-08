import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { selectAccount } from '@/redux/accountSlice';

export default function Profile() {
  const accountData = useSelector(selectAccount);
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const handleLogout = () => {
    router.replace('/(auth)'); 
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: androidPaddingTop }}
      className="bg-white px-6"
    >
      <View className="items-center mt-6">
        <TouchableOpacity onPress={pickImage} className="relative">
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require('../../assets/images/placeholder-profile.jpg')
            }
            className="w-32 h-32 rounded-full border-4 border-gray-200"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-col justify-between flex-1">
        <View className="mt-8 space-y-4">
          <View>
            <Text className="text-gray-500 text-sm">Name</Text>
            {editMode ? (
              <TextInput
                value={accountData.name}
                onChangeText={() => {}}
                className="border-b border-gray-300 text-lg font-semibold py-1"
              />
            ) : (
              <Text className="text-lg font-semibold">{accountData.name}</Text>
            )}
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Email</Text>
            {editMode ? (
              <TextInput
                value={accountData.email}
                onChangeText={() => {}}
                className="border-b border-gray-300 text-lg font-semibold py-1"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text className="text-lg font-semibold">{accountData.email}</Text>
            )}
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Phone (#)</Text>
            {editMode ? (
              <TextInput
                value={accountData.phone}
                onChangeText={() => {}}
                className="border-b border-gray-300 text-lg font-semibold py-1"
                keyboardType="phone-pad"
              />
            ) : (
              <Text className="text-lg font-semibold">{accountData.phone}</Text>
            )}
          </View>
        </View>

        <View className="mb-8 space-y-4">
          {!editMode && (
            <TouchableOpacity
              onPress={() => router.push('/(product)/purchases')}
              className="bg-gray-200 py-3 rounded-xl items-center"
            >
              <Text className="text-gray-800 font-semibold text-base">
                My Purchases
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={toggleEdit}
            className="bg-[#31394d] py-3 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>

          {/* 🔴 Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-100 py-3 rounded-xl items-center"
          >
            <Text className="text-red-600 font-semibold text-base">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
