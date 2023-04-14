import React, { useState, useEffect } from "react";
import { AddressInput, BridgeModalContainer } from "../CSS/Wallet.styles";
import { useGlobalState } from "@/context/GlobalState";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import { formatBalance } from "@/utils/misc";
import { WarningPopup } from "../WarningModal/WarningModal";
import TransactionButton from "../Buttons/TransactionButton";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import ModalDescriptor from "../Common/ModalDescriptor";

interface IWalletModal {
  setShowTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTransactionType: React.Dispatch<React.SetStateAction<string>>;
  asset: AssetBaseConfig;
  value: string;
  setValue: any;
  recipient: string;
  setRecipient: any;
  transactionType: string;
}

interface Tabs {
  index: number;
  name: string;
}

const TABS: Tabs[] = [
  {
    index: 0,
    name: "Deposit",
  },
  {
    index: 1,
    name: "Withdraw",
  },
  {
    index: 2,
    name: "Transfer",
  },
];

const WalletTabs = ({ setTransactionType }: { setTransactionType: any }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <div className="flex flex-row justify-between gap-2 border-b border-[rgb(231,227,235)]">
      {TABS.map((tab: Tabs, index: number) => {
        return (
          <div
            className={`flex items-center justify-center ${
              activeTab === index && "border-b-2 border-[#1fc7d4]"
            } px-6 py-2 hover:cursor-pointer`}
            onClick={() => {
              setActiveTab(index);
              setTransactionType(tab.name);
            }}
          >
            <span
              className={`${
                activeTab === index
                  ? "text-[rgb(118,69,217)]"
                  : "text-[#7a6eaa]"
              } font-[800]`}
            >
              {tab.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const WalletModal = ({
  setShowTokenModal,
  setTransactionType,
  asset,
  value,
  setValue,
  recipient,
  setRecipient,
  transactionType,
}: IWalletModal) => {
  const [isSufficentBalance, setIsSufficientBalance] = useState<boolean>(true);
  const { allBalances } = useGlobalState();

  useEffect(() => {
    if (typeof allBalances["BinanceSmartChain"] === "undefined") return;
    const inputOverride = formatBalance(
      allBalances[asset.chain]![asset.shortName]?.walletBalance!,
      asset.decimals
    );
    setIsSufficientBalance(+inputOverride >= Number(value));
  }, [value, setIsSufficientBalance, asset, allBalances]);

  return (
    <div className="mt-[100px]">
      <WarningPopup />
      <BridgeModalContainer>
        <ModalDescriptor
          heading="Wallet"
          subTitle="Deposit, withdraw or transfer tokens"
          seperator={false}
        />
        <WalletTabs setTransactionType={setTransactionType} />
        <div className="m-4 flex flex-col items-start justify-start gap-2 px-2 py-2">
          <CurrencyInput
            asset={asset}
            setShowTokenModal={setShowTokenModal}
            value={value}
            setValue={setValue}
            handleChange={(e: any) => setValue(e.currentTarget.value)}
            allBalances={allBalances}
            inputCurrency={false}
          />
          {transactionType === "Transfer" && (
            <div className="mb-4 w-full">
              <AddressInput
                type="text"
                placeholder="enter recipient address"
                value={recipient}
                onChange={(e: any) => setRecipient(e.currentTarget.value)}
              />
            </div>
          )}
          <TransactionButton
            isSufficentBalance={isSufficentBalance}
            transactionType={transactionType}
          />
        </div>
      </BridgeModalContainer>
    </div>
  );
};

export default WalletModal;
