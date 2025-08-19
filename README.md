# StockFolio  
  
A comprehensive stock trading platform with real-time price feeds, automated order execution, and machine learning-powered predictions.  
  
## Overview  
  
StockFolio is a full-stack trading application that combines React frontend with dual backend services (Flask + Express.js) to provide real-time stock trading capabilities with ML-driven insights.  
  
## Features  
  
- *Real-time Stock Trading*: Live price feeds with automated buy/sell order execution  
- *Portfolio Management*: Track holdings with real-time P&L calculations  
- *ML Predictions*: LSTM-based stock price movement predictions with trading alerts  
- *Watchlist Management*: Customizable stock tracking with default Indian market stocks  
- *Firebase Authentication*: Secure user management with Google OAuth integration  
  
## Architecture  
  
### Frontend (React)  
- Modern React application with responsive design  
- Real-time dashboard with live price updates  
- Landing pages with company information and pricing  
  
### Backend Services  
- *Express API Server*: RESTful endpoints for user management and trading operations  
- *Flask Price Service*: Real-time price fetching and ML predictions  
- *MongoDB*: Data persistence for users, holdings, orders, and alerts  
  
## Installation & Setup  
  
### Prerequisites  
- Node.js (v14+)  
- Python 3.8+  
- MongoDB  
- Firebase project with authentication enabled  
  
### Frontend Setup  
```bash  
cd frontend  
npm install  
npm start
