import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Main from '../../src/navigation/Main.navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';


const index = () => {

  const queryClient = new QueryClient();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Main />
        <Toast />
      </QueryClientProvider>
    </SafeAreaView>
  )
}

export default index