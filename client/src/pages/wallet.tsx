import React, { useState, useCallback, useEffect } from "react";
import AssetListModal from "@/components/AssetListModal/AssetListModal";
import WalletModal from "@/components/WalletModal/WalletModal";
import { Layout } from "@/layouts";
import type { NextPage } from "next";
import { AssetBaseConfig, assetsBaseConfig } from "../utils/assetsConfig";
import TransactionFlowModals from "@/components/TxConfirmationModalFlow";
import UserInfoModal from "@/components/UserInfoModal/UserInfoModal";
import useExecuteTransaction from "@/hooks/useExecuteTransaction";

const Home: NextPage = () => {
  const [transactionType, setTransactionType] = useState<string>("Deposit");
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [asset, setAsset] = useState<AssetBaseConfig>(assetsBaseConfig.BUSD);
  const [value, setValue] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const { executeTransaction } = useExecuteTransaction(
    asset,
    transactionType,
    value,
    asset,
    recipient
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const warning = localStorage.getItem("walletPageWarning");
    if (warning !== "true") setShowWarning(true);
  }, []);

  const closeWarning = useCallback(() => {
    setShowWarning(false);
    localStorage.setItem("walletPageWarning", "true");
  }, []);

  const executeTx = async () => {
    await executeTransaction();
  };

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
        recipient={recipient}
        setRecipient={setRecipient}
        transactionType={transactionType}
      />
    </Layout>
  );
};

export default Home;
