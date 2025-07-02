import React from 'react'
import Awards from './Awards'
import Education from './Education'
import Pricing from './Pricing'
import Hero from './Hero'
import OpenAccount from '../OpenAccount'

export default function Homepage() {
  return (
    <div>
      <Hero/>
      <Awards/>
      <Pricing/>
      <Education/>
      <OpenAccount/> 
    </div>
  )
}
