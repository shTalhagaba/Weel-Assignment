import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import SignIn from '../screens/Auth/Signin/Signin';
import DeliveryPreference from '../screens/Main/DeliveryPreference/DeliveryPreference';
import SummaryDetail from '../screens/Main/SummaryDetail.tsx/SummaryDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../utils/Colors';

const Stack = createNativeStackNavigator();

const Main = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Token:', token);
        if (token) {
          setInitialRoute('DeliveryPreference');
        } else {
          setInitialRoute('SignIn');
        }
      } catch (e) {
        console.error('Failed to fetch token', e);
        setInitialRoute('SignIn');
      }
    };

    checkToken();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.BLUE}/>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="DeliveryPreference" component={DeliveryPreference} />
      <Stack.Screen name="SummaryDetail" component={SummaryDetail} />
    </Stack.Navigator>
  );
};

export default Main;
