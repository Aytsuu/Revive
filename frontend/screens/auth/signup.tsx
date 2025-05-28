import { View, Text, TextInput, Pressable, Switch, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/form-schema/authSchema';
import { useAddUserAccount } from './queries/authAdd';

const GLOBAL_STYLE = {
  view: 'w-full'
}

type SignupForm = z.infer<typeof signupSchema>

export default function SignUp() {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const { mutateAsync: addUserAccount } = useAddUserAccount();
  const { control, getValues, trigger } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      dateOfBirth: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  })

  const handleLogin = async () => {
    const formIsValid = await trigger(['username', 
      'email', 'dateOfBirth', 'phone', 'password', 'confirmPassword']);

    if(!formIsValid) {
      console.log(getValues());
      return;
    }

    try {
      const values = getValues();

      const data =  {
        username: values.username,
        email: values.email,
        name: values.username,
        dob: new Date(values.dateOfBirth).toISOString().split('T')[0],
        contact: values.phone,
        password: values.password
      }

      addUserAccount( data, {
        onSuccess: () => {
          router.replace('/(auth)');
        }
      })
    } catch (error) {

    }
  };

  return (
    <View className="flex-1 pt-28 px-12 items-start bg-white">
      <Text className="text-5xl font-bold mb-4 font-poppins leading-relaxed">Sign up</Text>

      <View className="flex flex-row flex-nowrap gap-2 self-start">
        <Text className="text-base font-bold mb-4 font-poppins text-[#6c7278]">Already have an account?</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-base font-bold mb-4 font-poppins text-[#4d81e7]">
            Log In
          </Text>
        </Pressable>
      </View>

      <Controller 
        control={control}
        name='username'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <View className={GLOBAL_STYLE.view}>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Username"
              className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
              keyboardType="default"
              autoCapitalize="words"
            />
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>
        )}
        
      />

      <Controller 
        control={control}
        name='email'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <View  className={GLOBAL_STYLE.view}>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Email"
              className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>
        )}
      />

      <Controller 
        control={control}
        name='dateOfBirth'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <View className={GLOBAL_STYLE.view}>
            <Pressable
              onPress={() => setShowPicker(true)}
              className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
            >
              <Text className="text-[16px]">
                {value ? new Date(value).toLocaleDateString() : "Date of Birth"}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                testID="datePicker"
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) {
                    const dateStr = selectedDate.toISOString().split('T')[0];
                    onChange(dateStr); 
                  }
                }}
              />
            )}
          </View>
        )}     
      />
      
      <Controller 
        control={control}
        name='phone'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <View  className={GLOBAL_STYLE.view}>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Phone Number"
              className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
              keyboardType="phone-pad"
              secureTextEntry={false}
            />
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>
        )}
      />

      <Controller 
        control={control}
        name='password'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <View className={GLOBAL_STYLE.view}>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Password"
              className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
              secureTextEntry={true}
            />
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>
        )}
      />

      <Controller 
        control={control}
        name='confirmPassword'
        render={({field: { onChange, value }, fieldState: { error }}) => (
          <View className={GLOBAL_STYLE.view}>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Confirm Password"
              className="border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]"
              secureTextEntry={true}
            />
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>
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
