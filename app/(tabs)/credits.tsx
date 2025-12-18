import { Text, View } from "react-native";

export default function CreditsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Créditos</Text>
      <Text className="text-gray-500 mt-2">Seu saldo e histórico</Text>
    </View>
  );
}
