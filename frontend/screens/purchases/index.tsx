import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons"; // Make sure expo/vector-icons is installed

type Order = {
  id: string;
  name: string;
  image: any;
  quantity: number;
  color: string;
  price: number;
  status: "pending" | "toBeReceived" | "completed";
};

const tabs = [
  { title: "Pending", key: "pending" },
  { title: "To Be Received", key: "toBeReceived" },
  { title: "Completed", key: "completed" },
];

const orders: Order[] = [
  {
    id: "1",
    name: "Phone 1",
    image: require("../../assets/images/phone1.jpg"),
    quantity: 1,
    color: "Red",
    price: 59900,
    status: "pending",
  },
  {
    id: "2",
    name: "Phone 2",
    image: require("../../assets/images/phone2.jpg"),
    quantity: 2,
    color: "Blue",
    price: 43000,
    status: "toBeReceived",
  },
  {
    id: "3",
    name: "Phone 3",
    image: require("../../assets/images/phone2.jpg"),
    quantity: 1,
    color: "Black",
    price: 32000,
    status: "completed",
  },
];

export default function Purchases() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"pending" | "toBeReceived" | "completed">("pending");
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  const openRatingModal = (order: Order) => {
  setSelectedOrder(order);
  setSelectedRating(0);
  setFeedback(""); // Clear feedback
  setRatingModalVisible(true);
  };

  const handleAction = (status: string, name: string, order: Order) => {
    let message = "";
    if (status === "pending") {
      message = `Cancel ${name}?`;
    } else if (status === "toBeReceived") {
      message = `Mark ${name} as received?`;
    } else if (status === "completed") {
      openRatingModal(order);
      return;
    }

    Alert.alert("Confirmation", message, [
      { text: "Cancel", style: "cancel" },
      { text: "OK" },
    ]);
  };

  const handleRatingSubmit = () => {
    if (selectedOrder) {
      console.log("Rating:", selectedRating);
      console.log("Feedback:", feedback); // optional feedback
    }
    setRatingModalVisible(false);
    setFeedback("");
  };

  const renderContent = () => {
    const filteredOrders = orders.filter((order) => order.status === activeTab);

    return filteredOrders.map((order) => (
      <View
        key={order.id}
        className="bg-white mb-4 rounded-xl p-4 shadow-sm border border-gray-200"
      >
        <View className="flex-row justify-between">
          <View className="flex-row">
            <Image source={order.image} className="w-20 h-20 rounded-lg mr-4" />
            <View>
              <Text className="text-base font-semibold">{order.name}</Text>
              <Text className="text-gray-400 text-sm mt-1">{order.color}</Text>
            </View>
          </View>

          <View className="absolute right-4 top-4">
            <Text className="text-xs text-[#31394d] font-bold uppercase">
              {order.status}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-sm font-medium">
            Total {order.quantity} item{order.quantity > 1 ? "s" : ""}: ₱
            {order.price}
          </Text>

          <TouchableOpacity
            onPress={() => handleAction(order.status, order.name, order)}
            className="bg-[#31394d] px-4 py-1 rounded-full"
          >
            <Text className="text-white text-sm">
              {order.status === "pending"
                ? "Cancel"
                : order.status === "toBeReceived"
                  ? "Mark as Received"
                  : "Rate"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View className="flex-1 bg-white">
      <View
        className="bg-white z-10 shadow-sm px-4"
        style={{ paddingTop: insets.top }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
          className="mb-2"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg mx-1 ${isActive ? "bg-[#31394d]" : "bg-gray-100"
                  }`}
              >
                <Text
                  className={`font-semibold text-sm ${isActive ? "text-white" : "text-gray-800"
                    }`}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 80 }}
      >
        {renderContent()}
      </ScrollView>

      <Modal visible={ratingModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50 px-8">
          <View className="bg-white rounded-xl p-6 w-full max-w-md">
            <Text className="text-lg font-semibold mb-4 text-center">Rate Order</Text>

            {/* Star Rating */}
            <View className="flex-row justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setSelectedRating(star)}>
                  <Entypo
                    name="star"
                    size={32}
                    color={selectedRating >= star ? "#facc15" : "#e5e7eb"}
                  />
                </Pressable>
              ))}
            </View>

            {/* Feedback Input */}
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-sm mb-4"
              placeholder="Optional feedback..."
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={3}
            />

            {/* Buttons */}
            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 px-4 py-2 rounded-lg mr-2"
                onPress={() => setRatingModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#31394d] px-4 py-2 rounded-lg"
                onPress={handleRatingSubmit}
              >
                <Text className="text-white font-semibold">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
