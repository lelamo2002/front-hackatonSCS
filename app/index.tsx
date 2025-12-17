import { Link } from "expo-router";
import { Text, View } from "react-native";
import "../global.css";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-6">SCS Hackathon</Text>
      
      <View className="space-y-4">
        <Link href="/login" asChild>
          <Text className="text-blue-500 text-lg p-2">Ir para Login</Text>
        </Link>
        <Link href="/register" asChild>
          <Text className="text-blue-500 text-lg p-2">Ir para Cadastro</Text>
        </Link>
      </View>
    </View>
  );
}
