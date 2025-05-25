import { View, Text, TextInput, Pressable, Switch, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupSchema } from '@/form-schema/authSchema';

type SignupForm = z.infer<typeof SignupSchema>

export default function SignUp() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const { control, trigger } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: '',
      email: '',
      dateOfBirth: '',
      phone: '',
      password: ''
    }
  })

  const handleLogin = () => {
    
  };

  return (
    <View className="flex-1 pt-28 px-12 items-start bg-white">
      <Text className="text-5xl font-bold mb-4 font-poppins leading-relaxed">Sign up</Text>

      <View className="flex flex-row flex-nowrap gap-2 self-start">
        <Text className="text-base font-bold mb-4 font-poppins text-[#6c7278]">Already have an account?</Text>
        <Pressable onPress={() => router.push('/login')}>
          <Text className="text-base font-bold mb-4 font-poppins text-[#4d81e7]">
            Log In
          </Text>
        </Pressable>
      </View>

      <Controller 
        control={control}
        name='username'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Username"
            className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
            keyboardType="default"
            autoCapitalize="words"
          />
        )}
        
      />

      <Controller 
        control={control}
        name='email'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Email"
            className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />

      <Pressable
        onPress={() => setOpen(true)}
        className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
      >
        <Text className="text-[13px]">{birthDate.toLocaleDateString()}</Text>
      </Pressable>

      <DatePicker
        modal
        open={open}
        date={birthDate}
        mode="date"
        maximumDate={new Date()}
        onConfirm={(date) => {
          setOpen(false);
          setBirthDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      
      <Controller 
        control={control}
        name='email'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Phone Number"
            className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
            keyboardType="phone-pad"
            secureTextEntry={false}
          />
        )}
      />

      <Controller 
        control={control}
        name='email'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Password"
            className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
            secureTextEntry={true}
          />
        )}
      />

      <Pressable
        className="bg-[#162c39] rounded-md py-4 w-full max-w-wd mt-[13px]"
        android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        onPress={handleLogin}
      >
        <Text className="text-white font-poppins text-center font-normal">Register</Text>
      </Pressable>
    </View>
  );
}
