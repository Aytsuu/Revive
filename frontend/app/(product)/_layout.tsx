import { Stack } from 'expo-router';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or any icon lib you prefer
import { useRouter } from 'expo-router';

export default function ProductLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="details"
        options={{
          title: "Product Details",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/cart')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="cart-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="purchases"
        options={{
          title: 'My Purchases',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/cart')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="cart-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="checkoutDetails"
        options={{
          title: 'Checkout',
        }}
      />

    </Stack>
  );
}
