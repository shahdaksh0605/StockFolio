import React, { useState, useContext, useEffect } from "react";
import { Tooltip, Grow } from '@mui/material';
import { BarChartOutlined, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz } from '@mui/icons-material';
import GeneralContext from "./GeneralContext";
import useStockPrices from "../useStockprice";
import axios from "axios";
import { useAuth } from "../context/authcontext/index"; // AuthContext
import AnalyticsModal from "./AnalyticsModal";

const WatchList = () => {
    const { currentUser } = useAuth();
    const prices = useStockPrices();
    const [searchQuery, setSearchQuery] = useState("");
    const [watchlist, setWatchlist] = useState([]);

    // Fetch watchlist from backend on mount
    useEffect(() => {
        if (!currentUser) return;

        axios.get(`http://localhost:8000/stockfolio/watchlist/${currentUser.uid}`)
            .then(res => setWatchlist(res.data.map(s => ({ name: s.replace(".NS", "") }))))
            .catch(err => console.error("Failed to fetch watchlist:", err));
    }, [currentUser]);

    // Filtered watchlist based on search
    const filteredWatchlist = watchlist.filter(stock =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Show Add option if search query is not empty and not in watchlist
    const showAddOption =
        searchQuery.trim() !== "" &&
        !watchlist.some(stock => stock.name.toLowerCase() === searchQuery.toLowerCase());

    const handleAddStock = () => {
        if (!currentUser) return;

        const symbol = searchQuery.toUpperCase();

        axios.post("http://localhost:8000/stockfolio/watchlist/add", {
            uid: currentUser.uid,
            symbol
        })
            .then(res => {
                setWatchlist(res.data.map(name => ({ name })));
                setSearchQuery(""); // clear search
            })
            .catch(err => console.error("Failed to add stock:", err));
    };

    return (
        <div className="p-3 bg-light rounded w-50 m-0">
            <div className="input-group mb-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    placeholder="Search eg: INFY, RELIANCE, NIFTY"
                />
                <span className="input-group-text bg-white border-0 text-muted">
                    {watchlist.length} / 50
                </span>
            </div>

            {showAddOption && (
                <div
                    className="text-primary mb-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleAddStock}
                >
                    + Add "{searchQuery.toUpperCase()}" to Watchlist
                </div>
            )}

            <ul className="list list-unstyled">
                {filteredWatchlist.map((stock, index) => (
                    <WatchListItem
                        stock={stock}
                        key={index}
                        setWatchlist={setWatchlist}
                    />
                ))}
            </ul>
        </div>
    );
};

export default WatchList;

const WatchListItem = ({ stock, setWatchlist }) => {
    const [showWatchListAction, setshowWatchListAction] = useState(false);
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const prices = useStockPrices();
    const { currentUser } = useAuth();

    const cleanSymbol = stock.name.replace(".NS", "");
    const liveData = prices[cleanSymbol];
    const [historyData, setHistoryData] = useState([]);

    const handleOpenAnalytics = async () => {
        await fetchHistoryData();
        setAnalyticsOpen(true);
    };

    const handleMouseEnter = () => setshowWatchListAction(true);
    const handleMouseExit = () => setshowWatchListAction(false);
    const handleCloseAnalytics = () => setAnalyticsOpen(false);

    const fetchHistoryData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/history/${stock.name}`);
            setHistoryData(res.data); 
        } catch (err) {
            console.error(err); 
        }
    };

    const handleRemoveStock = async () => {
        if (!currentUser) return;
        try {
            await axios.post("http://localhost:8000/stockfolio/watchlist/remove", {
                uid: currentUser.uid,
                symbol: stock.name
            });
            setWatchlist(prev => prev.filter(s => s.name !== stock.name));
        } catch (err) {
            console.error("Failed to remove stock:", err);
        }
    };

    // ✅ Safe values
    const percentChange = liveData?.percent_change !== undefined
        ? liveData.percent_change.toFixed(2)
        : null;
    const netChange = liveData?.net_change ?? null;
    const price = liveData?.price ?? null;

    return (
        <li
            className="border-bottom px-3 py-2 position-relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseExit}
            style={{ borderBottomWidth: "0.8px", borderColor: "rgb(235, 234, 234)" }}
        >
            <div className="d-flex align-items-center justify-content-between fw-light small">
                <p className={netChange < 0 ? "text-danger" : "text-success"}>
                    {stock.name}
                </p>

                <div className="d-flex align-items-center">
                    <span className="fw-light text-muted">
                        {percentChange !== null ? `${percentChange}%` : "Loading..."}
                    </span>

                    {netChange !== null &&
                        (netChange < 0 ? (
                            <KeyboardArrowDown className="text-danger m-1" />
                        ) : (
                            <KeyboardArrowUp className="text-success m-1" />
                        ))}

                    <span className={(netChange < 0 ? "text-danger" : "text-success") + " m-1"}>
                        {price !== null ? `₹${price}` : "--"}
                    </span>
                </div>
            </div>

            {showWatchListAction && (
                <span className="actions d-flex position-absolute top-0 start-0 w-100 h-100 align-items-center justify-content-end">
                    <WatchListActions
                        uid={stock.name}
                        handleRemoveStock={handleRemoveStock}
                        handleOpenAnalytics={handleOpenAnalytics}
                    />
                </span>
            )}

            {/* Analytics Modal */}
            <AnalyticsModal
                open={analyticsOpen}
                handleClose={handleCloseAnalytics}
                stockName={stock.name}
                priceData={liveData}
                historyData={historyData}
            />
        </li>
    );
};


const WatchListActions = ({ uid, handleRemoveStock, handleOpenAnalytics }) => {
    const generalContext = useContext(GeneralContext);

    const handleBuyClick = () => generalContext.openBuyWindow(uid);
    const handleSellClick = () => generalContext.openSellWindow(uid);

    return (
        <>
            <Tooltip title="BUY (B)" placement="top" arrow TransitionComponent={Grow}>
                <button
                    className="btn fw-normal text-white m-1"
                    style={{ backgroundColor: "#4184f3", border: "0.7px solid #4184f3", fontSize: "0.8rem" }}
                    onClick={handleBuyClick}
                >
                    BUY
                </button>
            </Tooltip>

            <Tooltip title="SELL (S)" placement="top" arrow TransitionComponent={Grow}>
                <button
                    className="btn fw-normal text-white m-1"
                    style={{ backgroundColor: "#ff5722", border: "0.7px solid #ff5722", fontSize: "0.8rem" }}
                    onClick={handleSellClick}
                >
                    SELL
                </button>
            </Tooltip>

            <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
                <button
                    className="btn fw-light text-white m-1"
                    style={{ backgroundColor: "gray", border: "0.7px solid gray", fontSize: "0.6rem" }}
                    onClick={handleOpenAnalytics} // Use handler from parent
                >
                    <BarChartOutlined />
                </button>
            </Tooltip>

            <Tooltip title="Remove" placement="top" arrow TransitionComponent={Grow}>
                <button
                    className="btn fw-light text-white m-1"
                    style={{ backgroundColor: "red", border: "0.7px solid red", fontSize: "0.8rem" }}
                    onClick={handleRemoveStock}
                >
                    REMOVE
                </button>
            </Tooltip>
        </>
    );
};

