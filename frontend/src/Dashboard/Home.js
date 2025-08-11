import React from "react";

import TopBar from "./topBar";
import { Route, Routes } from "react-router-dom";
import { GeneralContextProvider } from "./GeneralContext";

import Apps from "./App";
import Funds from "./Funds";
import Holdings from "./Holding";

import Orders from "./Order";
import Positions from "./Position";
import Summary from "./Summary";
import WatchList from "./WatchList";

const Home = () => {
  return (
    <>

      <TopBar /> 
      <div className="d-flex flex-direction-row" style={{height:"700px"}}>
        <GeneralContextProvider>
        <WatchList />
        </GeneralContextProvider>
      <div className="p-3 bg-light rounded w-50  m-0">
        <Routes>
          <Route index element={<Summary />} />
          <Route path="orders" element={<Orders />} />
          <Route path="holdings" element={<Holdings />} />
          <Route path="positions" element={<Positions />} />
          <Route path="funds" element={<Funds />} />
          <Route path="apps" element={<Apps />} />
        </Routes> 
      </div>
    </div>
    </>
  );
};

export default Home;