import API from "@/constants/Api";
import { useTransactionFlow } from "@/context/useTransactionFlowState";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import PCAKE_ROUTERABI from "../constants/ABIs/PCakeRouter.json";
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import { ethers } from "ethers";
import { defaultAbiCoder } from "@ethersproject/abi";
import { useGlobalState } from "@/context/GlobalState";
import { get, post } from "@/services/axios";
import useTransactionNotification from "./useTransactionNotification";
import { usePriceQuery } from "./usePriceQuery";
import { UserOp } from "./APIProxy";

const useExecuteTransaction = (
  asset: AssetBaseConfig,
  transactionType: string,
  inputAmount: string,
  toAsset?: AssetBaseConfig,
  recipient?: string
) => {
  const { account, library, chainId } = useWeb3React();
  const { fetchPrice } = usePriceQuery(asset, toAsset!);
  const {
    togglePending,
    transactions,
    setTransactions,
    memoizedFetchBalances,
  } = useGlobalState();
  const { handleNewNotification } = useTransactionNotification();
  const {
    toggleConfirmationModal,
    togglePendingModal,
    toggleSubmittedModal,
    toggleRejectedModal,
  } = useTransactionFlow();

  const handleTxSigned = useCallback(() => {
    togglePending();
    togglePendingModal();
    toggleSubmittedModal();
  }, [togglePending, togglePendingModal, toggleSubmittedModal]);

  const getUserSignature = async (
    domain: any,
    types: any,
    values: any
  ): Promise<string | undefined> => {
    let signature;
    try {
      const signatureBase = await library
        .getSigner()
        ?._signTypedData(domain, types, values);

      signature = defaultAbiCoder.encode(
        ["uint256", "bytes"],
        [chainId, signatureBase]
      );
      handleTxSigned();
    } catch {
      toggleRejectedModal();
      togglePending()
    }
    return signature;
  };

  const handleTokenApproval = async (tokenAddress: string) => {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20ABI,
      library.getSigner()
    ) as ethers.Contract;

    if (!tokenContract) return;
    try {
      const allowance = await tokenContract.allowance(
        account!,
        "0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532"
      );
      if (Number(allowance) <= 0) {
        const appprovalOp = await tokenContract.approve(
          "0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532",
          ethers.constants.MaxUint256,
        );

        await appprovalOp.wait(1);
      }
    } catch (error) {
      togglePending()
    }
  };

  const getTypedTransactionData = async (
    transactionType: string,
    tokenAddress: string,
    amount: string,
    chainID: number,
    recipient?: string
  ): Promise<any> => {
    let typesTxData;
    if (transactionType === "Swap") {
      typesTxData = await get(API.backend.SwapTxTypedData, {
        params: {
          chainID,
          sigChainID: chainId,
          token: tokenAddress,
          from: account,
          amount,
        },
      });
      if (!typesTxData) throw new Error("ErrorCodes.apiFailed");
    } else {
        console.log(transactionType)
      typesTxData = await get(API.backend.txTypedData, {
        params: {
          chainID,
          sigChainID: chainId,
          token: tokenAddress,
          from: account,
          to: transactionType === "Transfer" ? recipient : account,
          amount,
          transactionType: transactionType,
        },
      });

      if (!typesTxData) throw new Error("ErrorCodes.apiFailed");
    }
    return typesTxData;
  };

  const generateTransactionData = async (transactionType: string, values: any) => {
    let userOps: UserOp[] = []
    if (transactionType === "Swap") {
      //@ts-ignore
      const { tx: swapMeta } = await fetchPrice(
        library,
        inputAmount,
        account!,
        asset,
        toAsset!,
        "inputCurrency"
      );
      const pancakeswap = new ethers.Contract(
        "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
        PCAKE_ROUTERABI,
        library.getSigner()
      );
      const tx =
        await pancakeswap.populateTransaction.swapExactTokensForTokens?.(
          ...swapMeta
        );
      userOps = [
        ...values.userOps,
        {
          to: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", //PC_AKEROUTER
          amount: "0",
          data: tx?.data,
        },
      ];
    } else {
        userOps = [...values.userOps]
    }
    return userOps
  };

  const executeTransaction = useCallback(
    async () => {
      if (!library || !account) return;
      toggleConfirmationModal();
      togglePendingModal();
      const tokenAddress = asset.address;
      const chainID = asset.chainId;
      const amount = new BigNumber(inputAmount)
        .shiftedBy(asset.decimals)
        .toFixed();

        
      const txTypedData = await getTypedTransactionData(
        transactionType,
        tokenAddress,
        amount,
        chainID,
        recipient
      );
      //@ts-ignore
      const { domain, types, values } = txTypedData.result;
      await handleTokenApproval(tokenAddress);
      const userOps = await generateTransactionData(transactionType, values)
      
      const signature = await getUserSignature(domain, types, values);
      const submitRelayTxResponse = (await post(API.backend.submitRelayTx, {
        forwardRequest: userOps,
        forwarderAddress: "0xc82993eFc2B02bC4Df602D6De1cb70aC90b4DED2",
        signature,
        from: account!,
      })) as any;

      if (!submitRelayTxResponse) handleNewNotification("Error");
      else handleNewNotification("Success");

      const result = submitRelayTxResponse?.receipt!;

      togglePending();
      setTransactions([
        ...transactions,
        {
          account: account,
          type: "Swap",
          from: account,
          amount: inputAmount,
          currency: asset.Icon,
          date: Date.now(),
          ...result,
        },
      ]);
      await memoizedFetchBalances();
    },
    [inputAmount, togglePending, library, account]
  );

  return { executeTransaction }
};

export default useExecuteTransaction;
