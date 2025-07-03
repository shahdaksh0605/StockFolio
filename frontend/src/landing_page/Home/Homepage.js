import React from 'react'
import Awards from './Awards'
import Education from './Education'
import Pricing from './Pricing'
import Hero from './Hero'
import OpenAccount from '../OpenAccount'
import Navbar from '../Navbar'
import Footer from '../Footer'

export default function Homepage() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Awards/>
      <Pricing/>
      <Education/>
      <OpenAccount/>
      <Footer/>
    </div>
  )
}
