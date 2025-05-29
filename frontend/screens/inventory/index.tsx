import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";

type Product = {
  id: string;
  name: string;
  image: any;
  quantity: number;
  color: string;
  price: number;
  brand: string;
};

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Phone 1",
      image: require("../../assets/images/phone1.jpg"),
      quantity: 1,
      color: "Red",
      price: 599,
      brand: "Apple",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openAddModal = () => {
    setForm({});
    setIsEditMode(false);
    setEditingId(null);
    setModalVisible(true);
  };

  const openEditModal = (product: Product) => {
    setForm(product);
    setIsEditMode(true);
    setEditingId(product.id);
    setModalVisible(true);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setForm((prev) => ({ ...prev, image: { uri: selectedImage.uri } }));
    }
  };

  const handleSaveProduct = () => {
    if (!form.name || !form.brand || !form.price || !form.image) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    if (isEditMode && editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } as Product : p))
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: form.name!,
        brand: form.brand!,
        price: form.price!,
        quantity: form.quantity ?? 1,
        color: form.color ?? "Black",
        image: form.image!,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setModalVisible(false);
    setForm({});
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleRemoveProduct = (id: string) => {
    Alert.alert("Confirm", "Remove this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        },
        style: "destructive",
      },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View className="flex-row items-center justify-between bg-white p-4 mb-2 rounded-lg shadow border border-gray-200">
      <View className="flex-row items-center space-x-4">
        <Image source={item.image} className="w-16 h-16 rounded-md" resizeMode="cover" />
        <View>
          <Text className="font-bold text-lg">{item.name}</Text>
          <Text className="text-gray-500">{item.brand} • {item.color}</Text>
          <Text className="text-gray-700">₱{item.price} • Qty: {item.quantity}</Text>
        </View>
      </View>

      <View className="flex-row space-x-3">
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <MaterialIcons name="edit" size={24} color="#f59e0b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveProduct(item.id)}>
          <Entypo name="trash" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-gray-50 p-4">

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-8">No products found.</Text>
          }
        />

        <TouchableOpacity
          onPress={openAddModal}
          className="absolute bottom-8 right-8 bg-blue-700 rounded-full p-4 shadow-lg"
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>

        {/* Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
              <View className="bg-white w-full max-w-md rounded-lg p-6">
                <Text className="text-xl font-semibold mb-4 text-center">
                  {isEditMode ? "Update Product" : "Add Product"}
                </Text>

                {/* Upload Image Button */}
                <TouchableOpacity
                  onPress={handlePickImage}
                  className="flex-row items-center space-x-2 mb-4"
                >
                  <AntDesign name="camera" size={20} color="#2563eb" />
                  <Text className="text-blue-600 underline">Choose Photo</Text>
                </TouchableOpacity>

                {/* Preview */}
                {form.image && (
                  <Image
                    source={form.image}
                    className="w-full h-40 rounded-md mb-4"
                    resizeMode="cover"
                  />
                )}

                {/* Inputs with labels */}
                {[
                  { key: "name", label: "Product Name", keyboardType: "default" },
                  { key: "brand", label: "Brand", keyboardType: "default" },
                  { key: "color", label: "Color", keyboardType: "default" },
                  { key: "price", label: "Price", keyboardType: "numeric" },
                  { key: "quantity", label: "Quantity", keyboardType: "numeric" },
                ].map(({ key, label, keyboardType }) => (
                  <View key={key} className="mb-4">
                    <Text className="mb-1 text-sm font-medium">{label}</Text>
                    <TextInput
                      value={String(form[key as keyof Product] ?? "")}
                      onChangeText={(text) =>
                        setForm((prev) => ({
                          ...prev,
                          [key]: key === "price" || key === "quantity" ? Number(text) : text,
                        }))
                      }
                      keyboardType={keyboardType as any}
                      className="border border-gray-300 rounded-md p-2"
                    />
                  </View>
                ))}

                <View className="flex-row justify-end space-x-4 mt-2">
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setForm({});
                      setIsEditMode(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2 rounded-md bg-gray-300"
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveProduct}
                    className="px-4 py-2 rounded-md bg-blue-700"
                  >
                    <Text className="text-white font-semibold">
                      {isEditMode ? "Update" : "Add"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
