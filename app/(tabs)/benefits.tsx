import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BenefitsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center -ml-2"
          onPress={() => router.back()}
        >
          <Icon name="arrow-left-s-line" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Benefício Nota Legal</Text>
        <View className="w-8" />
      </View>

      <View className="flex-1 px-6 pt-4">
        {/* Decorative background elements (simplified) */}
        <View className="absolute top-10 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-50" />
        <View className="absolute top-40 -left-10 w-48 h-48 bg-purple-100 rounded-full opacity-50" />

        {/* Main Card */}
        <View className="bg-white rounded-3xl shadow-lg p-8 mb-6 relative overflow-hidden border border-gray-100">
           {/* Card decoration */}
           <View className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[50px]" />

           {/* Icon */}
           <View className="w-20 h-20 self-center mb-6 bg-blue-600 rounded-2xl items-center justify-center shadow-lg relative">
             <Icon name="file-list-3-line" size={40} color="white" />
             <View className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full items-center justify-center shadow-sm">
               <Icon name="star-fill" size={12} color="white" />
             </View>
           </View>

           <View className="items-center space-y-3 mb-6">
             <Text className="text-xl font-bold text-center text-gray-900">
               Ganhe créditos com Nota Legal
             </Text>
             <Text className="text-center text-gray-500 leading-6">
               Escaneie o seu cupom da Nota Legal e ganhe créditos de uso do estacionamento.
             </Text>
           </View>

           {/* Benefits List */}
           <View className="space-y-3">
             <View className="flex-row items-center space-x-3 p-3 bg-green-50 rounded-xl">
               <View className="w-8 h-8 bg-green-500 rounded-lg items-center justify-center">
                 <Icon name="check-line" size={16} color="white" />
               </View>
               <Text className="text-sm font-medium text-gray-900 flex-1">Até R$ 5,00 por cupom escaneado</Text>
             </View>

             <View className="flex-row items-center space-x-3 p-3 bg-blue-50 rounded-xl">
               <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center">
                 <Icon name="timer-flash-line" size={16} color="white" />
               </View>
               <Text className="text-sm font-medium text-gray-900 flex-1">Créditos adicionados instantaneamente</Text>
             </View>
           </View>
        </View>
      </View>

      {/* Fixed CTA Button */}
      <View className="p-6 bg-white border-t border-gray-50">
        <TouchableOpacity 
          className="w-full bg-blue-600 py-4 rounded-xl shadow-lg items-center active:bg-blue-700"
          onPress={() => console.log("Ativar Beneficio Pressed")}
        >
          <Text className="text-white font-bold text-lg">Ativar Benefício</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
