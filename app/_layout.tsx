import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import "../global.css";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
  <View className="flex-1" style={{ paddingTop: insets.top }}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
    </Stack>
  </View>
  );
}
