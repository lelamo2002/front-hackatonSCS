import { Tabs } from "expo-router";
import Icon from "react-native-remix-icon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6", // blue-500
        tabBarInactiveTintColor: "#6b7280", // gray-500
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb", // gray-200
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Estacionar",
          tabBarIcon: ({ color }) => (
            <Icon name="car-line" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="credits"
        options={{
          title: "Crédito",
          tabBarIcon: ({ color }) => (
            <Icon name="wallet-line" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="benefits"
        options={{
          title: "Benefícios",
          tabBarIcon: ({ color }) => (
            <Icon name="gift-line" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
