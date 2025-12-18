import { Stack } from "expo-router";
import { LogBox, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import "../global.css";

// Ignore all logs for demo purposes
LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
  <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
    </Stack>
  </View>
  );
}
