import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../api";
import { User } from "../../types";

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    auth.me().then((response) => {
      console.log(response);
      setUser(response);
    });
  }, []);

  const balance = user ? `R$ ${user.creditoSaldo.toFixed(2).replace('.', ',')}` : "R$ 0,00";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity 
            className="w-12 h-12 bg-white rounded-xl shadow-sm items-center justify-center"
            onPress={() => router.push("/profile")}
          >
            <Icon name="user-line" size={20} color="#6b7280" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-900">Estacionar</Text>
            <Text className="text-sm text-gray-500">Setor Comercial Sul</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-white rounded-xl shadow-sm items-center justify-center">
            <Icon name="map-pin-line" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Vehicle card */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex-row items-center space-x-4">
            <View className="w-14 h-14 bg-blue-600 rounded-xl items-center justify-center shadow-sm">
              <Icon name="car-line" size={28} color="white" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center space-x-2">
                <Text className="font-bold text-gray-900 text-lg">ABC-1D23</Text>
                <View className="w-2 h-2 bg-green-500 rounded-full" />
              </View>
              <Text className="text-gray-500 text-sm">Honda Civic Preto</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold text-sm">Trocar</Text>
            </TouchableOpacity>
          </View>

          {/* Balance card */}
          <View className="bg-blue-600 rounded-2xl p-6 shadow-md mb-4 relative overflow-hidden">
            {/* Decorative circles simulation */}
            <View className="absolute -top-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full" />
            <View className="absolute -bottom-12 -left-12 w-40 h-40 bg-white opacity-5 rounded-full" />

            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center space-x-2">
                 <Icon name="wallet-3-line" size={20} color="rgba(255,255,255,0.8)" />
                <Text className="text-white opacity-80 text-sm font-medium">Saldo disponível</Text>
              </View>
              <TouchableOpacity className="w-8 h-8 bg-white opacity-20 rounded-full items-center justify-center">
                <Icon name="add-line" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-4xl font-bold text-white mb-2">{balance}</Text>
            <Text className="text-white opacity-70 text-sm">Use para estacionar no Setor Comercial Sul</Text>
          </View>

          {/* Operating hours */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex-row items-center space-x-4">
            <View className="w-12 h-12 bg-yellow-100 rounded-xl items-center justify-center">
              <Icon name="time-line" size={24} color="#eab308" />
            </View>
            <View>
              <Text className="font-semibold text-gray-900">Horário de funcionamento</Text>
              <Text className="text-gray-500 text-sm">Seg a Sex: 8h às 18h | Sáb: 8h às 13h</Text>
            </View>
          </View>

          {/* Park now button */}
          <TouchableOpacity 
            className="w-full bg-blue-600 py-4 rounded-xl shadow-md flex-row items-center justify-center space-x-2 mb-4 active:bg-blue-700"
            onPress={() => console.log("Estacionar pressed")}
          >
            <Icon name="car-line" size={20} color="white" />
            <Text className="text-white font-semibold text-lg">Estacionar agora</Text>
          </TouchableOpacity>
          
          <Text className="text-center text-gray-500 text-sm mb-4">
            R$ 3,00 por hora • Pagamento via saldo
          </Text>

          {/* Nota Legal benefit teaser */}
          <TouchableOpacity 
            onPress={() => router.push("/benefits")}
            className="w-full bg-white rounded-2xl p-4 shadow-sm flex-row items-center space-x-4 mb-8 active:bg-gray-50"
          >
            <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center">
              <Icon name="coupon-3-line" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Benefício Nota Legal</Text>
              <Text className="text-gray-500 text-sm">Ganhe créditos de estacionamento com seu cupom.</Text>
            </View>
            <Icon name="arrow-right-s-line" size={20} color="#9ca3af" />
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
