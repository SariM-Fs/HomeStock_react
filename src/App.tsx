import { Outlet } from 'react-router-dom';
import './App.css'
import { useContext } from 'react';
import { userContext } from './context/UserContext';

function App() {
   const { loading } = useContext(userContext);

   if (loading) {
      return <p>טוען...</p>;
   }
   return <Outlet />;
}

export default App
