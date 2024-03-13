import React from 'react';
import logo from './logo.svg';
import './App.css';
import TodoApp from './components/TodoApp';
import Normaluserform from './components/NormalForm';
import FomikForm from './components/FormikForm';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient;
function App() {
  return (
    <TodoApp/>
  );
}

export default App;
