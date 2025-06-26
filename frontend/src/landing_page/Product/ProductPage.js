import React from 'react'
import Hero from './Hero'
import LeftImage from './LeftImage'
import RightImage from './RightImage'
import Universe from './Universe'

export default function ProductPage() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <LeftImage/>
      <RightImage/>
      <Universe/>
      <Footer/>
    </div>
  )
}
