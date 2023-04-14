import React, { useState, useCallback, useEffect } from "react";
import AssetListModal from "@/components/AssetListModal/AssetListModal";
import { Layout } from "@/layouts";
import type { NextPage } from "next";
import { assetsBaseConfig } from "../utils/assetsConfig";
import TransactionFlowModals from "@/components/TxConfirmationModalFlow";
import SwapModal from "@/components/SwapModal/SwapModal";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import UserInfoModal from '../components/UserInfoModal/UserInfoModal';
import useExecuteTransaction from "@/hooks/useExecuteTransaction";

const Home: NextPage = () => {
 
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [asset, setAsset] = useState<AssetBaseConfig>(assetsBaseConfig.BUSD);
  const [inputAmount, setInputAmount] = useState("");
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [outputAmount, setOutputAmount] = useState("");
  const [toAsset, setToAsset] = useState<any>(assetsBaseConfig.CAKE);

   const { executeTransaction } = useExecuteTransaction(asset, "Swap", inputAmount, toAsset);

  useEffect(() => {
    setInputAmount("");
    setOutputAmount("");
  }, [showTokenModal]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const warning = localStorage.getItem("swapPageWarning");
    if (warning !== "true") setShowWarning(true);
  }, []);

  const closeWarning = useCallback(() => {
    setShowWarning(false);
    localStorage.setItem("swapPageWarning", "true");
  }, []);

  const executeTx = useCallback(async () => {
    await executeTransaction();
  }, [executeTransaction]);

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
      />
    </Layout>
  );
};

export default Home;
