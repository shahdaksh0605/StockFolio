import React, { useState,useContext,useEffect } from "react";

import { Tooltip, Grow } from '@mui/material';
import {BarChartOutlined,KeyboardArrowDown,KeyboardArrowUp, MoreHoriz} from '@mui/icons-material'
import GeneralContext from "./GeneralContext";
import { watchlist, holdings, positions } from "../data/data";
import useStockPrices from "../useStockprice";

const allSymbols = Array.from(new Set([
    ...watchlist.map(item => item.name),
    ...holdings.map(item => item.name),
    ...positions.map(item => item.name)
  ]));

const WatchList = () => {
    const prices = useStockPrices();

    useEffect(() => {
        console.log("Sending symbols to backend:", allSymbols);
    
        fetch("http://localhost:5000/setwatchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbols: allSymbols })
        })
        .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(data => console.log("Backend acknowledged:", data))
        .catch(err => console.error("Failed to send symbols:", err));
    }, []);

    return (
        <div className="p-3 bg-light rounded w-50 m-0">
            <div className="input-group">
                <input type="text" name="search" id="search" className="form-control"
                    placeholder="Search eg: infy, bse, nifty fut weekly, gold mcx"/>
                <span className="input-group-text bg-white border-0 text-muted">
                    {watchlist.length} / 50
                </span>
            </div>

            <ul className="list list-unstyled">
                {watchlist.map((stock, index) => (
                    <WatchListItem stock={stock} key={index} />
                ))}
            </ul>
        </div>
    );
};


export default WatchList;

const WatchListItem = ({ stock }) => {
    const [showWatchListAction, setshowWatchListAction] = useState(false);
    const prices = useStockPrices();  // ⬅️ Hook added

    const liveData = prices[stock.name+".NS"];  // live price, net_change, percent_change

    const handleMouseEnter = () => setshowWatchListAction(true);
    const handleMouseExit = () => setshowWatchListAction(false);

    return (
        <li className="border-bottom px-3 py-2 position-relative"
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseExit}
            style={{ borderBottomWidth: "0.8px", borderColor: "rgb(235, 234, 234)" }}>
            
            <div className="d-flex align-items-center justify-content-between fw-light small">
                <p className={(liveData?.net_change < 0) ? "text-danger" : "text-success"}>
                    {stock.name}
                </p>
                
                <div className="d-flex align-items-center">
                    <span className="fw-light text-muted">
                        {liveData ? `${liveData.percent_change.toFixed(2)}%` : "Loading..."}
                    </span>

                    {liveData && (
                        liveData.net_change < 0 ?
                            <KeyboardArrowDown className="text-danger m-1"/> :
                            <KeyboardArrowUp className="text-success m-1"/>
                    )}
                    
                    <span className={(liveData?.net_change < 0 ? "text-danger" : "text-success") + " m-1"}>
                        {liveData ? `₹${liveData.price}` : "--"}
                    </span>
                </div>
            </div>

            {showWatchListAction && <WatchListActions uid={stock.name} />}
        </li>
    );
};


const WatchListActions = ({uid})=>{
    const generalContext = useContext(GeneralContext);
    

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };
    return(
        <span className="actions d-none position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-end">
            <span>
                <Tooltip title="BUY (B)" placement="top" arrow TransitionComponent={Grow} onClick={handleBuyClick}><button className ="btn fw-normal text-white m-1" style={{backgroundColor:" #4184f3", border:" 0.7px solid #4184f3", fontSize: "0.8rem"}}>BUY</button></Tooltip>
                <Tooltip title="SELL (S)" placement="top" arrow TransitionComponent={Grow}><button className ="btn fw-normal text-white m-1" style={{backgroundColor:" #ff5722", border:" 0.7px solid #ff5722", fontSize: "0.8rem"}}>SELL</button></Tooltip>
                <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}><button className ="btn fw-light text-white m-1" style={{backgroundColor:"gray", border:" 0.7px solid gray", fontSize: "0.6rem"}}><BarChartOutlined/></button></Tooltip>
                <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}><button className ="btn fw-light  text-white" style={{backgroundColor:" gray", border:" 0.7px solid gray", fontSize: "0.8rem"}}><MoreHoriz/></button></Tooltip>
            </span>
        </span>
    )
}