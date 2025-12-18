import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

// Importações do Projeto
import { tickets } from "../../api"; // Certifique-se que o caminho está correto
import OSMWebView from "../components/OSMWebView";

export default function CheckIn() {
  const router = useRouter();

  // Estados do Formulário
  const [placa, setPlaca] = useState("ABC-1D23");
  const [tempo, setTempo] = useState("1");
  const [usarCredito, setUsarCredito] = useState(true); // true = Saldo, false = Cartão
  
  // Estado de Loading
  const [isLoading, setIsLoading] = useState(false);

  // Função de Integração
  const handleEstacionar = async () => {
    if (!placa || !tempo) {
      Alert.alert("Atenção", "Preencha a placa e o tempo desejado.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Monta o Payload conforme solicitado
      const payload = {
        tipoHoras: Number(tempo),
        timestampEntrada: new Date().toISOString(),
        placaDoCarro: placa.toUpperCase().replace("-", ""), // Remove traço se necessário
        usarCredito: usarCredito
      };

      console.log("Enviando:", payload);

      // 2. Chama a API
      await tickets.create(payload);

      // 3. Sucesso
      Alert.alert("Sucesso!", "Seu ticket foi criado e o estacionamento está ativo.", [
        { text: "OK", onPress: () => router.push("/") }
      ]);

    } catch (error: any) {
      console.error(error);
      const mensagem = error.response?.data?.message || "Não foi possível criar o ticket.";
      Alert.alert("Erro", mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  // Cálculo visual do preço (exemplo R$ 3,00/h)
  const valorTotal = Number(tempo) * 3.00;

  return (
    <View className="flex-1 bg-gray-50">
      {/* MAPA (Background) */}
      <View className="absolute inset-0 z-0">
        <OSMWebView />
        <View className="absolute inset-0 bg-white/10" />
      </View>

      <SafeAreaView className="flex-1">
        
        {/* HEADER */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity 
            className="w-12 h-12 bg-white rounded-xl shadow-sm items-center justify-center"
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Icon name="arrow-left-s-line" size={24} color="#374151" />
          </TouchableOpacity>
          
          <View className="bg-white px-4 py-2 rounded-xl shadow-sm">
            <Text className="font-bold text-gray-900">Novo Ticket</Text>
          </View>
          <View className="w-12" /> 
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          {/* BOTTOM SHEET DO FORMULÁRIO */}
          <View className="bg-gray-50 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-6 pb-8 border-t border-gray-100">
            
            {/* 1. VEÍCULO */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex-row items-center space-x-4">
              <View className="w-14 h-14 bg-blue-600 rounded-xl items-center justify-center shadow-sm">
                <Icon name="car-line" size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs uppercase font-bold mb-1">Veículo</Text>
                <TextInput 
                  className="font-bold text-gray-900 text-xl p-0"
                  value={placa}
                  onChangeText={setPlaca}
                  autoCapitalize="characters"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* 2. TEMPO (tipoHoras) */}
            <View className="flex-row items-center justify-between mb-4 bg-white p-4 rounded-2xl shadow-sm">
              <Text className="font-semibold text-gray-900 text-lg">Tempo (Horas)</Text>
              
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity 
                  onPress={() => setTempo(String(Math.max(1, Number(tempo) - 1)))}
                  className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center active:bg-gray-200"
                  disabled={isLoading}
                >
                  <Icon name="subtract-line" size={20} color="#374151" />
                </TouchableOpacity>

                <Text className="text-2xl font-bold text-blue-600 w-8 text-center">{tempo}</Text>
                
                <TouchableOpacity 
                  onPress={() => setTempo(String(Number(tempo) + 1))}
                  className="w-10 h-10 bg-blue-50 rounded-lg items-center justify-center active:bg-blue-100"
                  disabled={isLoading}
                >
                  <Icon name="add-line" size={20} color="#2563eb" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. MÉTODO DE PAGAMENTO (usarCredito) */}
            <View className="mb-6">
              <Text className="text-gray-500 text-xs uppercase font-bold mb-2 ml-1">Método de Pagamento</Text>
              
              {/* Opção: Saldo Disponível */}
              <TouchableOpacity 
                onPress={() => setUsarCredito(true)}
                disabled={isLoading}
                className={`flex-row items-center p-4 rounded-xl mb-2 border ${usarCredito ? 'bg-blue-50 border-blue-500' : 'bg-white border-transparent'}`}
              >
                <View className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${usarCredito ? 'border-blue-600' : 'border-gray-300'}`}>
                  {usarCredito && <View className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </View>
                <Icon name="wallet-3-line" size={20} color={usarCredito ? "#2563eb" : "#6b7280"} />
                <Text className={`ml-2 font-semibold ${usarCredito ? 'text-blue-700' : 'text-gray-600'}`}>
                  Usar Saldo da Carteira
                </Text>
              </TouchableOpacity>

              {/* Opção: Cartão de Crédito */}
              <TouchableOpacity 
                onPress={() => setUsarCredito(false)}
                disabled={isLoading}
                className={`flex-row items-center p-4 rounded-xl border ${!usarCredito ? 'bg-blue-50 border-blue-500' : 'bg-white border-transparent'}`}
              >
                <View className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${!usarCredito ? 'border-blue-600' : 'border-gray-300'}`}>
                  {!usarCredito && <View className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </View>
                <Icon name="bank-card-line" size={20} color={!usarCredito ? "#2563eb" : "#6b7280"} />
                <Text className={`ml-2 font-semibold ${!usarCredito ? 'text-blue-700' : 'text-gray-600'}`}>
                  Cartão de Crédito
                </Text>
              </TouchableOpacity>
            </View>

            {/* 4. BOTÃO DE AÇÃO */}
            <TouchableOpacity 
              className={`w-full py-4 rounded-xl shadow-md flex-row items-center justify-center space-x-3 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 active:bg-blue-700'}`}
              onPress={handleEstacionar}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-white font-bold text-lg">Confirmar Estacionamento</Text>
                  <View className="bg-blue-800/30 px-2 py-1 rounded">
                     <Text className="text-white font-bold text-xs">R$ {valorTotal.toFixed(2).replace('.', ',')}</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}