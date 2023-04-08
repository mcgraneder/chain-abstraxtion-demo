let DOMAIN = "";
if (typeof window !== "undefined") {
  DOMAIN = window.location.origin;
}
const NextBaseUrl = `${DOMAIN}/api`;
const API = {
  next: {
    balancesof: `${NextBaseUrl}/balancesof`,
  },
  backend: {
    approvalTxTypedData: `http://localhost:4000/approvalTxTypedData`,
    submitRelayTx: `http://localhost:4000/submitRelayTx`
  },
};

export default API;
