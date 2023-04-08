import { Arbitrum, Avalanche, BinanceSmartChain, Ethereum, Fantom, Kava, Moonbeam, Optimism, Polygon } from '@renproject/chains-ethereum';
import { Chain } from "@renproject/chains"

type AssetBaseConfig = {
    [asset: string]: {
        tokenAddress: string;
        mintGatewayAddress: string
    }
}
export type ChainBaseConfig = {
    bridgeAddress: string;
    multicallContract: string
    chain: Chain
    assets: AssetBaseConfig
}

export enum Asset {
  ArbETH = "ArbETH",
  AVAX = "AVAX",
  BADGER = "BADGER",
  BCH = "BCH",
  BNB = "BNB",
  BTC = "BTC",
  BUSD = "BUSD",
  CRV = "CRV",
  DAI = "DAI",
  DGB = "DGB",
  DOGE = "DOGE",
  ETH = "ETH",
  EURT = "EURT",
  FIL = "FIL",
  FTM = "FTM",
  FTT = "FTT",
  gETH = "gETH",
  GLMR = "GLMR",
  KAVA = "KAVA",
  KNC = "KNC",
  LINK = "LINK",
  LUNA = "LUNA",
  MATIC = "MATIC",
  MIM = "MIM",
  oETH = "oETH",
  REN = "REN",
  ROOK = "ROOK",
  SOL = "SOL",
  SUSHI = "SUSHI",
  UNI = "UNI",
  USDC = "USDC",
  USDT = "USDT",
  ZEC = "ZEC",
  USDT_Goerli = "USDT_Goerli",
  USDC_Goerli = "USDC_Goerli",
  DAI_Goerli = "DAI_Goerli",
  REN_Goerli = "REN_Goerli",
  ASTRAL_USDT = "ASTRAL_USDT"
}

