import React from 'react'

export default function Pricing() {
  return (
    <div className='container mt-5 mb-5' style={{marginRight:"450px"}}>
        <div className='row'>
            <div className='col-4'>
                <h1 className='mb-3'>Unbeatable Pricing</h1>
                <p>We pioneered the concept of discount broking and price transparency in India. Flat fees and no hidden charges.</p>
                <a href="" className='me-2 text-decoration-none fs-4 '>See Pricing<i class="fa-solid fa-arrow-right-long"></i></a>
            </div>
            <div className='col-1'>

            </div>
            <div className='col-7'>
              <div className='row'>
                <div className='col-2'>
              <img src="images/pricingEquity.svg" alt="" style={{width:"130%"}}/>
              </div>
              <div className='col-2'>
               <p className='mt-4'>free account opening</p>
               </div>
               <div className='col-2'>
                  <img src="images/pricingEquity.svg" alt="" style={{width:"130%"}}/>
               </div>
               <div className='col-2' style={{fontSize:"15px"}}>
                  <p className='mt-3'>Free equity delivery and direct mutual funds</p>
               </div>
               <div className='col-2'>
                    <img src="images/intradayTrades.svg" alt="" style={{width:"130%"}}/>
               </div>
               <div className='col-2'>
                    <p className='mt-4'>Intraday and F&O</p>
               </div>
               </div>
            </div>
        </div>
    </div>
  )
}
