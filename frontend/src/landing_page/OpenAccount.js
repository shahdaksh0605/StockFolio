import React from 'react'
import {Link} from "react-router-dom"

export default function OpenAccount() {
  return (
    <div className='container text-center mt-5'>
       <br /><br /><br /> 
        <div className='row'>
            <h1 className='mb-3'>Open a StockFolio account</h1>
            <p className='fs-4 mb-3'>Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
            <Link to="/signup"><button className='btn btn-dark w-25 p-3 mb-5' style={{marginLeft:"40px",marginTop:"20px"}}>Sign Up for Free</button></Link>
        </div>
    </div>
  )
}
