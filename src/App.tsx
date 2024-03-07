import React from 'react';
import logo from './logo.svg';
import './App.css';
import TodoApp from './components/todoApp';
import Normaluserform from './components/normalForm';
import FomikForm from './components/formikForm';
import { QueryClient, QueryClientProvider } from 'react-query';
import DisplayProduct from './components/DisplayProduct';

const queryClient = new QueryClient;
function App() {
  return (
    <TodoApp/>
    // <Normaluserform/>
    // <QueryClientProvider client={queryClient}>
    //   {/* <FomikForm />   */}
    //   <div>
    //   <DisplayProduct/>
    //   </div>
    // </QueryClientProvider>


  );
}

export default App;
