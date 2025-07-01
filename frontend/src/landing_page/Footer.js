import React from 'react'

export default function Footer() {
  return (
    <footer    className='mx-auto border-top' style={{width:"98%",backgroundColor:"rgb(245,245,245)"}}>
          <div className='row mt-5'>
            <div className='col'>
                <img src="images/StockFolio.png" alt="" style={{width:"50%"}} />
                <p>&copy; 2020-2025,Not StockFolio Broking LTD. <br />All rights reserved</p>
            </div>
            <div className='col'>
              <p className='fs-4'>Company</p>
              <a href="" className='text-decoration-none text-dark fs-5'>About</a><br/><br />
              <a href="" className='text-decoration-none text-dark fs-5'>Products</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>Pricing</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>Referral Programm</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>Careers</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>StockFolio.Tech</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>Press & Media</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>StockFolio cares</a><br /><br />
            </div>
            <div className='col'>
              <p className='fs-4'>Support</p>
              <a href="" className='text-decoration-none text-dark fs-5'>Contact</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>Support Portal</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>S-connect Blog</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>List of Charges</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>Downloads and Resources</a><br /><br />
            </div>
            <div className='col'>
              <p className='fs-4'>Account</p>
              <a href="" className='text-decoration-none text-dark fs-5'>Open a Account</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>Fund Transfer</a><br /><br />
              <a href="" className='text-decoration-none text-dark fs-5'>S60 Days Challenge</a><br /><br />
            </div>
          </div> 
    </footer>
  )
}
