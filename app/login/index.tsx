import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { auth } from "../../api";
import "../../global.css";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      await auth.login(data.email, data.senha);
      // alert("Login realizado com sucesso!");
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Erro ao realizar login. Verifique suas credenciais.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="mb-10">
        <Text className="text-4xl font-bold text-gray-900 mb-2">Bem-vindo</Text>
        <Text className="text-lg text-gray-600">Faça login para continuar</Text>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
        <Controller
          control={control}
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
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Senha</Text>
        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Digite sua senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.senha && (
          <Text className="text-red-500 text-sm mt-1">{errors.senha.message}</Text>
        )}
      </View>

      <TouchableOpacity
        className={`bg-blue-500 rounded-lg py-4 items-center mb-6 ${isLoading ? "opacity-70" : ""}`}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text className="text-white text-base font-semibold">
          {isLoading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Não tem uma conta? </Text>
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text className="text-blue-500 font-semibold">Cadastre-se</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
