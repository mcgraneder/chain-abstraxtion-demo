export type AssetIconsConfig = {
  Icon: string | null;
};

export type AssetLabelsConfig = {
  shortName: string;
  fullName: string;
  decimals: number;
  address: string;
  chain: string;
};

export type AssetBaseConfig = AssetIconsConfig &
  AssetLabelsConfig 

export enum Asset {
  BUSD = "BUSD",
  WBNB = "WBNB",
  CAKE="CAKE"
}

export const tickerToAddress: { [asset: string]: string } = {
  [Asset.BUSD]: "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
  [Asset.WBNB]: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
  [Asset.CAKE]: "0xFa60D973F7642B748046464e165A65B7323b0DEE",
};
export const assetsBaseConfig: Record<Asset, AssetBaseConfig> = {
  BUSD: {
    Icon: Asset.BUSD,
    shortName: "BUSD",
    fullName: "Binance USD",
    decimals: 18,
    address: "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
    chain: "BinanceSmartChain"
  },
  WBNB: {
    Icon: Asset.WBNB,
    shortName: "WBNB",
    fullName: "Wrapped BNB",
    decimals: 18,
    address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    chain: "BinanceSmartChain"
  },
  CAKE: {
    Icon: Asset.CAKE,
    shortName: "CAKE",
    fullName: "PancakeCake Token",
    decimals: 18,
    address: "0xFa60D973F7642B748046464e165A65B7323b0DEE",
    chain: "BinanceSmartChain"
  },
};

export const assetsConfig = Object.fromEntries(
  Object.entries(assetsBaseConfig).map(([asset, config]) => [
    asset,
    {
      ...config,
      // prevent UNSET for simple cases
      shortName: config.shortName || asset,
      fullName: config.fullName || asset,
    },
  ])
) as Record<Asset, AssetBaseConfig>;


export const supportedAssets = [
  Asset.BUSD,
  Asset.WBNB,
  Asset.CAKE,
];