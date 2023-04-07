export type AssetIconsConfig = {
  Icon: string | null;
};

export type AssetLabelsConfig = {
  shortName: string;
  fullName: string;
  decimals: number;
};

export type AssetBaseConfig = AssetIconsConfig &
  AssetLabelsConfig 

export enum Asset {
  BUSD = "BUSD",
  WBNB = "WBNB",
  CAKE="CAKE"
}

export const assetsBaseConfig: Record<Asset, AssetBaseConfig> = {
  BUSD: {
    Icon: Asset.BUSD,
    shortName: "BUSD",
    fullName: "Binance USD",
    decimals: 18,
  },
  WBNB: {
    Icon: Asset.WBNB,
    shortName: "WBNB",
    fullName: "Wrapped BNB",
    decimals: 18,
  },
  CAKE: {
    Icon: Asset.CAKE,
    shortName: "CAKE",
    fullName: "PancakeCake Token",
    decimals: 18,
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