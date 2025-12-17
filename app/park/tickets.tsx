import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import "../../global.css";

// --- DADOS MOCKADOS (Simulando API) ---
const TICKETS = [
  {
    id: "1",
    plate: "PAG 9F75",
    model: "Hyundai HB20",
    zone: "Zona Azul - Centro",
    startTime: "10:30",
    endTime: "11:30",
    remainingMinutes: 45, // Tempo restante
    totalMinutes: 60,
    status: "ACTIVE", // ACTIVE | EXPIRING
    cost: "R$ 5,00",
  },
  {
    id: "2",
    plate: "ABC 1234",
    model: "Honda Civic",
    zone: "Zona Verde - Shopping",
    startTime: "09:00",
    endTime: "11:00",
    remainingMinutes: 5, // Faltam 5 min!
    totalMinutes: 120,
    status: "EXPIRING",
    cost: "R$ 10,00",
  },
];

export default function MeusTickets() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* --- HEADER --- */}
      <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-slate-800">Meus Tickets</Text>
          <Text className="text-slate-500 text-sm">Gerencie seus estacionamentos</Text>
        </View>
        <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
          <Feather name="clock" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Renderização dos Tickets */}
        {TICKETS.map((ticket) => (
          <TicketCard key={ticket.id} data={ticket} />
        ))}

        {/* Botão Flutuante de Novo Ticket (Opcional) */}
        <TouchableOpacity className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-4 items-center justify-center bg-gray-50 active:bg-gray-100">
          <Feather name="plus-circle" size={24} color="#94a3b8" />
          <Text className="text-slate-400 font-medium mt-1">Estacionar outro carro</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- COMPONENTE DO CARD (Separado para organizar) ---
function TicketCard({ data }) {
  // Define cores baseadas na urgência (Se faltar menos de 10 min, fica laranja/vermelho)
  const isExpiring = data.status === "EXPIRING";
  
  // Cálculo da barra de progresso (visual)
  const progressPercent = ((data.totalMinutes - data.remainingMinutes) / data.totalMinutes) * 100;

  return (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
      
      {/* 1. Cabeçalho do Card: Carro e Placa */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center gap-3">
          <View className={`p-2 rounded-lg ${isExpiring ? "bg-orange-50" : "bg-teal-50"}`}>
            <MaterialCommunityIcons 
              name="car-hatchback" 
              size={24} 
              color={isExpiring ? "#ea580c" : "#0d9488"} 
            />
          </View>
          <View>
            <Text className="font-bold text-slate-700 text-lg">{data.plate}</Text>
            <Text className="text-slate-500 text-xs uppercase">{data.model}</Text>
          </View>
        </View>
        
        {/* Badge de Status */}
        <View className={`px-2 py-1 rounded-md ${isExpiring ? "bg-red-100" : "bg-emerald-100"}`}>
          <Text className={`text-xs font-bold ${isExpiring ? "text-red-600" : "text-emerald-700"}`}>
            {isExpiring ? "EXPIRA EM BREVE" : "ATIVO"}
          </Text>
        </View>
      </View>

      {/* 2. Informações de Tempo (Timer Visual) */}
      <View className="mb-4">
        <View className="flex-row justify-between items-end mb-1">
            <Text className="text-slate-400 text-xs">Tempo Restante</Text>
            <Text className={`font-bold text-2xl ${isExpiring ? "text-orange-500" : "text-slate-800"}`}>
              {data.remainingMinutes} <Text className="text-sm font-normal text-slate-400">min</Text>
            </Text>
        </View>
        
        {/* Barra de Progresso */}
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View 
            className={`h-full rounded-full ${isExpiring ? "bg-orange-500" : "bg-emerald-500"}`} 
            style={{ width: `${100 - progressPercent}%` }} // Inverti para mostrar o que falta
          />
        </View>
        
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs text-gray-400">{data.startTime}</Text>
          <Text className="text-xs text-gray-400">{data.endTime}</Text>
        </View>
      </View>

      {/* 3. Rodapé: Localização e Botão de Ação */}
      <View className="pt-4 border-t border-gray-100 flex-row justify-between items-center">
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text className="text-slate-500 text-xs font-medium">{data.zone}</Text>
        </View>

        {isExpiring ? (
          <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-lg shadow-sm active:bg-orange-600">
            <Text className="text-white font-bold text-sm">Renovar (+1h)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="border border-gray-200 px-4 py-2 rounded-lg active:bg-gray-50">
            <Text className="text-slate-600 font-bold text-sm">Ver Detalhes</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}