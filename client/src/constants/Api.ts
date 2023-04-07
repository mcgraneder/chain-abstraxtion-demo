let DOMAIN = "";
if (typeof window !== "undefined") {
  DOMAIN = window.location.origin;
}
const NextBaseUrl = `${DOMAIN}/api`;
const API = {
  next: {
    balancesof: `${NextBaseUrl}/balancesof`,
  },
};

export default API;
