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
import { PopulatedTransaction, ethers } from "ethers";
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";

const Home: NextPage = () => {
  const { library, account, chainId } = useWeb3React();
  const [transactionType, setTransactionType] = useState<string>("Deposit");
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [asset, setAsset] = useState<AssetBaseConfig>(assetsBaseConfig.BUSD);
  const [value, setValue] = useState<string>("");
  const { togglePending } = useGlobalState();

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

    console.log(transactionType);
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
        to: "0x081B3edA60f50631E5e966ED75bf6598cF69ee3C",
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
    }
    const submitRelayTxResponse = await post(API.backend.submitRelayTx, {
      forwardRequest: values.userOps,
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
  }, [value, togglePending, library, account, transactionType]);

  return (
    <Layout>
      <TransactionFlowModals
        asset={asset}
        buttonState={"Approval"}
        text={value}
        executeTx={executeTx}
      />
      <AssetListModal
        setShowTokenModal={setShowTokenModal}
        visible={showTokenModal}
        setAsset={setAsset}
      />
      <WalletModal
        setShowTokenModal={setShowTokenModal}
        setTransactionType={setTransactionType}
        asset={asset}
        value={value}
        setValue={setValue}
      />
    </Layout>
  );
};

export default Home;
