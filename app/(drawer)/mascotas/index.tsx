import { Stack as _Stack } from 'expo-router';
import { useGetForm } from '@/api/proposalService';
import Spinner from '@/components/helpers/Spinner';
import { Box, Heading, ScrollView, Stack, Text } from 'native-base';
import { InputForm, SelectDropdownForm } from '@/components/Form';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function TabOneScreen() {
  const responseQuery = useGetForm(160);
  const [formData, setData] = useState();
  const [fullData, setFullData] = useState<any>();

  useEffect(() => {
    if (responseQuery.isSuccess) {
      setFullData(responseQuery.data);
    }
  }, [responseQuery.isSuccess])

  const renderInputText = (item: any) => {
    switch (item.type) {
      case 1:
      case 5:
        if (item.visibility != 3)
          return (
            <Stack space={2} pb="2">
              <InputForm
                data={{
                  name: item.name,
                  title: item.description,
                  placeholder: item.description,
                  keyboardType: item.type == 1 ? "default" : "number-pad",
                  value: item.type == 1 ? item.stringValue : item.intValue,
                  formData,
                  setData,
                  require: !item.nullable,
                }}
              />
            </Stack>
          )
        break;
      case 8:
      case 9:
        let sortedValues = item.values.sort((p1: any, p2: any) =>
          p1.code > p2.code ? 1 : p1.code < p2.code ? -1 : 0
        );
        if (item.visibility != 3)
          return (<Stack space={2} pb="2">
            <SelectDropdownForm
              data={{
                name: "master",
                selectData: sortedValues,
                search: false,
                title: item.description,
                placeholder: item.description,
                value: item.type == 8 ? item.stringValue : item.intValue,
                require: true,
                formData,
                setData
              }} />
          </Stack>)
    }
  }

  return (
    <Box bg="white" safeArea flex="1" p="2">
      <_Stack.Screen options={{ headerShown: false }} />
      {responseQuery.isPending ? <Spinner /> :
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled>
          <Heading size="md" color={"purple.500"}>Mascotas</Heading>
          <ScrollView marginBottom={6}>
            {fullData?.declarations
              .sort((a: any, b: any) => a.sequence - b.sequence)
              .map((item: any) => renderInputText(item))}
          </ScrollView>
        </KeyboardAvoidingView>
      }
    </Box>
  );
}
