import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(auth)');
  }, []);

  return null;
}