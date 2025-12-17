import { useState } from "react";
import {
    FlatList,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

// --- DADOS ---
const CARS = [
  { id: "1", model: "Honda Civic", plate: "ABC-1234" },
  { id: "2", model: "Toyota Corolla", plate: "XYZ-9876" },
  { id: "3", model: "Fiat Uno", plate: "UNO-2025" },
];

const HOURS = [1, 2, 3, 4, 5];

const PAYMENTS = [
  { id: "balance", label: "Usar Saldo", balance: "R$ 50,00" },
  { id: "credit", label: "Pagar Agora (Cartão/Pix)", balance: null },
];

export default function Checkin() {
  const [step, setStep] = useState(0); // 0: Carro, 1: Horas, 2: Pagamento, 3: Fim
  
  // Dados Selecionados
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Controle dos Modais (Dropdowns)
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [isHourModalOpen, setIsHourModalOpen] = useState(false);

  // --- AÇÕES ---

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setIsCarModalOpen(false); // Fecha dropdown
    if (step === 0) setStep(1); // Avança etapa
  };

  const handleSelectHour = (hour) => {
    setSelectedHour(hour);
    setIsHourModalOpen(false); // Fecha dropdown
    if (step === 1) setStep(2); // Avança etapa
  };

  const handleSelectPayment = (method) => {
    setPaymentMethod(method);
    setStep(3);
  };

  const resetFlow = () => {
    setStep(0);
    setSelectedCar(null);
    setSelectedHour(null);
    setPaymentMethod(null);
  };

  // --- COMPONENTES AUXILIARES ---

  // Componente visual do botão "Dropdown"
  const DropdownTrigger = ({ label, value, onPress, disabled }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-row justify-between items-center p-4 bg-gray-50 border border-gray-300 rounded-lg ${
        disabled ? "opacity-50" : "active:border-blue-500"
      }`}
    >
      <Text className={value ? "text-gray-900 font-semibold" : "text-gray-400"}>
        {value || label}
      </Text>
      <Text className="text-gray-500">▼</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Novo Check-in
        </Text>

        {/* --- PASSO 1: SELEÇÃO DO CARRO (DROPDOWN) --- */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-200">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-slate-700">1. Veículo</Text>
          </View>
          
          <DropdownTrigger 
            label="Selecione o veículo..."
            value={selectedCar ? `${selectedCar.model} - ${selectedCar.plate}` : null}
            onPress={() => setIsCarModalOpen(true)}
            disabled={step > 0 && false} // Permite reabrir para editar
          />
        </View>

        {/* --- PASSO 2: HORAS (DROPDOWN) --- */}
        <View className={`bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-200 ${step < 1 && "opacity-50"}`}>
          <Text className="text-lg font-semibold text-slate-700 mb-2">2. Tempo de Estadia</Text>
          
          <DropdownTrigger 
            label="Selecione a duração..."
            value={selectedHour ? `${selectedHour} Horas` : null}
            onPress={() => setIsHourModalOpen(true)}
            disabled={step < 1} // Bloqueado até selecionar carro
          />
        </View>

        {/* --- PASSO 3: PAGAMENTO (BOTÕES) --- */}
        <View className={`bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-200 ${step < 2 && "opacity-50"}`}>
          <Text className="text-lg font-semibold text-slate-700 mb-2">3. Pagamento</Text>
          
          {step >= 2 && step < 3 && (
            <View className="gap-3 mt-2">
              {PAYMENTS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => handleSelectPayment(method)}
                  className="p-4 rounded-lg bg-gray-50 border-2 border-gray-100 flex-row justify-between items-center active:bg-blue-50 active:border-blue-200"
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

          {/* STATUS FINAL */}
          {step === 3 && (
             <View className="p-4 bg-green-50 rounded-lg border border-green-100 items-center">
                <Text className="font-bold text-green-800 text-lg">Check-in Confirmado!</Text>
                <Text className="text-gray-600 mt-1">{selectedCar?.model}</Text>
                <Text className="text-gray-600">{selectedHour} horas</Text>
                
                <TouchableOpacity 
                  onPress={resetFlow}
                  className="mt-4 bg-green-600 py-3 px-8 rounded-full shadow-md active:bg-green-700"
                >
                  <Text className="text-white font-bold text-base">Novo Check-in</Text>
                </TouchableOpacity>
             </View>
          )}
        </View>

      </ScrollView>

      {/* --- MODAL DE CARROS --- */}
      <Modal visible={isCarModalOpen} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 h-[50%]">
            <Text className="text-xl font-bold text-center mb-4">Escolha o Veículo</Text>
            <FlatList
              data={CARS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCar(item)}
                  className="p-4 border-b border-gray-100 active:bg-gray-50"
                >
                  <Text className="text-lg font-bold text-gray-800">{item.model}</Text>
                  <Text className="text-gray-500">{item.plate}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsCarModalOpen(false)} className="mt-4 p-3 bg-gray-200 rounded-lg items-center">
              <Text className="font-bold text-gray-700">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE HORAS --- */}
      <Modal visible={isHourModalOpen} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-center mb-4">Escolha a Duração</Text>
            <View className="gap-2">
              {HOURS.map((h) => (
                <TouchableOpacity
                  key={h}
                  onPress={() => handleSelectHour(h)}
                  className="p-4 bg-gray-50 border border-gray-100 rounded-lg items-center active:bg-blue-50 active:border-blue-200"
                >
                  <Text className="text-lg font-bold text-gray-800">{h} Horas</Text>
                </TouchableOpacity>
              ))}
            </View>
             <TouchableOpacity onPress={() => setIsHourModalOpen(false)} className="mt-4 p-3 bg-gray-200 rounded-lg items-center">
              <Text className="font-bold text-gray-700">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}