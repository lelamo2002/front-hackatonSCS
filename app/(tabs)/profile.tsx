import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-6">Perfil</Text>
      
      <TouchableOpacity 
        className="bg-red-500 px-6 py-3 rounded-lg"
        onPress={() => router.replace("/")}
      >
        <Text className="text-white font-semibold">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
