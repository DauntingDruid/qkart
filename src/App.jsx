import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import ipConfig from './ipConfig.json';
import Login from './components/Login';
import Products from './components/Products';
import Checkout from './components/Checkout';
import Thanks from './components/Thanks';

export const config = {
  endpoint: `https://qkart-backend-dauntingdruid.onrender.com/api/v1`,
};

function App() {
  console.log('ROUTING');
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/thanks" element={<Thanks />} />
    </Routes>
  );
}

export default App;
