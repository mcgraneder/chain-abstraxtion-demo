import { Chain } from "@renproject/chains";
import { BinanceSmartChain } from '@renproject/chains-ethereum';


export const forwarderDepolyments: { [chain: string]: string } = {
  [Chain.Ethereum]: "0x716497Ab7aDAB1aE1abB649dF97734B20B8eBc05",
  [Chain.BinanceSmartChain]: "0x6bB441DA26a349a706B1af6C8C4835B802cDe7d8",
};

export const forwarderV2Depolyments: { [chain: string]: string } = {
  [Chain.Ethereum]: "0x716497Ab7aDAB1aE1abB649dF97734B20B8eBc05",
  [Chain.BinanceSmartChain]: "0x91E49AF5Eccb8AD8fbfd0A7A218Dae7f71178aa2",
};


export const depositorDeployments: { [chain: string]: string } = {
  [Chain.Ethereum]: "",
  [Chain.BinanceSmartChain]: "0x78eE9C07767A42f3B1ECe5B8Ec59F4872CeFF44c", //"0x78eE9C07767A42f3B1ECe5B8Ec59F4872CeFF44c",
};

export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  OPTIMISM = 10,
  OPTIMISM_GOERLI = 420,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  FANTOM_OPERA = 250,
  FANTOM_TESTNET = 4002,
  KAVA = 2222,
  KAVA_TESTNET = 2221,
  BINANCE_SMART_CHAIN = 56,
  BINANCE_SMART_CHAIN_TESTNET = 97,
  MOONBEAM = 1284,
  MOONBEAM_TESTNET = 1287,
  AVALANCHE_TESTNET = 43113,
}

export const ChainIdToChainName: { [chainId: number]: Chain } = {
  [SupportedChainId.MAINNET]: Chain.Ethereum,
  [SupportedChainId.GOERLI]: Chain.Ethereum,
  [SupportedChainId.POLYGON]: Chain.Polygon,
  [SupportedChainId.POLYGON_MUMBAI]: Chain.Polygon,
  [SupportedChainId.POLYGON_MUMBAI]: Chain.Polygon,
  [SupportedChainId.ARBITRUM_ONE]: Chain.Arbitrum,
  [SupportedChainId.ARBITRUM_RINKEBY]: Chain.Arbitrum,
  [SupportedChainId.OPTIMISM]: Chain.Optimism,
  [SupportedChainId.OPTIMISM_GOERLI]: Chain.Optimism,
  [SupportedChainId.FANTOM_OPERA]: Chain.Fantom,
  [SupportedChainId.FANTOM_TESTNET]: Chain.Fantom,
  [SupportedChainId.BINANCE_SMART_CHAIN]: Chain.BinanceSmartChain,
  [SupportedChainId.BINANCE_SMART_CHAIN_TESTNET]: Chain.BinanceSmartChain,
  [SupportedChainId.KAVA]: Chain.Kava,
  [SupportedChainId.KAVA_TESTNET]: Chain.Kava,
  [SupportedChainId.MOONBEAM]: Chain.Moonbeam,
  [SupportedChainId.MOONBEAM_TESTNET]: Chain.Moonbeam,
  [SupportedChainId.AVALANCHE_TESTNET]: Chain.Avalanche,
};
