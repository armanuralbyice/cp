import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./components/Router/AuthProvider";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <AuthProvider>
    <React.StrictMode>
      <App />
      <ToastContainer autoClose={3000} />
    </React.StrictMode>
  </AuthProvider>
);