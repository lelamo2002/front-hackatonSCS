import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScannerScreen() {
  const router = useRouter();
  const scanPosition = useSharedValue(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    scanPosition.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false // do not reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPosition.value * 200 }], // Move 200px down (approx height of frame)
  }));

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    // Here you would normally handle the scanned data
    // console.log("Scanned:", data);
    router.replace("/success");
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-white text-center text-lg mb-6 max-w-xs mx-auto">Precisamos de acesso à câmera para escanear QR Codes</Text>
        <TouchableOpacity 
             className="bg-blue-500 py-3 px-8 rounded-xl active:bg-blue-600"
             onPress={requestPermission}
        >
             <Text className="text-white font-semibold text-lg">Conceder Permissão</Text>
        </TouchableOpacity>
        <TouchableOpacity 
             className="mt-6"
             onPress={() => router.back()}
        >
             <Text className="text-white/60 font-medium">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
      />
      
      {/* Overlay Darkening */}
      <View className="absolute inset-0 bg-black/30" />
       
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 z-10">
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center bg-black/40 rounded-xl backdrop-blur-md"
            onPress={() => router.back()}
          >
            <Icon name="arrow-left-s-line" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white shadow-sm">Ativar Benefício</Text>
          <View className="w-10 h-10 items-center justify-center bg-black/40 rounded-xl backdrop-blur-md">
            <Icon name="camera-line" size={20} color="white" />
          </View>
        </View>

        {/* Scanner Area */}
        <View className="flex-1 items-center justify-center px-8 z-10">
          <Text className="text-white text-center mb-12 font-medium text-lg drop-shadow-md">
            Posicione o QR Code do cupom dentro da área
          </Text>

          {/* Scanner Frame */}
          <View className="relative w-64 h-64">
            {/* Corners */}
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl shadow-sm" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl shadow-sm" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl shadow-sm" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl shadow-sm" />
            
            {/* Scanning Line */}
            <View className="absolute inset-x-4 top-4 h-64 overflow-hidden">
               <Animated.View style={[{ height: 2, backgroundColor: '#3b82f6', shadowColor: '#3b82f6', shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 }, animatedStyle]} />
            </View>
          </View>

          <Text className="text-white/80 text-sm text-center mt-12 drop-shadow-sm">
            A câmera irá escanear automaticamente
          </Text>
        </View>

        {/* Manual Input Footer */}
        <View className="px-6 pb-8 pt-4 z-10">
           <TouchableOpacity 
             className="w-full bg-white py-4 rounded-xl items-center flex-row justify-center space-x-2 active:bg-gray-100 shadow-lg"
             onPress={() => console.log("Manual Input")}
           >
             <Icon name="keyboard-line" size={20} color="#1f2937" />
             <Text className="text-gray-900 font-semibold">Ou digite os dígitos do cupom</Text>
           </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}
