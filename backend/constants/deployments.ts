enum Chain {
    Ethereum="Ethereum",
    Binance="Binance"
}
const forwarderDepolyments: { [chain: string]: string } = {
  [Chain.Ethereum]: "0x716497Ab7aDAB1aE1abB649dF97734B20B8eBc05",
  [Chain.Binance]: "0x65046EB582b300b3fe593D73aA381aE91932c25E",
};

const depositorDeployments: { [chain: string]: string } = {
  [Chain.Ethereum]: "",
  [Chain.Binance]: "0x6bB441DA26a349a706B1af6C8C4835B802cDe7d8", //"0x78eE9C07767A42f3B1ECe5B8Ec59F4872CeFF44c",
};