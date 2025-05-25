import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    router.replace("/home");
  };

  return (
    <View className="flex-1 pt-28 items-center bg-white px-12">
      <Text className="text-5xl md:text-6xl font-bold mb-4 font-poppins leading-relaxed">Login</Text>

      <View className="flex flex-row flex-nowrap gap-2">
        <Text className="text-base font-bold mb-4 font-poppins text-[#6c7278]">
          Don't have an account?
        </Text>
        <Pressable onPress={() => router.push('/signup')}>
          <Text className="text-base font-bold mb-4 font-poppins text-[#4d81e7]">
            Sign Up
          </Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Email"
        className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="border font-poppins w-full max-w-md p-4 mb-4 text-base rounded border-[#edf1f3]"
      />

      {/* Remember me + Forgot Password */}
      <View className="flex flex-row justify-between w-full max-w-md mb-4 items-center">
        <View className="flex flex-row items-center">
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            thumbColor={rememberMe ? "#4d81e7" : "#f4f3f4"}
            trackColor={{ false: "#d6d6d6", true: "#a3bffa" }}
          />
          <Text className="ml-2 text-sm font-bold font-poppins text-[#6c7278]">Remember me</Text>
        </View>
        <Text className="text-sm font-bold font-poppins text-[#4d81e7]">Forgot password?</Text>
      </View>

      <Pressable
        className="bg-[#162c39] rounded-md py-4 w-full max-w-md mt-4"
        android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        onPress={handleLogin}
      >
        <Text className="text-white font-poppins text-center font-normal text-base">Log In</Text>
      </Pressable>
    </View>
  );
}
