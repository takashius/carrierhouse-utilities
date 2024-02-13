import { Stack as _Stack, useNavigation } from 'expo-router';
import { useGetForm, useSetForm } from '@/api/proposalService';
import Spinner from '@/components/helpers/Spinner';
import { Box, Heading, ScrollView } from 'native-base';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import RenderInputText from '@/components/RenderInputText';
import { useOptions } from '@/components/helpers/OptionsScreens';

export default function TabOneScreen() {
  const navigation = useNavigation();
  const responseQuery = useGetForm(160);
  const formMutation = useSetForm();
  const [formData, setData] = useState<any>({});
  const [fullData, setFullData] = useState<any>();

  const setDataInJson = (data: any) => {
    for (var i = 0; i < fullData.declarations.length; i++) {
      if (fullData.declarations[i].id == data.id) {
        switch (fullData.declarations[i].type) {
          case 1:
          case 8:
            fullData.declarations[i].stringValue = data.value;
            break;
          case 5:
          case 9:
          case 18:
            fullData.declarations[i].intValue = parseInt(data.value);
            break;
        }
      }
    }
  };

  useEffect(() => {
    if (responseQuery.isSuccess) {
      setFullData(responseQuery.data);
    }
  }, [responseQuery.isSuccess])

  useEffect(() => {
    if (formMutation.isSuccess) {
      setFullData(formMutation.data);
    }
  }, [formMutation.isSuccess])

  const saveAction = () => {
    let keys = Object.keys(formData);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      setDataInJson(formData[key]);
    }
    formMutation.mutate(fullData);
  }

  return (
    <Box bg="white" safeArea flex="1" p="2">
      <_Stack.Screen options={useOptions({
        title: "Mascotas",
        navigation,
        save: true,
        saveAction
      })} />
      {responseQuery.isPending || formMutation.isPending ? <Spinner /> :
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled>
          <Heading size="md" color={"purple.500"}>Mascotas</Heading>
          <ScrollView marginBottom={6}>
            {fullData?.declarations
              .sort((a: any, b: any) => a.sequence - b.sequence)
              .map((item: any) => RenderInputText(item, formData, setData))}
          </ScrollView>
        </KeyboardAvoidingView>
      }
    </Box>
  );
}
