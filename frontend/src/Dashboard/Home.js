import React from "react";

import TopBar from "./TopBar";
import { Route, Routes } from "react-router-dom";
import { GeneralContextProvider } from "./GeneralContext";

import Apps from "./App";
import Profile from "./Profile";
import Holdings from "./Holding";
import Alerts from "./Alerts";
import Orders from "./Order";
import Summary from "./Summary";
import WatchList from "./WatchList";

const Home = () => {
  return (
    <>
      <Alerts/>
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
          <Route path="profile" element={<Profile />} />
          <Route path="apps" element={<Apps />} />
        </Routes> 
      </div>
    </div>
    </>
  );
};

export default Home;