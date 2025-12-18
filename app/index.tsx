import { useRouter } from "expo-router"; // 1. Importar o hook de rotas
import { View } from "react-native";
import "../global.css";
import OSMWebView from "./components/OSMWebView";

export default function Index() {
  const router = useRouter(); // 2. Inicializar o hook

  return (
    <View className="flex-1 bg-white">
      {/* -- MAPA NO FUNDO (Ocupa tudo) -- */}
      <View className="absolute inset-0 z-0">
        <OSMWebView />
      </View>
    </View>
  );
}
