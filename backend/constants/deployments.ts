enum Chain {
    Ethereum="Ethereum",
    Binance="Binance"
}
const forwarderDepolyments: { [chain: string]: string } = {
  [Chain.Ethereum]: "0x716497Ab7aDAB1aE1abB649dF97734B20B8eBc05",
  [Chain.Binance]: "0x65046EB582b300b3fe593D73aA381aE91932c25E",
};