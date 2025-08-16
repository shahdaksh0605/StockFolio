// AnalyticsModal.js
import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const AnalyticsModal = ({ open, handleClose, stockName, priceData, historyData }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {stockName} Analytics
        </Typography>

        <Typography variant="body1">
          Current Price: ₹{priceData?.price || "--"} <br/>
          Net Change: ₹{priceData?.net_change || "--"} <br/>
          % Change: {priceData?.percent_change?.toFixed(2) || "--"}%
        </Typography>

        <Typography variant="body2" mt={2}>
          Mini 7-day chart:
        </Typography>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={historyData}>
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin', 'dataMax']} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#4184f3" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Modal>
  );
};

export default AnalyticsModal;