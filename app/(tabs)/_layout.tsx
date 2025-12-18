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
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon name="home-line" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color }) => (
            <Icon name="search-line" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Icon name="user-line" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
