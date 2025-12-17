import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router"; // 1. Importar o hook de rotas
import { Text, View } from "react-native";
import "../global.css";

export default function Index() {
  const router = useRouter(); // 2. Inicializar o hook

  return (
    <View
      className="bg-red-500"
    >
      <Text>Edit app/index.tsx to edit bla this screen.</Text>
      <Button 
        onPress={() => router.push("/park/check-in")} // 3. Ação de navegar
      >
        Ir para Check-in
      </Button>
    </View>
  );
}
