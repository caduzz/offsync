import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text, View } from "react-native";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('cadu@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      await signIn({ email, password });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erro ao efetuar login');
    }
  };

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="text-2xl font-bold">Login</Text>
      <View className="mt-4 space-y-4">
        <Input label="email" placeholder="Email" value={email} onChangeText={setEmail} />
        <Input label="password" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        {error ? <Text className="text-red-600">{error}</Text> : null}
        <Button onPress={handleSubmit}>{loading ? 'Entrando...' : 'Login'}</Button>
      </View>
    </View>
  )
}