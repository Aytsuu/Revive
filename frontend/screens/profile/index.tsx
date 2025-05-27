import { Image, Platform, SafeAreaView, View, Text, StatusBar } from 'react-native';

export default function Profile() {
  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: androidPaddingTop }}
      className="bg-white px-6"
    >
      <View>
        <Text>
          PROFILE
        </Text>
      </View>
    </SafeAreaView>
  );
}
