import React from 'react'
import Awards from './Awards'
import Education from './Education'
import Pricing from './Pricing'
import Hero from './Hero'
import Stats from './Stats'
import OpenAccount from '../OpenAccount'
import Navbar from '../Navbar'
import Footer from '../Footer'

export default function Homepage() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Awards/>
      <Stats/>
      <Pricing/>
      <Education/>
      <OpenAccount/> 
      <Footer/>
    </div>
  )
}
