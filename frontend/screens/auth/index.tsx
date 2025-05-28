import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/form-schema/authSchema';
import { useLoginUserAccount } from './queries/authAdd';
import { useDispatch } from 'react-redux'
import { 
  nameChanged, 
  usernameChanged, 
  emailChanged, 
  dobChanged, 
  phoneChanged
} from '@/redux/accountSlice';

const GLOBAL_STYLE = {
  view: 'w-full',
  textField: 'border font-poppins w-full max-w-md p-4 mb-2 text-base rounded border-[#edf1f3]'
};

type LoginForm = z.infer<typeof loginSchema>;

export default () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const { mutateAsync: loginUserAccount } = useLoginUserAccount();
  const { control, trigger, getValues } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email_or_username: '',
      password: ''
    }
  })

  const handleLogin = async () => {
    const formIsValid = await trigger(['email_or_username', 'password']);

    if(!formIsValid) {
      return;
    }

    const values = getValues();

    loginUserAccount({
      email_or_username: values.email_or_username,
      password: values.password
    }, {
      onSuccess: (result) => {

        dispatch(nameChanged(result.name));
        dispatch(usernameChanged(result.username));
        dispatch(emailChanged(result.email));
        dispatch(dobChanged(result.dateOfBirth));
        dispatch(phoneChanged(result.phone));

        router.replace('/(tabs)');

      },
      onError: (err) => {
        console.log(err.message.split(' ').at(-1));
      }
    })

  };

  return (
    <View className="flex-1 pt-28 items-center bg-white px-12">
      <Text className="text-5xl md:text-6xl font-bold mb-4 font-poppins leading-relaxed">Login</Text>

      <View className="flex flex-row flex-nowrap gap-2">
        <Text className="text-base font-bold mb-4 font-poppins text-[#6c7278]">
          Don't have an account?
        </Text>
        <Pressable onPress={() => router.push('/(auth)/signup')}>
          <Text className="text-base font-bold mb-4 font-poppins text-[#4d81e7]">
            Sign Up
          </Text>
        </Pressable>
      </View>

      <Controller
        control={control}
        name='email_or_username'
        render={({field: { onChange, value}, fieldState: {error}}) => (
          <View className={GLOBAL_STYLE.view}>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Email/Username"
              className={GLOBAL_STYLE.textField}
            />
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>

        )}
      />

      <Controller
        control={control}
        name='password'
        render={({field: { onChange, value}, fieldState: {error}}) => (
          <View className={GLOBAL_STYLE.view}>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Password"
              className={GLOBAL_STYLE.textField}
              secureTextEntry
            />
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>

        )}
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
