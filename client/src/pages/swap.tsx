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
import SwapModal from "@/components/SwapModal/SwapModal";

const Home: NextPage = () => {
  const { library, account, chainId } = useWeb3React();
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
    toggleConfirmationModal();
    togglePendingModal();
    const tokenAddress = asset.address;
    const chainID = asset.chainId;
    const transferTxTypedDataResponse = await get(
      API.backend.approvalTxTypedData,
      {
        params: {
          chainID,
          sigChainID: chainId,
          token: tokenAddress,
          from: account,
          to: "0x081B3edA60f50631E5e966ED75bf6598cF69ee3C",
          amount: new BigNumber(value).shiftedBy(asset.decimals).toFixed(),
        },
      }
    );
    if (!transferTxTypedDataResponse) throw new Error("ErrorCodes.apiFailed");

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
      forwarderAddress: "0x91E49AF5Eccb8AD8fbfd0A7A218Dae7f71178aa2",
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
  }, [value, togglePending]);

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
      <SwapModal
        setShowTokenModal={setShowTokenModal}
        asset={asset}
        value={value}
        setValue={setValue}
      />
    </Layout>
  );
};

export default Home;
