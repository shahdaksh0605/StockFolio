import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from './landing_page/Home/Homepage';
import Signup from './landing_page/Signup/Signup';
import Login from './components/auth/login/login';
import About from './landing_page/About/Aboutpage';
import Pricing from './landing_page/Pricing/PricingPage';
import Support from './landing_page/Support/Supportpage';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import Notfound from './landing_page/NotFound';
import Home from './Dashboard/Home';

import { AuthProvider } from './context/authcontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Home />} />

          <Route path='/about' element={<About />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/support' element={<Support />} />
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
