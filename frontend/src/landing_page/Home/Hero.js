import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className='mb-5'>
        <div className='row text-center'>
                <img src="images/homeHero.png" alt="Hero Image" className='mb-5'/>
                <h1 className='mt-5'>Invest in everything</h1>
                <p>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
                 <Link to="/signup"> <button  style={{width:"150px",borderRadius:"15px"}} className='btn btn-dark m-auto mb-5'>Sign up</button></Link>
        </div>
    </div>
  )
}
