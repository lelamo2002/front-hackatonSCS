import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-center items-center">
        {/* Hero Section */}
        <View className="w-32 h-32 bg-blue-50 rounded-full items-center justify-center mb-8">
            <Icon name="car-line" size={64} color="#3b82f6" />
        </View>

        <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
          Estacionamento SCS
        </Text>
        <Text className="text-gray-500 text-center text-lg mb-12 px-4 leading-relaxed">
          Gerencie seu estacionamento no Setor Comercial Sul de forma fácil e rápida.
        </Text>

        {/* Actions */}
        <View className="w-full space-y-4 gap-y-4">
          <Link href="/login" asChild>
            <TouchableOpacity className="w-full bg-blue-600 py-4 rounded-xl items-center shadow-md active:bg-blue-700 flex-row justify-center space-x-2">
                <Text className="text-white font-bold text-lg">Entrar na minha conta</Text>
                <Icon name="arrow-right-line" size={20} color="white" />
            </TouchableOpacity>
          </Link>

          <Link href="/register" asChild>
             <TouchableOpacity className="w-full bg-white border border-gray-200 py-4 rounded-xl items-center active:bg-gray-50">
                <Text className="text-gray-900 font-semibold text-lg">Criar nova conta</Text>
             </TouchableOpacity>
          </Link>
        </View>

        {/* Footer info */}
        <Text className="absolute bottom-10 text-gray-300 text-xs">
          Hackathon SCS © 2025
        </Text>
      </View>
    </SafeAreaView>
  );
}
