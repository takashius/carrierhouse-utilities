import { Stack as _Stack, useNavigation } from 'expo-router';
import { useGetForm } from '@/api/proposalService';
import Spinner from '@/components/helpers/Spinner';
import { Box, Heading, ScrollView } from 'native-base';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import RenderInputText from '@/components/RenderInputText';
import { useOptions } from '@/components/helpers/OptionsScreens';

export default function TabOneScreen() {
  const navigation = useNavigation();
  const responseQuery = useGetForm(160);
  const [formData, setData] = useState();
  const [fullData, setFullData] = useState<any>();

  useEffect(() => {
    if (responseQuery.isSuccess) {
      setFullData(responseQuery.data);
    }
  }, [responseQuery.isSuccess])

  const saveAction = () => {
    alert('Guardando')
  }

  return (
    <Box bg="white" safeArea flex="1" p="2">
      <_Stack.Screen options={useOptions({
        title: "Mascotas",
        navigation,
        save: true,
        saveAction
      })} />
      {responseQuery.isPending ? <Spinner /> :
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
