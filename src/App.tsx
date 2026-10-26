import { Outlet } from 'react-router-dom';
import './App.css'
import { useContext } from 'react';
import { userContext } from './context/UserContext';
import { Toaster } from 'sonner';

function App() {
   const { loading } = useContext(userContext);

   if (loading) {
      return <p>טוען...</p>;
   }
   return <>
      <Toaster position="top-center" richColors dir="rtl" closeButton />
      <Outlet />
   </>;
}

export default App
