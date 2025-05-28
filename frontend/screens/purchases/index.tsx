import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  "Pending",
  "To Be Received",
  "Completed",
  "Return/Refund",
  "Cancelled",
];

export default function Purchases() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      {/* Sticky Header */}
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
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              className="bg-gray-100 px-4 py-2 rounded-lg mr-3"
            >
              <Text className="text-gray-800 font-semibold text-sm">
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 80 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            className="bg-blue-100 mb-4 rounded-xl p-6"
          >
            <Text className="text-base">Order #{i + 1}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
