import { Web3Provider } from "@ethersproject/providers";
import {
  Fetcher,
  Token,
  TradeType,
  Percent,
  Route,
  Trade,
  TokenAmount,
  Pair,
  ChainId,
} from "@pancakeswap-libs/sdk";
import IPancakePair from "../constants/ABIs/IPancakePair.json";
import PCAKE_ROUTERABI from "../constants/ABIs/PCakeRouter.json";
import FACTORY_ABI from "../constants/ABIs/FactoryABI.json"
import { Contract, ethers } from "ethers";
import Web3 from "web3";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import {useCallback} from 'react';
import { NoEthereumProviderError } from "@web3-react/injected-connector";


const addresses = {
  PANCAKE_ROUTER: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
};

export const usePriceQuery = (fromAsset: AssetBaseConfig, toAsset: AssetBaseConfig) => {

  const fetchPrice = useCallback(async (
    library: Web3Provider,
    inputAmount: string,
    walletAddress: string,
    fromAsset: AssetBaseConfig,
    toAsset: AssetBaseConfig,
    input: string
  ) => {
    if (inputAmount === "0" || inputAmount === ' ') {
      console.log(true)
      return
    }
    const tradeAmount = ethers.utils.parseUnits(inputAmount.toString(), 18);
    const [token0, token1] = await Promise.all(
      [fromAsset.address, toAsset.address].map(
        (tokenAddress) => new Token(ChainId.BSCTESTNET, tokenAddress, 18)
      )
    );

    const pair = await fetchPairData(token0!, token1!, library);
    const route = await new Route([pair], input === "inputCurrency" ? token0! : token1!);
    const trade = await new Trade(
      route,
      new TokenAmount(
        input === "inputCurrency" ? token0! : token1!,
        tradeAmount as any
      ),
      TradeType.EXACT_INPUT
    );

    const slippageTolerance = new Percent("50", "10000");

    // create transaction parameters
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    const convertedOutAmount = Number(amountOutMin) / 10 ** 18; //for now i know token decimals chagge
    const path =
      input === "inputCurrency"
        ? [fromAsset.address, toAsset.address]
        : [toAsset.address, fromAsset.address];
    const to = walletAddress;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const tx = [
      ethers.utils.parseUnits(inputAmount.toString(), 18),
      ethers.utils.parseUnits(Web3.utils.fromWei(amountOutMin.toString()), 18),
      path,
      to,
      deadline,
      {
        gasLimit: ethers.utils.hexlify(200000),
      },
    ];
    return { convertedOutAmount, tx };
  }, [fromAsset, toAsset]);

  const provir = new ethers.providers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545/"
  );
  const fetchPairData = useCallback(
    async (tokenA: Token, tokenB: Token, provider: Web3Provider) => {
      const factory = new ethers.Contract(
        "0x6725f303b657a9451d8ba641348b6761a6cc7a17",
        FACTORY_ABI,
        provir
      );
      console.log(tokenA.address, tokenB.address)
      const address = await factory.getPair(tokenA.address, tokenB.address);
      console.log(address);
      const [reserves0, reserves1] = await new Contract(
        address,
        IPancakePair,
        provir
      ).getReserves();
      const balances = tokenA.sortsBefore(tokenB)
        ? [reserves0, reserves1]
        : [reserves1, reserves0];
      return new Pair(
        new TokenAmount(tokenA, balances[0]),
        new TokenAmount(tokenB, balances[1])
      );
    },
    []
  );

  const runSwap = async (
    transaction: any,
    library: Web3Provider,
    amount: string,
    asset: AssetBaseConfig
  ) => {
    console.log(Number(transaction[0]), Number(transaction[1]));

    const signer = library.getSigner();
    const approvalAmount = ethers.utils.parseUnits(amount, 18).toString();
    let abi = [
      "function approve(address _spender, uint256 _value) public returns (bool success)",
    ];
    let contract = new ethers.Contract(asset.address, abi, signer);
    const pancakeswap = new ethers.Contract(
      addresses.PANCAKE_ROUTER,
      PCAKE_ROUTERABI,
      library.getSigner()
    );
    try {
      const tx0 = await contract.approve(
        addresses.PANCAKE_ROUTER,
        approvalAmount,
        {
          gasLimit: ethers.utils.hexlify(2000000),
        }
      );
      await tx0.wait(1);
      const tx = await pancakeswap.swapExactTokensForTokens(...transaction);
      await tx.wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  return { fetchPrice, runSwap }

}
