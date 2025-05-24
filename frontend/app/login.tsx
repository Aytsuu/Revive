import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    router.replace("/(tabs)/explore");
  };

  return (
    <View className="flex-1 pt-28 items-center bg-white">
      <Text className="text-4xl font-bold mb-4 font-poppins">Login</Text>
      <View className="flex flex-row flex-nowrap gap-2">
        <Text className="text-xs font-bold mb-4 font-poppins text-[#6c7278]">Don't have an account?</Text>
        <Text className="text-xs font-bold mb-4 font-poppins text-[#4d81e7]">Sign Up</Text>
      </View>
      <TextInput
        placeholder="Email"
        className="border font-poppins w-64 p-3 mb-2 text-[13px] rounded border-[#edf1f3]"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="border font-poppins w-64 p-3 mb-4 text-[13px] rounded border-[#edf1f3]"
      />

      { /* Remember me + Forgot Password */}
      <View className="flex flex-row justify-between w-64 mb-4 items-center">
        <View className="flex flex-row items-center">
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            thumbColor={rememberMe ? "#4d81e7" : "#f4f3f4"}
            trackColor={{ false: "#d6d6d6", true: "#a3bffa" }}
          />
          <Text className="ml-2 text-xs font-bold font-poppins text-[#6c7278]">Remember me</Text>
        </View>
        <Text className="text-xs font-bold font-poppins text-[#4d81e7]">Forgot password?</Text>
      </View>

      <Pressable
        className="bg-[#162c39] rounded-md py-3 w-64 mt-[13px]"
        android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        onPress={handleLogin}
      >
        <Text className="text-white font-poppins text-center font-normal">Log In</Text>
      </Pressable>
    </View>
  );
}
