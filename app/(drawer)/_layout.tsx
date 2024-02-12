import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/CustomDrawer";
import { Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { ReactNode } from "react";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        drawerType: "slide",
        drawerStyle: {
          flex: 1,
          width: "70%",
          borderRightWidth: 0,
          backgroundColor: "#9333ea",
        },
        headerStyle: {
          backgroundColor: "#9333ea",
        },
        headerTintColor: "white",
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="home"
        options={{
          headerShown: false,
          drawerLabel: 'Home',
          title: 'Home',
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "white",
          drawerIcon: ({ focused, size }): ReactNode => (
            <Icon
              as={<MaterialIcons name="home" />}
              size={6}
              color={"white"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="mascotas"
        options={{
          headerShown: false,
          drawerLabel: 'Mascotas',
          title: 'Mascotas',
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "white",
          drawerIcon: ({ focused, size }): ReactNode => (
            <Icon
              as={<MaterialIcons name="pets" />}
              size={6}
              color={"white"}
            />
          ),
        }}
      />
    </Drawer>
  );
}
