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

const Home: NextPage = () => {
  const { library, account, chainId } = useWeb3React();
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [asset, setAsset] = useState<AssetBaseConfig>(assetsBaseConfig.BUSD);
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");

  const { togglePending } = useGlobalState();
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

    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20ABI,
      library.getSigner()
    ) as ethers.Contract;
    const appprovalOp = await tokenContract
      .connect(library.getSigner())
      .approve?.("0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532", amount, {
        gasLimit: 2000000,
      });

    await appprovalOp.wait(2);

    //@ts-ignore
    const { domain, types, values } = transferTxTypedDataResponse.result;

    const pancakeswap = new ethers.Contract(
      "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
      PCAKE_ROUTERABI,
      library.getSigner()
    );

    const tx = await pancakeswap.populateTransaction.swapExactTokensForTokens?.(
      ...swapMeta
    );
    const userOps = [
      // appprovalOp,
      ...values.userOps,
      {
        to: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",//PC_AKEROUTER
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
    });

    console.log(submitRelayTxResponse);
    if (!submitRelayTxResponse) {
      handleNewNotification(
        "error",
        "Approval Failed",
        "Unable to approve recipient address",
        "topR"
      );
    } else {
      handleNewNotification(
        "info",
        "Approval Success",
        "Sucessfully approved recipient address",
        "topR"
      );
    }
    togglePending();
    console.log(submitRelayTxResponse);
  }, [inputAmount, togglePending, library, account]);

  return (
    <Layout>
      <TransactionFlowModals
        asset={asset}
        buttonState={"Approval"}
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
      />
    </Layout>
  );
};

export default Home;
