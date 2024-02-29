import { InputForm } from "@/components/Form";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { t } from "i18next";
import { Box, Button, Heading, Icon, VStack, useToast } from "native-base";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Register, useRegister } from '@/api/auth';
import Spinner from "@/components/helpers/Spinner";
const { width } = Dimensions.get("screen");
const ratio = (width * 0.8) / 270;

export default function register() {
  const logo = require("../assets/images/logo.png");
  const registerMutation = useRegister();
  const [show, setShow] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [errors, setErrors] = useState<Register>({});
  const [formData, setData] = useState<Register>({});
  const toast = useToast();

  const validate = (formData: any) => {
    if (formData.userName === undefined || formData.userName === "") {
      setErrors({ ...errors, userName: t('auth.required') });
      return false;
    } else if (formData.partyGovid === undefined || formData.partyGovid === "") {
      setErrors({ ...errors, partyGovid: t('auth.required') });
      return false;
    } else if (formData.email === undefined || formData.email === "") {
      setErrors({ ...errors, email: t('auth.required') });
      return false;
    } else if (formData.userPassword === undefined || formData.userPassword === "") {
      setErrors({ ...errors, userPassword: t('auth.required') });
      return false;
    } else if (formData.repeatPassword === undefined || formData.repeatPassword === "") {
      setErrors({ ...errors, repeatPassword: t('auth.required') });
      return false;
    } else if (formData.password !== formData.repeatPassword) {
      setErrors({ ...errors, repeatPassword: t('company.validations.passwordMatch') });
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    validate(formData) ? registerMutation.mutate(formData) : console.log('Validation Failed');
  };

  const onRegister = () => {
    router.back();
    toast.show({
      title: t('registerSuccessToast')
    })
  }

  return (
    <Box bgColor={"white"} safeArea flex={1} p={2} w="100%" padding='5' mx="auto">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Box alignSelf={"center"}>
        <Image source={logo} style={styles.logo} />
      </Box>

      <VStack alignSelf={"center"}>
        <Heading size="lg" color="blue.500">
          {t('auth.newUser')}
        </Heading>
      </VStack>
      {
        registerMutation.isPending ? (
          <Spinner />
        ) : registerMutation.isSuccess ? (
          onRegister()
        ) :
          (
            <ScrollView automaticallyAdjustKeyboardInsets>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <VStack space={2} mt={5}>
                  <InputForm
                    data={{
                      name: "userName",
                      errors,
                      title: t("name"),
                      value: formData.userName,
                      formData,
                      setData,
                      require: true,
                    }}
                  />
                  <InputForm
                    data={{
                      name: "partyGovid",
                      errors,
                      title: t("docId"),
                      value: formData.partyGovid,
                      formData,
                      setData,
                      require: true,
                    }}
                  />
                  <InputForm
                    data={{
                      name: "email",
                      errors,
                      title: t("email"),
                      value: formData.email,
                      formData,
                      setData,
                      require: true,
                      keyboardType: 'email-address'
                    }}
                  />
                  <InputForm
                    data={{
                      name: "phone",
                      errors,
                      title: t("phone"),
                      value: formData.phone,
                      formData,
                      setData,
                      require: true,
                      keyboardType: 'phone-pad'
                    }}
                  />

                  <InputForm
                    data={{
                      name: "userPassword",
                      errors,
                      title: t("password"),
                      value: formData.userPassword,
                      formData,
                      setData,
                      require: true,
                      type: show ? "text" : "password",
                      InputRightElement: (
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
                      )
                    }}
                  />
                  <InputForm
                    data={{
                      name: "repeatPassword",
                      errors,
                      title: t("repeatPassword"),
                      value: formData.repeatPassword,
                      formData,
                      setData,
                      require: true,
                      type: showRepeat ? "text" : "password",
                      InputRightElement: (
                        <Pressable onPress={() => setShowRepeat(!showRepeat)}>
                          <Icon
                            as={
                              <MaterialIcons
                                name={showRepeat ? "visibility" : "visibility-off"}
                              />
                            }
                            size={6}
                            mr="2"
                            color="muted.400"
                          />
                        </Pressable>
                      )
                    }}
                  />
                  <VStack space={2} mt={5}>
                    <Button bgColor={"blue.500"} rounded={"3xl"} onPress={onSubmit}>
                      {t('signUp')}
                    </Button>
                  </VStack>
                </VStack>
              </KeyboardAvoidingView>
            </ScrollView>
          )
      }

    </Box>
  )
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