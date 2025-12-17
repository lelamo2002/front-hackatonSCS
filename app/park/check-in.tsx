import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Recomendado para Expo Router
import "../../global.css";

// Dados simulados
const CARS = [
  { id: "1", model: "Honda Civic", plate: "ABC-1234" },
  { id: "2", model: "Toyota Corolla", plate: "XYZ-9876" },
  { id: "3", model: "Fiat Uno", plate: "UNO-2025" },
];

const HOURS = [1, 2, 3, 4, 6, 12];

const PAYMENTS = [
  { id: "balance", label: "Usar Saldo", balance: "R$ 50,00" },
  { id: "credit", label: "Pagar Agora (Cartão/Pix)", balance: null },
];

export default function Checkin() {
  // Estados para controlar o fluxo e as escolhas
  const [step, setStep] = useState(0); // 0: Carro, 1: Horas, 2: Pagamento, 3: Confirmado
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Funções de ação
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setStep(1); // Avança para horas
  };

  const handleSelectHour = (hour) => {
    setSelectedHour(hour);
    setStep(2); // Avança para pagamento
  };

  const handleSelectPayment = (method) => {
    setPaymentMethod(method);
    setStep(3); // Finaliza
    // Aqui você faria o POST para a API
    alert("Check-in Realizado com Sucesso!");
  };

  const resetFlow = () => {
    setStep(0);
    setSelectedCar(null);
    setSelectedHour(null);
    setPaymentMethod(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Novo Check-in
        </Text>

        {/* --- PASSO 1: SELEÇÃO DO CARRO --- */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-200">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-slate-700">1. Veículo</Text>
            {step > 0 && (
              <TouchableOpacity onPress={() => setStep(0)}>
                <Text className="text-blue-600 font-medium">Alterar</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {step === 0 ? (
            <View className="gap-3 mt-2">
              {CARS.map((car) => (
                <TouchableOpacity
                  key={car.id}
                  onPress={() => handleSelectCar(car)}
                  className={`p-4 rounded-lg border-2 ${
                    selectedCar?.id === car.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <Text className="font-bold text-gray-800">{car.model}</Text>
                  <Text className="text-gray-500">{car.plate}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Text className="font-bold text-blue-800">{selectedCar?.model}</Text>
              <Text className="text-blue-600 text-sm">{selectedCar?.plate}</Text>
            </View>
          )}
        </View>

        {/* --- PASSO 2: QUANTIDADE DE HORAS --- */}
        <View className={`bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-200 ${step < 1 && "opacity-50"}`}>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-slate-700">2. Tempo de Estadia</Text>
            {step > 1 && (
              <TouchableOpacity onPress={() => setStep(1)}>
                <Text className="text-blue-600 font-medium">Alterar</Text>
              </TouchableOpacity>
            )}
          </View>

          {step === 1 && (
            <View className="flex-row flex-wrap gap-3 mt-2">
              {HOURS.map((h) => (
                <TouchableOpacity
                  key={h}
                  onPress={() => handleSelectHour(h)}
                  className="w-[30%] items-center justify-center p-4 rounded-lg bg-gray-50 border-2 border-gray-100 active:border-blue-500 active:bg-blue-50"
                >
                  <Text className="font-bold text-lg text-gray-800">{h}h</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step > 1 && (
            <View className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Text className="font-bold text-blue-800">{selectedHour} Horas</Text>
            </View>
          )}
        </View>

        {/* --- PASSO 3: PAGAMENTO --- */}
        <View className={`bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-200 ${step < 2 && "opacity-50"}`}>
          <Text className="text-lg font-semibold text-slate-700 mb-2">3. Pagamento</Text>
          
          {step === 2 && (
            <View className="gap-3 mt-2">
              {PAYMENTS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => handleSelectPayment(method)}
                  className="p-4 rounded-lg bg-gray-50 border-2 border-gray-100 flex-row justify-between items-center"
                >
                  <View>
                    <Text className="font-bold text-gray-800">{method.label}</Text>
                    {method.balance && (
                      <Text className="text-green-600 text-sm">Disponível: {method.balance}</Text>
                    )}
                  </View>
                  <View className="w-4 h-4 rounded-full border border-gray-400" />
                </TouchableOpacity>
              ))}
            </View>
          )}
           
          {step === 3 && (
             <View className="p-3 bg-green-50 rounded-lg border border-green-100 items-center">
                <Text className="font-bold text-green-800 text-lg">Tudo pronto!</Text>
                <Text className="text-green-700">Check-in realizado.</Text>
                
                <TouchableOpacity 
                  onPress={resetFlow}
                  className="mt-4 bg-green-600 py-2 px-6 rounded-full"
                >
                  <Text className="text-white font-bold">Novo Check-in</Text>
                </TouchableOpacity>
             </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}