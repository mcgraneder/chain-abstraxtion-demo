import type { NextApiRequest, NextApiResponse } from "next";
import TokenMulticall1, {
  MulticallConfig,
  setupMulticallConfig,
} from "../../services/multicall";
import { Chain } from "@renproject/chains";
import { Asset } from "../../utils/assetsConfig";
import BigNumber from "bignumber.js";
import {
  BinanceSmartChain,
  Ethereum,
} from "@renproject/chains-ethereum";

export type MulticallReturn = {
  tokenAddress: string;
  chain: Chain;
  asset: Asset;
  walletBalance: string;
  bridgeBalance: string;
};

export type MulticallAsset = {
  tokenAddress: string;
  mintGatewayAddress: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
 
  const multicallConfig = setupMulticallConfig();
  const combinedConfigs = multicallConfig.combinedConfigs;
  const of = req.query.of!.toString();

  const balancesMap = {
    [Ethereum.chain]: {},
    [BinanceSmartChain.chain]: {},
  } as { [chain: string]: { [x: string]: any } };

  const { walletTokenBalances } = await TokenMulticall1(
    combinedConfigs,
    of
  );

  combinedConfigs.forEach((config: MulticallConfig, chainIndex: number) => {
    config.assets.forEach((asset: string, index: number) => {
      balancesMap[config.chain!]![config.tickers[index]!] = {
        tokenAddress: asset,
        chain: config.chain,
        asset: config.tickers[index] as Asset,
        walletBalance: config.multicallProvider
          .decodeABIParameter<BigNumber>(
            "uint256",
            walletTokenBalances[chainIndex]![index]!
          )
          .toString()
      };
    });
  });
  res.json({
    result: {
      multicall: balancesMap,
    },
  });
}

export default handler;
