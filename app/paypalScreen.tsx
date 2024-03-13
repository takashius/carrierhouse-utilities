import Spinner from "@/components/helpers/Spinner";
import { router } from "expo-router";
import { Box, Text } from "native-base";
import { SetStateAction, useEffect, useState } from "react";
import { Alert } from "react-native";
import WebView from "react-native-webview";

export default function paypalScreen() {
  const [accessToken, setToken] = useState();
  const [approvalUrl, setApprovalUrl] = useState<string | null>();

  var fetch = require('node-fetch');
  const dataDetail = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    transactions: [{
      amount: {
        "total": "57.25",
        "currency": "USD",
        "details": {
          "subtotal": "57.25",
          "tax": "0.00",
          "shipping": "0.00",
          "handling_fee": "0.00",
          "shipping_discount": "0.00",
          "insurance": "0.00"
        }
      },
      description: "The payment transaction description.",
    }],
    redirect_urls: {
      return_url: 'https://mascotas.carrierhouse.us/checkout.php',
      cancel_url: 'https://mascotas.carrierhouse.us'
    }
  };

  useEffect(() => {
    fetch('https://api.sandbox.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer A21AAK-bKVminRh9tAGjgomShMCejrjFJJFRWiitP0mff5i4f6GGGhJCeTVkihszoW3YudQrYkLcBve3YCRkyiGse2JWLrlDw'
        },
        body: 'grant_type=client_credentials'
      })
      .then((res: { json: () => any; }) => res.json())
      .then((response: { access_token: SetStateAction<undefined>; }) => {
        setToken(response.access_token);

        fetch('https://api.sandbox.paypal.com/v1/payments/payment',
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${response.access_token}`
            },
            body: JSON.stringify(dataDetail)
          })
          .then((res: { json: () => any; }) => res.json())
          .then((response: { id: any; links: any; }) => {
            console.log('RESPONSE', response)
            const { links } = response;
            const approvalUrl = links?.find((data: any) => data.rel == 'approval_url');
            setApprovalUrl(approvalUrl.href);
          })
          .catch((error: any) => {
            console.log('https://api.sandbox.paypal.com/v1/payments/payment', error);
          })
      })
      .catch((error: any) => {
        console.log('https://api.sandbox.paypal.com/v1/oauth2/token', error);
      })
  }, [])

  const onNavigationStateChange = (webViewState: any) => {
    console.log('webViewState', webViewState);
    if (webViewState.url.includes('https://mascotas.carrierhouse.us')) {
      setApprovalUrl(null);

      const paramStream = webViewState.url.split('?');
      const params = paramStream[1].split('&');
      const paymentId = params[0].split('=')[1];
      const PayerID = params[2].split('=')[1];

      fetch(`https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
        {
          method: 'post',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ "payer_id": PayerID })
        })
        .then((res: { json: () => any; }) => res.json())
        .then((response: any) => {
          console.log('RESPONSE PAYER', JSON.stringify(response, null, 2));
          setApprovalUrl(null);
          if (response.state == 'approved') {
            Alert.alert('Pago procesado exitosamente!.', '', [{
              text: 'OK', onPress() {
                router.back();
              },
            }]);
          } else if (response.name == 'DUPLICATE_TRANSACTION') {
            Alert.alert(response.message, '', [{
              text: 'OK', onPress() {
                router.back();
              },
            }]);
          } else if (response.name == 'INVALID_RESOURCE_ID') {
            Alert.alert(response.message, '', [{
              text: 'OK', onPress() {
                router.back();
              },
            }]);
          } else {
            Alert.alert('Error procesando el pago, intente nuevamente', '', [{
              text: 'OK', onPress() {
                router.back();
              },
            }]);
          }
        })
        .catch((error: any) => {
          console.log('https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute', error);
          Alert.alert('Error procesando el pago, intente nuevamente', '', [{
            text: 'OK', onPress() {
              router.back();
            },
          }]);
        })
    }
  }

  return (
    <Box bgColor={"white"} flex={1}>
      {
        approvalUrl ? <WebView
          style={{ height: '100%', width: '100%', marginTop: 40 }}
          source={{ uri: approvalUrl }}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
        />
          :
          <Box bgColor={"white"} flex={1} justifyContent={"center"}>
            <Text alignSelf={"center"} color={"black"} fontSize={24}>No not press back or refresh page</Text>
            <Spinner />
          </Box>
      }
    </Box>
  );
}