import { AlphaRouter, SwapOptions, SwapType } from "@uniswap/smart-order-router";
import {
  Token,
  CurrencyAmount,
  TradeType,
  Percent,
} from "@uniswap/sdk-core";
const { ethers, BigNumber } = require("ethers");
import JSBI from "jsbi";
import { ERC20ABI } from '@renproject/chains-ethereum/contracts';
import { Web3Provider } from '@ethersproject/providers';

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

const chainId = 80001;

const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
const address0 = "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa";

const name1 = "Wrapped Matic Token";
const symbol1 = "WMATIC";
const decimals1 = 18;
const address1 = "0x9c3c9283d3e44854697cd22d3faa240cfb032889";

export const getWethContract = (library: Web3Provider) =>
  new ethers.Contract(address0, ERC20ABI, library);
export const getUniContract = (library: Web3Provider) =>
  new ethers.Contract(address1, ERC20ABI, library);

export const getPrices = async (
  inputAmount: string,
  slippageAmount: number,
  walletAddress: string,
  library: Web3Provider
) => {

   const WETH = new Token(chainId, address0, decimals0, symbol0, name0);
   const UNI = new Token(chainId, address1, decimals1, symbol1, name1);

   const percentSlippage = new Percent(slippageAmount, 100);
  const wei = ethers.utils.parseUnits(inputAmount.toString(), decimals0);
  const currencyAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei));

    const router = new AlphaRouter({ chainId: chainId, provider: library });

const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

const swapOps: SwapOptions = {
  recipient: walletAddress,
  slippageTolerance: percentSlippage,
  deadline: deadline,
  type: SwapType.SWAP_ROUTER_02,
};

  const route = await router.route(currencyAmount, UNI, TradeType.EXACT_INPUT, swapOps);

  const transaction = {
    data: route?.methodParameters?.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: BigNumber.from(route?.methodParameters?.value),
    from: walletAddress,
    gasPrice: BigNumber.from(route?.gasPriceWei),
    gasLimit: ethers.utils.hexlify(1000000),
  };

  const quoteAmountOut = route?.quote.toFixed(6);
//   const ratio = (inputAmount / quoteAmountOut).toFixed(3);

  return { convertedOutputAmt: quoteAmountOut, tx: transaction };
};

export const runSwap = async (transaction: any, signer: Web3Provider) => {
  const approvalAmount = ethers.utils.parseUnits("10", 18).toString();
  const contract0 = getWethContract(signer);
  await contract0
    .connect(signer)
    .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);

  await signer.sendTransaction(transaction);
};
