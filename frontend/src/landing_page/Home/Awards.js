import React from 'react'

export default function Awards() {
  return (
    <div className='mt-5'>
        <div className='row'>
            <div className='col-lg-6 col-sm-12 p-5'>
                <img src="/images/largestBroker.svg" alt="Broker award" style={{width:"90%"}} />
            </div>
            <div className='col-lg-6 col-sm-12 p-5'>
                <h1 className='mb-4'>Largest Stock Broker in India</h1>
                <p className='mb-4'><b>2+ million StockFolio clients contribute to over 10% of all retail order volumes in India day by trading and investing in:</b></p>
                <div className='row mb-4'>
                    <div className='col-6'>
                        <ul>
                            <li><p><b>Futures and Options</b></p></li>
                            <li><p><b>Commodity derivatives</b></p></li>
                            <li><p><b>Currency derivatives</b></p></li>
                        </ul>
                    </div>
                    <div className='col-6'>
                        <ul>
                            <li><p><b>Stocks and IPOs</b></p></li>
                            <li><p><b>Direct Mutual Funds</b></p></li>
                            <li><p><b>Bonds and Govt. Securities</b></p></li>
                        </ul>
                    </div>
                </div>
                <img src="images/pressLogos.png" alt="" />
            </div>
        </div>
    </div>
  )
}
