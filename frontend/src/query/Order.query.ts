import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderPayload {
  delivery_type: string;
  address?: string;
  delivery_time?: string;
  vehicle_color?: string;
  vehicle_model?: string;
}

const createOrder = async (data: OrderPayload) => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) throw new Error('No token found');

  const response = await axios.post(
    'http://192.168.18.54:8080/api/v1/orders',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log("replajldfjlajfdlasjfjalsfdjklsaf",response.data)
  return response.data;
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};
