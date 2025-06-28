import React from 'react'

export default function Stats() {
  return (
    <div className='container p-5' style={{marginRight:"520px"}}>
        <div className='row '>
            <div className='col-6 p-5'>
                <h1 className='mb-5'>Trust with confidence</h1>
                <br />
                <h3 className='mt-1'>Customer-first always</h3>
                <p className='fs-5 text-muted'>That's why 1.6+ crore customers trust StockFolio with ~ ₹6 lakh crores of equity investments and contribute to 15% of daily retail exchange volumes in India.</p>
                
                <h3 className='mt-5'>No spam or gimmicks</h3>
                <p className='fs-5 text-muted'>No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like. Our philosophies.</p>
                
                <h3 className='mt-5'>The StockFolio universe</h3>
                <p className='fs-5 text-muted'>Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.</p>
                
                <h3 className='mt-5'>Do better with money</h3>
                <p className='fs-5 text-muted'>With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, but actively help you do better with your money.</p>
                
            </div>
            <div className='col-6'>
                <img src="images/ecosystem.png" alt="" style={{width:"130%"}} />
                <div className='text-center'>
                    <a href="" className='me-2 text-decoration-none'>Explore Our Products <i class="fa-solid fa-arrow-right-long"></i></a>
                    <a href="" className='text-decoration-none'>Try Kite Demo</a>
                </div>
            </div>
        </div>
        <img src="images/pressLogos.png" alt="" style={{marginLeft:"200px",width:"90%"}} className='mb-5'/>
    </div>
  )
}
