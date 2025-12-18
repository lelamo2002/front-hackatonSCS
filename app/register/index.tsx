import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { auth } from "../../api";
import "../../global.css";

// Validação de CPF
const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]/g, "");
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

// Schema para etapa 1 - Informações Pessoais
const step1Schema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string()
    .min(11, "CPF inválido")
    .refine((val) => validateCPF(val), "CPF inválido"),
  celular: z.string()
    .min(10, "Celular deve ter no mínimo 10 dígitos")
    .regex(/^\d{10,11}$/, "Celular deve conter apenas números"),
});

// Schema para etapa 2 - Email e Senha
const step2Schema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmarSenha: z.string().min(6, "Confirmação deve ter no mínimo 6 caracteres"),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não conferem",
  path: ["confirmarSenha"],
});

// Schema para etapa 3 - Veículo (opcional)
const step3Schema = z.object({
  tipoVeiculo: z.string().optional(),
  placa: z.string()
    .optional()
    .refine((val) => !val || val.length === 0 || /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/.test(val), 
      "Placa inválida (use AAA1234 ou AAA1A23)"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

type FormData = Step1Data & Step2Data & Step3Data;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  // Form para etapa 1
  const {
    control: control1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nome: formData.nome || "",
      cpf: formData.cpf || "",
      celular: formData.celular || "",
    },
  });

  // Form para etapa 2
  const {
    control: control2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      email: formData.email || "",
      senha: formData.senha || "",
      confirmarSenha: formData.confirmarSenha || "",
    },
  });

  // Form para etapa 3
  const {
    control: control3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      tipoVeiculo: formData.tipoVeiculo || "",
      placa: formData.placa || "",
    },
  });

  const onSubmitStep1 = (data: Step1Data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const onSubmitStep2 = (data: Step2Data) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };



  const onSubmitStep3 = async (data: Step3Data) => {
    const finalData = { ...formData, ...data };
    console.log("Dados finais:", finalData);
    
    try {
      await auth.register({
        nome: finalData.nome,
        email: finalData.email,
        senha: finalData.senha,
        celular: finalData.celular,
        cpf: finalData.cpf,
        placaDoCarro: finalData.placa
      });
      alert("Cadastro realizado com sucesso!");
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Erro ao realizar cadastro. Tente novamente.";
      alert(message);
    }
  };

  const formatCPF = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cleaned;
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/) || cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return cleaned;
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Cadastro</Text>
          <Text className="text-lg text-gray-600">Etapa {step}/3</Text>
        </View>

        {/* Progress Bar */}
        <View className="mb-8 flex-row space-x-2">
          <View className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-gray-200"}`} />
          <View className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-gray-200"}`} />
          <View className={`h-2 flex-1 rounded-full ${step >= 3 ? "bg-blue-500" : "bg-gray-200"}`} />
        </View>

        {/* Etapa 1 - Informações Pessoais */}
        {step === 1 && (
          <View>
            <Text className="text-2xl font-semibold text-gray-900 mb-6">
              Informações Pessoais
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Nome</Text>
              <Controller
                control={control1}
                name="nome"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="Digite seu nome completo"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors1.nome && (
                <Text className="text-red-500 text-sm mt-1">{errors1.nome.message}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">CPF</Text>
              <Controller
                control={control1}
                name="cpf"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="000.000.000-00"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, "");
                      onChange(cleaned);
                    }}
                    value={formatCPF(value)}
                    keyboardType="numeric"
                    maxLength={14}
                  />
                )}
              />
              {errors1.cpf && (
                <Text className="text-red-500 text-sm mt-1">{errors1.cpf.message}</Text>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Celular</Text>
              <Controller
                control={control1}
                name="celular"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="(00) 00000-0000"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, "");
                      onChange(cleaned);
                    }}
                    value={formatPhone(value)}
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                )}
              />
              {errors1.celular && (
                <Text className="text-red-500 text-sm mt-1">{errors1.celular.message}</Text>
              )}
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 border border-gray-300 rounded-lg py-4 items-center"
                onPress={() => router.back()}
              >
                <Text className="text-gray-700 text-base font-semibold">Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-lg py-4 items-center"
                onPress={handleSubmit1(onSubmitStep1)}
              >
                <Text className="text-white text-base font-semibold">Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Etapa 2 - Email e Senha */}
        {step === 2 && (
          <View>
            <Text className="text-2xl font-semibold text-gray-900 mb-6">
              Credenciais de Acesso
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <Controller
                control={control2}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="seu@email.com"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              {errors2.email && (
                <Text className="text-red-500 text-sm mt-1">{errors2.email.message}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Senha</Text>
              <Controller
                control={control2}
                name="senha"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="Mínimo 6 caracteres"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
              />
              {errors2.senha && (
                <Text className="text-red-500 text-sm mt-1">{errors2.senha.message}</Text>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Confirmar Senha</Text>
              <Controller
                control={control2}
                name="confirmarSenha"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="Confirme sua senha"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
              />
              {errors2.confirmarSenha && (
                <Text className="text-red-500 text-sm mt-1">{errors2.confirmarSenha.message}</Text>
              )}
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 border border-gray-300 rounded-lg py-4 items-center"
                onPress={() => setStep(1)}
              >
                <Text className="text-gray-700 text-base font-semibold">Voltar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-lg py-4 items-center"
                onPress={handleSubmit2(onSubmitStep2)}
              >
                <Text className="text-white text-base font-semibold">Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Etapa 3 - Cadastro do Veículo (Opcional) */}
        {step === 3 && (
          <View>
            <Text className="text-2xl font-semibold text-gray-900 mb-2">
              Cadastro do Veículo
            </Text>
            <Text className="text-sm text-gray-500 mb-6">(Opcional)</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Tipo de Veículo</Text>
              <Controller
                control={control3}
                name="tipoVeiculo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="border border-gray-300 rounded-lg">
                    <TouchableOpacity
                      className={`py-3 px-4 border-b border-gray-300 ${value === "carro" ? "bg-blue-50" : ""}`}
                      onPress={() => onChange("carro")}
                    >
                      <Text className={`text-base ${value === "carro" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                        Carro
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`py-3 px-4 border-b border-gray-300 ${value === "moto" ? "bg-blue-50" : ""}`}
                      onPress={() => onChange("moto")}
                    >
                      <Text className={`text-base ${value === "moto" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                        Moto
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`py-3 px-4 ${value === "caminhao" ? "bg-blue-50" : ""}`}
                      onPress={() => onChange("caminhao")}
                    >
                      <Text className={`text-base ${value === "caminhao" ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                        Caminhão
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors3.tipoVeiculo && (
                <Text className="text-red-500 text-sm mt-1">{errors3.tipoVeiculo.message}</Text>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Placa</Text>
              <Controller
                control={control3}
                name="placa"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="ABC1234 ou ABC1D23"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text.toUpperCase())}
                    value={value}
                    autoCapitalize="characters"
                    maxLength={7}
                  />
                )}
              />
              {errors3.placa && (
                <Text className="text-red-500 text-sm mt-1">{errors3.placa.message}</Text>
              )}
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 border border-gray-300 rounded-lg py-4 items-center"
                onPress={() => setStep(2)}
              >
                <Text className="text-gray-700 text-base font-semibold">Voltar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-lg py-4 items-center"
                onPress={handleSubmit3(onSubmitStep3)}
              >
                <Text className="text-white text-base font-semibold">Finalizar Cadastro</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
