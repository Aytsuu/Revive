import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productFormSchema } from "@/form-schema/productSchema";
import { supabase } from "@/utils/supabase";
import * as ImageManipulator from 'expo-image-manipulator';
import { useAddProduct } from "./queries/inventoryAdd";
import { useGetProduct } from "./queries/inventoryFetch";
import { useUpdateProduct } from "./queries/inventoryUpdate";
import { useDeleteProduct } from "./rest_api/inventoryDELETE";

type productForm = z.infer<typeof productFormSchema>

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
  const insets = useSafeAreaInsets();
  const { data: fetchedProducts, isLoading } = useGetProduct();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  
  // Sync fetched products with local state
  useEffect(() => {
    if (fetchedProducts) {
      setLocalProducts(fetchedProducts);
    }
  }, [fetchedProducts]);

  const { mutateAsync: addProduct } = useAddProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const {control, trigger, getValues, setValue, reset} = useForm<productForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      prod_name: '',
      prod_details: '',
      prod_brand: '',
      prod_price: '',
      prod_stock: ''
    }
  });

  const [photo, setPhoto] = useState<string | null>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);

  const openAddModal = () => {
    reset(); // Reset form fields
    setPhoto(null);
    setIsEditMode(false);
    setModalVisible(true);
  };

  const openEditModal = (id: string) => {
    const product = localProducts.find((prod) => prod.prod_id === id);
    if (!product) return;

    setValue('prod_name', product.prod_name);
    setValue('prod_details', product.prod_details);
    setValue('prod_brand', product.prod_brand);
    setValue('prod_price', product.prod_price);
    setValue('prod_stock', product.prod_stock);
    setPhoto(product.prod_image || null);
    setEditingPhoto(product.prod_image || null);

    setIsEditMode(true);
    setEditingId(id);
    setModalVisible(true);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0].uri;
      setPhoto(image);
    }
  };

  const getUint8Array = async () => {
    if(!photo) return;

    const compressedImage = await ImageManipulator.manipulateAsync(
        photo,
        [{resize: {width: 1200, height: 1080}}],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true
        }
      )

      if(!compressedImage.base64) {
        throw new Error("Compressed image base64 data is undefined")
      }

      // Convert Base64 to Uint8Array correctly
      const binaryString = atob(compressedImage.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return bytes;
  }

  const storePhoto = async () => {
    const base64 = await getUint8Array();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}.jpg`;
    const filePath = `product/${fileName}`;


    if(!base64) return;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, base64, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error); // Log detailed error
      Alert.alert("Upload failed", error.message);
      return;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    console.log("Upload successful! URL:", publicUrl);
    return publicUrl;
  }

  const submit = async () => {
    const formIsValid = await trigger(['prod_name', 'prod_brand', 'prod_price', 
      'prod_stock', 'prod_details']);

    if (!formIsValid) return;
    if (!photo) {
      Alert.alert('Select a photo.');
      return;
    }

    const values = getValues();
    
    if (isEditMode && editingId) {
      // Optimistic update
      const updatedProduct = {
        ...values,
        prod_id: editingId,
        prod_image: photo,
      };
      
      setLocalProducts(prev => prev.map(p => 
        p.prod_id === editingId ? updatedProduct : p
      ));

      try {
        const imageUrl = photo === editingPhoto ? photo : await storePhoto();
        await updateProduct({
          data: {...values, prod_image: imageUrl},
          prodId: editingId
        });
        
        Alert.alert("Success", "Product updated successfully!");
      } catch (error) {
        // Rollback on error
        setLocalProducts(fetchedProducts || []);
        Alert.alert("Error", "Failed to update product");
      }
    } else {
      // Optimistic add
      const tempId = `temp-${Date.now()}`;
      const newProduct = {
        ...values,
        prod_id: tempId,
        prod_image: photo,
      };
      
      setLocalProducts(prev => [...prev, newProduct]);

      try {
        const imageUrl = await storePhoto();
        const response = await addProduct({
          ...values, 
          prod_image: imageUrl
        });
        
        // Replace temp product with server response
        setLocalProducts(prev => prev.map(p => 
          p.prod_id === tempId ? { ...p, ...response, prod_id: response.prod_id } : p
        ));
        
        Alert.alert("Success", "Product added successfully!");
      } catch (error) {
        // Rollback on error
        setLocalProducts(prev => prev.filter(p => p.prod_id !== tempId));
        Alert.alert("Error", "Failed to add product");
      }
    }
    
    // Reset modal
    reset();
    setPhoto(null);
    setModalVisible(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleRemoveProduct = (id: string) => {
    Alert.alert("Confirm", "Remove this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: async () => {
          // Optimistic removal
          const removedProduct = localProducts.find(p => p.prod_id === id);
          setLocalProducts(prev => prev.filter(p => p.prod_id !== id));
          
          try {
            await deleteProduct(id);
          } catch (error) {
            // Rollback on error
            if (removedProduct) {
              setLocalProducts(prev => [...prev, removedProduct]);
            }
            Alert.alert("Error", "Failed to remove product");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-gray-50 p-4">
        <FlatList
          data={localProducts}
          keyExtractor={(item: Product) => item.prod_id}
          renderItem={({ item }: { item: Product }) => (
            <View className="flex-row items-center justify-between bg-white p-4 mb-2 rounded-lg shadow border border-gray-200">
              {item.prod_image && (
                <Image 
                  source={{ uri: item.prod_image }} 
                  className="w-16 h-16 rounded-md" 
                  resizeMode="cover" 
                />
              )}
              <View className="flex-1 ml-4">
                <Text className="font-bold text-lg">{item.prod_name}</Text>
                <Text className="text-gray-700">
                  ₱{item.prod_price} • Qty: {item.prod_stock}
                </Text>
              </View>
              <View className="flex-row space-x-3">
                <TouchableOpacity onPress={() => openEditModal(item.prod_id)}>
                  <MaterialIcons name="edit" size={24} color="#f59e0b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveProduct(item.prod_id)}>
                  <Entypo name="trash" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-8">
              {isLoading ? "Loading..." : "No products found."}
            </Text>
          }
        />

        <TouchableOpacity
          onPress={openAddModal}
          className="absolute right-8 bg-blue-700 rounded-full p-4 shadow-lg"
          style={{ bottom: 32 + insets.bottom }}
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
              {photo && (
                <Image
                  source={{ uri: photo }}
                  className="w-full h-40 rounded-md mb-4"
                  resizeMode="cover"
                />
              )} 

              {/* Product Name */}
              <Controller 
                control={control}
                name="prod_name"
                render={({ field: {onChange, value}, fieldState: {error}}) => (
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium">Product Name</Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      keyboardType="default"
                      className="border border-gray-300 rounded-md p-2"
                    />
                    {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
                  </View>
                )}
              />

              {/* Details */}
              <Controller 
                control={control}
                name="prod_details"
                render={({ field: {onChange, value}, fieldState: {error}}) => (
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium">Details</Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      keyboardType="default"
                      className="border border-gray-300 rounded-md p-2"
                    />
                    {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
                  </View>
                )}
              />

              {/* Brand */}
              <Controller 
                control={control}
                name="prod_brand"
                render={({ field: {onChange, value}, fieldState: {error}}) => (
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium">Brand</Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      keyboardType="default"
                      className="border border-gray-300 rounded-md p-2"
                    />
                    {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
                  </View>
                )}
              />

              {/* Price */}
              <Controller 
                control={control}
                name="prod_price"
                render={({ field: {onChange, value}, fieldState: {error}}) => (
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium">Price</Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      className="border border-gray-300 rounded-md p-2"
                    />
                    {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
                  </View>
                )}
              />

              {/* Stock */}
              <Controller 
                control={control}
                name="prod_stock"
                render={({ field: {onChange, value}, fieldState: {error}}) => (
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium">Stock</Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      className="border border-gray-300 rounded-md p-2"
                    />
                    {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
                  </View>
                )}
              />

              <View className="flex-row justify-end space-x-4 mt-2">
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setIsEditMode(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-300"
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={submit}
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
