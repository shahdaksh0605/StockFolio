import { useEffect, useState } from "react";
import socket from "./socket"; 

const useStockPrices = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const handleUpdate = ({ symbol, price }) => {
      console.log("Received:", symbol, price);
      setPrices((prev) => ({ ...prev, [symbol]: price }));
    };

    socket.on("stock_update", handleUpdate);

    return () => {
      socket.off("stock_update", handleUpdate);
    };
  }, []);

  return prices;
};

export default useStockPrices;
