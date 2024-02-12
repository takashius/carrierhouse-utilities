import * as React from "react";
import { ImageBackground, StyleSheet } from "react-native";
const bg = require("../assets/images/bg.jpg");
import { Box, Center, Avatar, Text, Icon } from "native-base";
import { Image, Dimensions, View } from "react-native";
const { width } = Dimensions.get("screen");
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  DrawerItemList,
  DrawerItem,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { t } from "i18next";
const ratio = (width * 0.4) / 270;

const CustomDrawer = (props: any) => {
  return (
    <Box flex={1}>
      <ImageBackground source={bg} resizeMode="cover" style={styles.image}>
        <DrawerContentScrollView {...props}>
          <Center>
          </Center>
          <Box marginTop={5}>
            <DrawerItemList {...props} />
          </Box>
        </DrawerContentScrollView>
        <View
          style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}
        >
        </View>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
  logo: {
    width: width * 0.4,
    height: 100 * ratio,
    resizeMode: "contain",
    marginBottom: 15,
  },
});

export default CustomDrawer;
