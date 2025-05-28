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
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState('Marc Remigoso');
  const [email, setEmail] = useState('marcusremigoso@gmail.com');
  const [phone, setPhone] = useState('0917-123-4567');

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
          <View className="absolute bottom-0 right-0 bg-[#31394d] p-1 rounded-full">
            <Text className="text-white text-xs">Edit</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="mt-8 space-y-4">
        <View>
          <Text className="text-gray-500 text-sm">Name</Text>
          {editMode ? (
            <TextInput
              value={name}
              onChangeText={setName}
              className="border-b border-gray-300 text-lg font-semibold py-1"
            />
          ) : (
            <Text className="text-lg font-semibold">{name}</Text>
          )}
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Email</Text>
          {editMode ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="border-b border-gray-300 text-lg font-semibold py-1"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text className="text-lg font-semibold">{email}</Text>
          )}
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Phone#</Text>
          {editMode ? (
            <TextInput
              value={phone}
              onChangeText={setPhone}
              className="border-b border-gray-300 text-lg font-semibold py-1"
              keyboardType="phone-pad"
            />
          ) : (
            <Text className="text-lg font-semibold">{phone}</Text>
          )}
        </View>
      </View>

      <View className="mt-10 space-y-4">
        {!editMode && (
          <TouchableOpacity className="bg-gray-200 py-3 rounded-xl items-center">
            <Text className="text-gray-800 font-semibold text-base">My Purchases</Text>
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
      </View>
    </SafeAreaView>
  );
}
