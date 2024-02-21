import { Stack as _Stack, useNavigation } from 'expo-router';
import { useGetForm, useSetForm } from '@/api/proposalService';
import Spinner from '@/components/helpers/Spinner';
import { Box, Heading, ScrollView } from 'native-base';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import RenderInputText from '@/components/RenderInputText';
import { useOptions } from '@/components/helpers/OptionsScreens';
import { usePartyStructure, usePartyDeclarations } from '@/api/partyService';

export default function TabOneScreen() {
  const navigation = useNavigation();
  const responseQuery = useGetForm(160);
  const formMutation = useSetForm();
  const thirdMutation = usePartyStructure();
  const declarationsMutation = usePartyDeclarations();
  const [showError, setShowError] = useState<Boolean>(false);
  const [thirdSection, setThirdSection] = useState<Boolean>(false);
  const [formData, setData] = useState<any>({});
  const [required, setRequired] = useState<any>({});
  const [fullData, setFullData] = useState<any>();
  const [thirdData, setThirdData] = useState<any>();
  const [errors, setErrors] = useState<any>({});

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
    if (thirdMutation.isSuccess) {
      declarationsMutation.mutate();
    }
  }, [thirdMutation.isSuccess])

  useEffect(() => {
    if (declarationsMutation.isSuccess) {
      let thirdResponse = thirdMutation.data;
      thirdResponse.declarations = declarationsMutation.data;
      setData({});
      setThirdSection(true);
      setThirdData(thirdResponse)
    }
  }, [declarationsMutation.isSuccess])

  useEffect(() => {
    if (formMutation.isSuccess) {
      if (showError) {
        const data = formMutation.data;
        if (data.messages.length > 0) {
          let messages = '';
          data.messages.map((message: { description: string; }) => {
            messages += message.description + '\n';
          });
          Alert.alert('Error', messages, [{ text: 'OK' }]);
          setFullData(formMutation.data);
        } else {
          thirdMutation.mutate();
        }
      } else {
        setShowError(true);
        setFullData(formMutation.data);
      }
    }
  }, [formMutation.isSuccess])

  const validate = () => {
    let keys = Object.keys(required);
    for (let i = 0; i < keys.length; i++) {
      if (required[keys[i]] === '' || required[keys[i]] === undefined) {
        if (formData[keys[i]] === undefined) {
          setErrors({
            ...errors,
            [keys[i]]: 'Campo requerido'
          });
          return false;
        } else {
          delete errors[keys[i]];
        }
      } else {
        delete errors[keys[i]];
      }
    }
    return true;
  }

  const formatThirdData = () => {
    const dataParty: any = {
      status: 0,
      gender: 2,
      taxstype: 1,
      birthday: "2023/11/14",
      relationship: 8,
      names: [],
      thpdecls: [],
      certs: [],
    };
    let keys = Object.keys(formData);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      switch (formData[key].groupInput) {
        case 'partyName':
          dataParty.names.push({
            code: formData[key].id,
            description: formData[key].value.toUpperCase(),
          });
          break;
        case 'partyCert':
          dataParty.certs.push({
            code: formData[key].id,
            description: formData[key].value.toUpperCase(),
          });
          break;
        case 'partyDeclaration':
          dataParty.thpdecls.push({
            code: formData[key].id,
            description: formData[key].value.toUpperCase(),
          });
          break;
      }
    }
    return dataParty;
  }

  const saveAction = () => {
    if (validate()) {
      let keys = Object.keys(formData);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        setDataInJson(formData[key]);
      }
      if (thirdSection) {
        formatThirdData();
      } else {
        formMutation.mutate(fullData);
      }
      setRequired({});
      setData({});
    }
  }

  const requiredDefault = (item: any) => {
    if (!item.nullable && item.visibility != 3) {
      switch (item.type) {
        case 1:
        case 5:
          required[item.name] = item.type == 1 ? item.stringValue : item.intValue;
          break;
        case 8:
        case 9:
          required[item.name] = item.type == 8 ? item.stringValue : item.intValue;
          break;
      }
    }
  }

  const renderThird = () => {
    const docId = {
      defaultValue: "",
      visibility: 1,
      description: "Cédula de Ciudadanía",
      nullable: false,
      name: 10,
      id: 10,
      type: 1,
    };
    requiredDefault(docId);
    return (
      <>
        {thirdData?.nameStructure
          .sort((a: any, b: any) => a.sequence - b.sequence)
          .map((item: any) => {
            const structure = {
              defaultValue: "",
              visibility: 1,
              description: item.title,
              nullable: !item.isRequired,
              name: item.code,
              id: item.code,
              type: 1
            };
            requiredDefault(structure);
            return RenderInputText(structure, formData, setData, errors, 'partyName');
          })}
        {RenderInputText(docId, formData, setData, errors, 'partyCert')}
        {thirdData?.declarations
          .sort((a: any, b: any) => a.sequence - b.sequence)
          .map((item: any) => {
            const structure = {
              defaultValue: "",
              visibility: 1,
              description: item.description,
              nullable: item.description == "Correo Electronico" ? false : true,
              name: item.code,
              id: item.code,
              type: 1
            };
            requiredDefault(structure);
            return RenderInputText(structure, formData, setData, errors, 'partyDeclaration');
          })}
      </>
    )
  }

  return (
    <Box bg="white" safeArea flex="1" p="2">
      <_Stack.Screen options={useOptions({
        title: "Mascotas",
        navigation,
        save: true,
        saveAction
      })} />
      {responseQuery.isPending || formMutation.isPending || declarationsMutation.isPending || thirdMutation.isPending ? <Spinner /> :
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled>
          <Heading size="md" color={"purple.500"}>Mascotas</Heading>
          <ScrollView marginBottom={6}>
            {thirdSection ?
              renderThird()
              :
              fullData?.declarations
                .sort((a: any, b: any) => a.sequence - b.sequence)
                .map((item: any) => {
                  requiredDefault(item);
                  return (RenderInputText(item, formData, setData, errors))
                })
            }
          </ScrollView>
        </KeyboardAvoidingView>
      }
    </Box>
  );
}
