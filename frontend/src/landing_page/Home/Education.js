import React from 'react'

export default function Education() {
  return (
    <div className='container mt-5 mb-5' style={{marginRight:"450px"}}>
          <br /><br /><br />
        <div className='row'>
            <div className='col-4'>
                <img src="images/education.svg" alt="" />
            </div>
            <div className='col-2'>

            </div>
            <div className='col-6'>
              <h1>Free and open market education </h1>
              <p className='fs-4'>Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
              <a href="" className='me-2 text-decoration-none fs-4'>Varsity<i class="fa-solid fa-arrow-right-long"></i></a>
              <p className='fs-4'>TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>
              <a href="" className='me-2 text-decoration-none fs-4'>Trading Q&A<i class="fa-solid fa-arrow-right-long"></i></a>
            </div>
        </div>
    </div>
  )
}
