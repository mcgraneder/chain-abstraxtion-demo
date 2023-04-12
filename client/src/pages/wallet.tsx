import React, { useState, useCallback, useEffect } from "react";
import AssetListModal from "@/components/AssetListModal/AssetListModal";
import WalletModal from "@/components/WalletModal/WalletModal";
import { Layout } from "@/layouts";
import type { NextPage } from "next";
import { AssetBaseConfig, assetsBaseConfig } from "../utils/assetsConfig";
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
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import { ethers } from 'ethers';
import UserInfoModal from "@/components/UserInfoModal/UserInfoModal";

const Home: NextPage = () => {
  const { library, account, chainId } = useWeb3React();
  const [transactionType, setTransactionType] = useState<string>("Deposit");
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [response, setResponse] = useState<boolean>(true)
  const [asset, setAsset] = useState<AssetBaseConfig>(assetsBaseConfig.BUSD);
  const [value, setValue] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");

  const { togglePending, memoizedFetchBalances, transactions, setTransactions } = useGlobalState();
  const [showWarning, setShowWarning] = useState<boolean>(false);

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
     else setResponse(true)
   }, [account]);

   useEffect(() => {
     fetchResponse();

     const interval: NodeJS.Timer = setInterval(fetchResponse,8000);
     return () => clearInterval(interval);
   }, [fetchResponse]);

  const executeTx = useCallback(async () => {

    if (!library || !account) return;
    if (transactionType === "Transfer" && recipient === "") return
    toggleConfirmationModal();
    togglePendingModal();
    const tokenAddress = asset.address;
    const chainID = asset.chainId;
    const amount = new BigNumber(value).shiftedBy(asset.decimals).toFixed();
    const transferTxTypedDataResponse = await get(API.backend.txTypedData, {
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

    if (!transferTxTypedDataResponse) throw new Error("ErrorCodes.apiFailed");

    if (transactionType === "Deposit") {
      const signer = library.getSigner();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20ABI,
        library.getSigner()
      ) as ethers.Contract;
      const appprovalOp = await tokenContract
        .connect(signer)
        .approve?.("0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532", amount, {
          gasLimit: 2000000,
        });

      await appprovalOp.wait(2);
    }

//@ts-ignore
    const { domain, types, values } = transferTxTypedDataResponse.result;

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
      togglePending();
    }
    const submitRelayTxResponse = await post(API.backend.submitRelayTx, {
      forwardRequest: values.userOps,
      forwarderAddress: "0xc82993eFc2B02bC4Df602D6De1cb70aC90b4DED2",
      signature,
      from: account!,
    })as any;

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
        "your transaction has executed successfully",
        "topR"
      );
    }
     const result = submitRelayTxResponse?.reciept!;
     console.log(submitRelayTxResponse?.reciept!);
     togglePending();
     setTransactions([
       ...transactions,
       {
         account: result.transactionHash,
         type: "Swap",
         from: account,
         amount: value,
         currency: asset.Icon,
         fromAc: account!,
         date: Date.now(),
         ...result,
       },
     ]);
    await memoizedFetchBalances()
  }, [value, togglePending, library, account, transactionType, recipient]);

   useEffect(() => {
    if (typeof window === "undefined") return;
    const warning = localStorage.getItem("walletPageWarning");
    if (warning !== "true") setShowWarning(true);
  }, []);

  const closeWarning = useCallback(() => {
    setShowWarning(false);
    localStorage.setItem("walletPageWarning", "true");
  }, []);

  return (
    <Layout>
      <UserInfoModal
        open={showWarning}
        close={closeWarning}
        isHomePageWarning={false}
        message={
          <span>
            This is the only page you are required to be on a specific chain.
            The Deposit transaction flow requires a connection to Bsc Testnet.
            however the transfer and withdrawal transactions can be executed
            from any chain.
          </span>
        }
      />

      <TransactionFlowModals
        asset={asset}
        buttonState={"Transaction"}
        text={value}
        executeTx={executeTx}
      />
      <AssetListModal
        setShowTokenModal={setShowTokenModal}
        visible={showTokenModal}
        setAsset={setAsset}
        setToAsset={() => null}
      />
      <WalletModal
        setShowTokenModal={setShowTokenModal}
        setTransactionType={setTransactionType}
        asset={asset}
        value={value}
        setValue={setValue}
        response={response}
        recipient={recipient}
        setRecipient={setRecipient}
        transactionType={transactionType}
      />
    </Layout>
  );
};

export default Home;
