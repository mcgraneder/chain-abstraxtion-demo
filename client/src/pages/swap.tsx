import React, { useState, useCallback, useEffect, useRef } from "react";
import AssetListModal from "@/components/AssetListModal/AssetListModal";
import WalletModal from "@/components/WalletModal/WalletModal";
import { Layout } from "@/layouts";
import type { NextPage } from "next";
import { assetsBaseConfig } from "../utils/assetsConfig";
import TransactionFlowModals from "@/components/TxConfirmationModalFlow";
import { useWeb3React } from "@web3-react/core";
import {
  IPosition,
  notifyType,
  useNotification,
} from "@/context/useNotificationState";
import { useTransactionFlow } from "@/context/useTransactionFlowState";
import API from "@/constants/Api";
import BigNumber from "bignumber.js";
import { useGlobalState } from "@/context/GlobalState";
import { get, post } from "@/services/axios";
import { defaultAbiCoder } from "@ethersproject/abi";
import SwapModal from "@/components/SwapModal/SwapModal";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import { ethers } from "ethers";
import PCAKE_ROUTERABI from "../constants/ABIs/PCakeRouter.json";
import { usePriceQuery } from "@/hooks/usePriceQuery";
import { signer } from "@/hooks/APIProxy";
import UserInfoModal from '../components/UserInfoModal/UserInfoModal';

const Home: NextPage = () => {
  const { library, account, chainId } = useWeb3React();
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [asset, setAsset] = useState<AssetBaseConfig>(assetsBaseConfig.BUSD);
  const [inputAmount, setInputAmount] = useState("");
  const [response, setResponse] = useState<boolean>(true);
   const [showWarning, setShowWarning] = useState<boolean>(false);

  const [outputAmount, setOutputAmount] = useState("");

  const { togglePending, memoizedFetchBalances, transactions, setTransactions } = useGlobalState();
  const [toAsset, setToAsset] = useState<any>(assetsBaseConfig.CAKE);
  const { fetchPrice } = usePriceQuery(asset, toAsset);

  useEffect(() => {
    setInputAmount("");
    setOutputAmount("");
  }, [showTokenModal]);

  const dispatch = useNotification();
  const {
    toggleConfirmationModal,
    togglePendingModal,
    toggleSubmittedModal,
    toggleRejectedModal,
  } = useTransactionFlow();

  const handleNewNotification = (
    type: notifyType,
    title: string,
    message: string,
    position: IPosition
  ) => {
    dispatch({
      type: type,
      message: message,
      title: title,
      position: position,
      success: true,
    });
  };

     const fetchResponse = useCallback(async () => {
       const apiResp = await get(API.backend.test);
       if (!apiResp) setResponse(false);
       else setResponse(true);
     }, [account]);

     useEffect(() => {
       fetchResponse();

       const interval: NodeJS.Timer = setInterval(fetchResponse, 8000);
       return () => clearInterval(interval);
     }, [fetchResponse]);

  const executeTx = useCallback(async () => {
    if (!library || !account) return;
    toggleConfirmationModal();
    togglePendingModal();
    const tokenAddress = asset.address;
    const chainID = asset.chainId;
    const amount = new BigNumber(inputAmount)
      .shiftedBy(asset.decimals)
      .toFixed();
    const transferTxTypedDataResponse = await get(API.backend.SwapTxTypedData, {
      params: {
        chainID,
        sigChainID: chainId,
        token: tokenAddress,
        from: account,
        amount,
      },
    });
    //@ts-ignore
    const { tx: swapMeta } = await fetchPrice(
      library,
      inputAmount,
      account!,
      asset,
      toAsset,
      "inputCurrency"
    );
    if (!transferTxTypedDataResponse) throw new Error("ErrorCodes.apiFailed");

    //@ts-ignore
    const { domain, types, values } = transferTxTypedDataResponse.result;

    const pancakeswap = new ethers.Contract(
      "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
      PCAKE_ROUTERABI,
      signer
    );
     const tokenContract = new ethers.Contract(
       tokenAddress,
       ERC20ABI,
       library.getSigner()
     ) as ethers.Contract;

     const allowance = await tokenContract.allowance(
       account!,
       "0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532"
     );
     if (Number(allowance) <= 0) {
       const appprovalOp = await tokenContract.approve?.(
         "0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532",
         ethers.constants.MaxUint256,
         {}
       );

       await appprovalOp.wait(2);
     }
    const tx = await pancakeswap.populateTransaction.swapExactTokensForTokens?.(
      ...swapMeta
    );
    const userOps = [
      // appprovalOp,
      ...values.userOps,
      {
        to: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", //PC_AKEROUTER
        amount: "0",
        data: tx?.data,
      },
    ];
    let signature;
    try {
      const signatureBase = await library
        .getSigner()
        ?._signTypedData(domain, types, values);
      signature = defaultAbiCoder.encode(
        ["uint256", "bytes"],
        [chainId, signatureBase]
      );
      togglePending();
      togglePendingModal();
      toggleSubmittedModal();
    } catch {
      console.log("error");
      toggleRejectedModal();
    }
    const submitRelayTxResponse = await post(API.backend.submitRelayTx, {
      forwardRequest: userOps,
      forwarderAddress: "0xc82993eFc2B02bC4Df602D6De1cb70aC90b4DED2",
      signature,
      from: account!,
    }) as any;

    if (!submitRelayTxResponse) {
      handleNewNotification(
        "error",
        "Transaction Failed",
        "Unable to approve recipient address",
        "topR"
      );
    } else {
      handleNewNotification(
        "info",
        "Transaction Success",
        "Sucessfully approved recipient address",
        "topR"
      );
    }
    const result = submitRelayTxResponse?.receipt!;
    console.log(submitRelayTxResponse?.receipt!);
    console.log(submitRelayTxResponse);

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
    await memoizedFetchBalances()

  }, [inputAmount, togglePending, library, account]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const warning = localStorage.getItem("swapPageWarning");
    if (warning !== "true") setShowWarning(true);
  }, []);

  const closeWarning = useCallback(() => {
    setShowWarning(false);
    localStorage.setItem("swapPageWarning", "true");
  }, []);

  return (
    <Layout>
      <UserInfoModal
        open={showWarning}
        close={closeWarning}
        isHomePageWarning={false}
        message={
          <div className="flex flex-col gap-2">
            <div className="text-[18px] text-gray-600">{"Please Swap Small Amounts < 5"}</div>
            <span>
              On this page you can swap the tokens provided from any chain. this
              means you could have metamask on ethereum mainnet and the swap
              will still go through.
              <br></br>
              <br></br>
              Whats more is you can also have 0 gas token on any chain and the
              swap will still work. here the forwarder pays the gas token.
              However i can set it so that a user nests a payment tx to the
              forwarder as compensation Note that this app users a free tier api
              service.
            </span>
          </div>
        }
      />
      <TransactionFlowModals
        asset={asset}
        buttonState={"Transaction"}
        text={inputAmount}
        executeTx={executeTx}
      />
      <AssetListModal
        setShowTokenModal={setShowTokenModal}
        visible={showTokenModal}
        setAsset={setAsset}
        setToAsset={setToAsset}
      />
      <SwapModal
        setShowTokenModal={setShowTokenModal}
        asset={asset}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        outputAmount={outputAmount}
        setOutputAmount={setOutputAmount}
        toAsset={toAsset}
        response={response}
      />
    </Layout>
  );
};

export default Home;
