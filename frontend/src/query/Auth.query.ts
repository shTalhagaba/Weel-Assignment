import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.18.54:8080/api/v1/'

export const Login = async (body: any) => {
    try {
        const response = await axios.post(`${BASE_URL}auth/login`, body);

        await AsyncStorage.setItem('userToken', response.data.token);
        console.log('Login successful:', response.data.token);
        return response.data.user;

    } catch (error: any) {
        console.error('Login error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
