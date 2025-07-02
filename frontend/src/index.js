import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter,Routes,Route,} from "react-router-dom"
import Homepage from './landing_page/Home/Homepage';
import Signup from './landing_page/Signup/Signup';
import About from './landing_page/About/Aboutpage';
import Pricing from './landing_page/Pricing/PricingPage';
import Support from './landing_page/Support/Supportpage';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import Notfound from './landing_page/NotFound';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Navbar/>
    <Routes>
      <Route path='/' element={<Homepage/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/pricing' element={<Pricing/>}></Route>
      <Route path='/support' element={<Support/>}></Route>
      <Route path='*' element={<Notfound/>}></Route>
    </Routes>
    <Footer/>
  </BrowserRouter>
);
