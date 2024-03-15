import React from 'react';
import logo from './logo.svg';
import './App.css';
import TodoApp from './components/TodoApp';
import Normaluserform from './components/NormalForm';
import FomikForm from './components/FormikForm';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CounterOne from './components/CounterOne';
import DataFetching from './components/DataFetching';

const queryClient = new QueryClient;
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp/>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {/* <CounterOne /> */}
      {/* <DataFetching /> */}
    </QueryClientProvider>
  );
}

export default App;
