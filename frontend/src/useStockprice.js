import { useEffect, useState } from "react";
import socket from "./socket";

const useStockPrices = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const handleUpdate = ({ symbol, price, net_change, percent_change }) => {
      console.log("Received:", symbol, price, net_change, percent_change);
      setPrices((prev) => ({
        ...prev,
        [symbol]: {
          price,
          net_change,
          percent_change
        }
      }));
    };

    socket.on("stock_update", handleUpdate);

    return () => {
      socket.off("stock_update", handleUpdate);
    };
  }, []);

  return prices;
};

export default useStockPrices;
