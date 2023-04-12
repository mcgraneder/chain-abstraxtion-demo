let DOMAIN = "";
if (typeof window !== "undefined") {
  DOMAIN = window.location.origin;
}
const NextBaseUrl = `${DOMAIN}/api`;
const API = {
  next: {
    balancesof: `${NextBaseUrl}/balancesof`,
    txTypedData: `https://api-21tx.onrender.com/TxTypedData`,
    submitRelayTx: `https://api-21tx.onrender.com/submitRelayTx`,
    SwapTxTypedData: `https://api-21tx.onrender.com/SwapTxTypedData`,
  },
  backend: {
    txTypedData: `https://api-21tx.onrender.com/TxTypedData`,
    submitRelayTx: `https://api-21tx.onrender.com/submitRelayTx`,
    SwapTxTypedData: `https://api-21tx.onrender.com/SwapTxTypedData`,
    test: "https://api-21tx.onrender.com/",
  },
};

export default API;
