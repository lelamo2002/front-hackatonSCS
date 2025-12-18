import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from "react-native-reanimated";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const status = (params.status as string) || 'success';
  const title = (params.title as string) || 'Sucesso!';
  const message = (params.message as string) || 'Operação realizada com sucesso.';
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const isSuccess = status === 'success';
  const iconName = isSuccess ? 'check-line' : 'close-line';
  
  const bgClassTop = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const bgClassBottom = isSuccess ? 'bg-blue-50' : 'bg-orange-50';
  const iconBgClass = isSuccess ? 'bg-green-500 shadow-green-200' : 'bg-red-500 shadow-red-200';

  useEffect(() => {
    // Icon pop animation
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    
    // Text fade in
    opacity.value = withDelay(300, withTiming(1, { duration: 500 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: (1 - opacity.value) * 20 }],
  }));

  const handleBackToHome = () => {
    router.navigate("/(tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <View className={`absolute top-20 right-0 w-64 h-64 ${bgClassTop} rounded-full opacity-50 -mr-20`} />
      <View className={`absolute bottom-40 left-0 w-48 h-48 ${bgClassBottom} rounded-full opacity-50 -ml-10`} />

      <View className="items-center w-full max-w-sm">
        {/* Status Icon */}
        <Animated.View style={[iconStyle]} className="mb-10 relative">
          <View className={`w-32 h-32 ${iconBgClass} rounded-full items-center justify-center shadow-lg`}>
            <Icon name={iconName} size={64} color="white" />
          </View>
          {/* Decoration */}
          {isSuccess && (
            <View className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full items-center justify-center shadow-sm">
                <Icon name="star-fill" size={16} color="white" />
            </View>
          )}
        </Animated.View>

        {/* Text Content */}
        <Animated.View style={[textStyle]} className="items-center w-full">
          <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">{title}</Text>
          <Text className="text-gray-500 text-lg text-center mb-8">
            {message}
          </Text>

          {/* Conditional Balance Preview for Success (Generic for now) */}
          {isSuccess && params.amount ? (
              <View className="w-full bg-blue-600 rounded-2xl p-6 shadow-md shadow-blue-200 mb-12 relative overflow-hidden">
                 {/* Decorative circles simulation */}
                <View className="absolute -top-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full" />
                
                 <View className="flex-row items-center space-x-2 mb-2">
                    <Icon name="wallet-3-line" size={20} color="rgba(255,255,255,0.8)" />
                    <Text className="text-white opacity-80 text-sm font-medium">Bônus Recebido</Text>
                 </View>
                 <Text className="text-3xl font-bold text-white">{params.amount}</Text>
              </View>
          ) : null}
        </Animated.View>

        {/* Button */}
        <Animated.View style={[textStyle]} className="w-full">
          <TouchableOpacity 
            className="w-full bg-white border border-gray-200 py-4 rounded-xl items-center active:bg-gray-50 mb-4"
            onPress={handleBackToHome}
          >
            <Text className="text-gray-900 font-semibold text-lg">Voltar ao início</Text>
          </TouchableOpacity>
          
          {!isSuccess && (
             <TouchableOpacity 
                className="w-full py-2 items-center"
                onPress={() => router.back()}
              >
                <Text className="text-gray-500 font-medium">Tentar novamente</Text>
              </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
