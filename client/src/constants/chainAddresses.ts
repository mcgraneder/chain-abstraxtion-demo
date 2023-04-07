import { Chain } from "@renproject/chains";
import {
  Asset,
} from "../utils/assetsConfig";

type WhiteListed = Asset[];

type AssetBaseConfig = {
  [asset: string]: {
    tokenAddress: string;
    mintGatewayAddress: string;
  };
};
export type ChainBaseConfig = {
  bridgeAddress: string;
  multicallContract: string;
  chain: Chain;
  assets: AssetBaseConfig;
  whiteListedAssets: WhiteListed;
};

export const multicallDeployments: {[chain: string]: string }= {
  [Chain.Ethereum]: "0x57B249fCF4b71c0c1E3f51fE25bC358ae6705b79",
  [Chain.BinanceSmartChain]: "0x442576f76F190FEbbCd83C3f4A879aC27675C923",
};
