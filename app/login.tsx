import Spinner from "@/components/helpers/Spinner";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Box, Button, Heading, Icon, Input } from "native-base";
import { useEffect, useState } from "react";
import { Pressable, Image, StyleSheet, Dimensions, Alert } from "react-native";
import { useLogin } from '@/api/auth';
import { t } from "i18next";
const { width } = Dimensions.get("screen");
const ratio = (width * 0.8) / 270;

export default function login() {
  const loginMutation = useLogin();
  const logo = require("../assets/images/logo.png");
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitForm = () => {
    if (!username || !password)
      return Alert.alert("Error", "Los campos son obligatorios");
    loginMutation.mutate({ pharosUser: username, userPassword: password });
  };

  useEffect(() => {
    if (loginMutation.isError) {
      return Alert.alert("Error", "Usuario o clave incorrectos");
    }
  }, [loginMutation.isError])

  useEffect(() => {
    if (loginMutation.isSuccess) {
      router.replace("/(drawer)/mascotas");
    }
  }, [loginMutation.isSuccess])

  const renderBodyLogin = () => (
    <Box>
      <Box alignSelf={"center"} marginTop={10}>
        <Heading size="lg" color="blue.500">
          {t('welcome')}
        </Heading>
      </Box>
      <Box marginTop={"1"} p="10" pb={4} pt={10}>
        <Input
          variant="underlined"
          onChangeText={setUsername}
          size="lg"
          placeholder="Username"
          keyboardType="email-address"
          InputRightElement={
            <Icon
              as={<MaterialIcons name="person" />}
              size={7}
              ml="2"
              color="muted.400"
            />
          }
        />
      </Box>
      <Box marginTop={"1"} p="10" pb={4} pt={4}>
        <Input
          variant="underlined"
          size="lg"
          onChangeText={setPassword}
          placeholder="Password"
          type={show ? "text" : "password"}
          InputRightElement={
            <Pressable onPress={() => setShow(!show)}>
              <Icon
                as={
                  <MaterialIcons
                    name={show ? "visibility" : "visibility-off"}
                  />
                }
                size={6}
                mr="2"
                color="muted.400"
              />
            </Pressable>
          }
        />
      </Box>
      <Box paddingX={20} marginTop={9}>
        <Button bgColor={"blue.500"} rounded={"3xl"} onPress={() => submitForm()}>
          Login
        </Button>
      </Box>
      <Box paddingX={20} marginTop={2}>
        <Button rounded={"3xl"} onPress={() => router.push('/register')}>{t('register')}</Button>
      </Box>
    </Box>
  )

  return (
    <Box bgColor={"white"} flex={1}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Box marginTop={"12"} alignSelf={"center"}>
        <Image source={logo} style={styles.logo} />
      </Box>
      {loginMutation.isPending ? <Spinner /> : renderBodyLogin()}
    </Box>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: width * 0.8,
    height: 100 * ratio,
    resizeMode: "contain",
  },
  spinner: {
    marginBottom: 50,
  },
});