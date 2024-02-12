import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Stack } from 'expo-router';
import { useLogin } from '@/api/auth';
import { Button, Icon } from 'native-base';
import { useEffect } from 'react';
import { write } from '@/components/helpers/LocalStorage';
import { Ionicons } from '@expo/vector-icons';

export default function TabOneScreen() {
  const responseQuery = useLogin("Erick", "Erick2023");
  useEffect(() => {
    const response = responseQuery.data;
    if (response) {
      write("userToken", response).then((res) => res);
    }
  }, [responseQuery.isSuccess]);
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Bienvenido a CarrierHouse</Text>
      <Button leftIcon={<Icon as={Ionicons} name="reload" size="sm" />} mt={5} color={'purple.400'} bgColor={'purple.600'} onPress={() => responseQuery.refetch()}>
        Reload Token
      </Button>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
