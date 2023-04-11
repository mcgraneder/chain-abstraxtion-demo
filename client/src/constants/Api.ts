let DOMAIN = "";
if (typeof window !== "undefined") {
  DOMAIN = window.location.origin;
}
const NextBaseUrl = `${DOMAIN}/api`;
const API = {
  next: {
    balancesof: `${NextBaseUrl}/balancesof`,
    txTypedData: `https://chaindeme-be.onrender.com/TxTypedData`,
    submitRelayTx: `https://chaindeme-be.onrender.com/submitRelayTx`,
    SwapTxTypedData: `https://chaindeme-be.onrender.com/SwapTxTypedData`,
  },
  backend: {
    txTypedData: `https://chaindeme-be.onrender.com/TxTypedData`,
    submitRelayTx: `https://chaindeme-be.onrender.com/submitRelayTx`,
    SwapTxTypedData: `https://chaindeme-be.onrender.com/SwapTxTypedData`,
  },
};

export default API;
