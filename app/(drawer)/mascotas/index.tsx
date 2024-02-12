import { Stack as _Stack } from 'expo-router';
import { useGetForm } from '@/api/proposalService';
import Spinner from '@/components/helpers/Spinner';
import { Box, Heading, ScrollView, Stack, Text } from 'native-base';
import { InputForm, SelectDropdownForm } from '@/components/Form';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import RenderInputText from '@/components/RenderInputText';

export default function TabOneScreen() {
  const responseQuery = useGetForm(160);
  const [formData, setData] = useState();
  const [fullData, setFullData] = useState<any>();

  useEffect(() => {
    if (responseQuery.isSuccess) {
      setFullData(responseQuery.data);
    }
  }, [responseQuery.isSuccess])

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
              .map((item: any) => RenderInputText(item, formData, setData))}
          </ScrollView>
        </KeyboardAvoidingView>
      }
    </Box>
  );
}
