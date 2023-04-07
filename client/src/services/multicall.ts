import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import { MultiCallService } from "@1inch/multicall";
import { Chain } from "@renproject/chains";
import Web3 from "web3";
import { MultiCallParams } from "@1inch/multicall/model";
import { Web3ProviderConnector } from "@1inch/multicall/connector";
import { BinanceSmartChain, Ethereum } from "@renproject/chains-ethereum";
import { multicallDeployments } from "@/constants/chainAddresses";
import { tickerToAddress } from '@/utils/assetsConfig';

type ProviderConfig = {
  gas: number;
  chainId: number;
  url: string;
  accounts: string[];
};
export const PorividerConfig: { [chain: string]: ProviderConfig } = {
  [BinanceSmartChain.chain]: {
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    gas: 3000000,
    chainId: 97,
    accounts: [process.env.PK1!],
  },
  [Ethereum.chain]: {
    chainId: 5,
    url: `https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
    gas: 3000000,
    accounts: [process.env.PK1!],
  }
};

export const EVMChains: Chain[] = [
  Chain.BinanceSmartChain
];

export type MulticallConfig = {
  chain: Chain;
  multicallService: MultiCallService;
  multicallProvider: Web3ProviderConnector;
  assets: string[];
  tickers: string[];
};

export type MulticallSetupConfig = {
  multicallConfigMap: {
    [chain: string]: MulticallConfig;
  };
  combinedConfigs: MulticallConfig[];
};


const getMulticallConfig = (chain: Chain): MulticallConfig => {
  const chainProvider = new Web3(
    new Web3.providers.HttpProvider(PorividerConfig[chain]!.url)
  );

  const multicallProvider = new Web3ProviderConnector(chainProvider);
  const multicallService = new MultiCallService(
    multicallProvider,
    multicallDeployments[chain]!
  );
  const multicallConfig: MulticallConfig = {
    chain: chain,
    multicallService,
    multicallProvider,
    assets: Object.values(tickerToAddress),
    tickers: Object.keys(tickerToAddress),
  };
  return multicallConfig;
};
export const setupMulticallConfig = (): MulticallSetupConfig => {
  const multicallConfigMap = {} as { [chain: string]: MulticallConfig };
  const combinedConfigs = EVMChains.map((chain: Chain) => {
    multicallConfigMap[chain] = getMulticallConfig(chain);
    return multicallConfigMap[chain];
  }) as MulticallConfig[];

  return { multicallConfigMap, combinedConfigs };
};
export default async function TokenMulticall1(
  combinedConfig: MulticallConfig[],
  of: string
) {
  // The parameters are optional, if not specified, the default will be used
  const params: MultiCallParams = {
    chunkSize: 10,
    retriesLimit: 3,
    blockNumber: "latest",
  };

  const WalletBalancePromises: any[] = [];
  combinedConfig.forEach((config: MulticallConfig) => {
    WalletBalancePromises.push(
      config.multicallService.callByChunks(
        config.assets.map((asset: string) => {
          return {
            to: asset,
            data: config.multicallProvider.contractEncodeABI(
              ERC20ABI,
              asset,
              "balanceOf",
              [of]
            ),
          };
        }),
        params
      )
    );
  });

  const walletTokenBalances = (await Promise.all(
    WalletBalancePromises
  )) as string[][];


  return { walletTokenBalances };
}
