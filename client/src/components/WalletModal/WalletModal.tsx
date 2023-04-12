import React, { useState, useEffect, useCallback, useRef } from "react";
import { AddressInput, BridgeModalContainer, Input } from "../CSS/Wallet.styles";
import { Icon as AssetIcon } from "../Icons/AssetLogs/Icon";
import { UilAngleDown, UilSpinnerAlt } from '@iconscout/react-unicons';
import { useGlobalState } from "@/context/GlobalState";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import { formatBalance, formatBalancePercent } from "@/utils/misc";
import getContract from "@/utils/getContract";
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import { useWeb3React } from "@web3-react/core";
import { Wallet, ethers } from "ethers";
import { getMetaTxTypedData } from "@/utils/getMetaTx";
import ForwarderABI from "../../constants/ABIs/ForwarderABI.json"
import API from "@/constants/Api";
import BigNumber from "bignumber.js";
import { get, post } from "@/services/axios";
import {
  IPosition,
  notifyType,
  useNotification,
} from "@/context/useNotificationState";
import { useTransactionFlow } from "@/context/useTransactionFlowState";
import { WarningPopup } from "../WarningModal/WarningModal";

interface IWalletModal {
  setShowTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTransactionType: React.Dispatch<React.SetStateAction<string>>;
  asset: AssetBaseConfig;
  value: string;
  setValue: any;
  response: boolean;
  recipient: string;
  setRecipient: any;
  transactionType: string
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

const WalletModal = ({ setShowTokenModal, setTransactionType, asset, value, setValue, response, recipient, setRecipient, transactionType }: IWalletModal) => {
  const { toggleConfirmationModal } = useTransactionFlow()
  const [isSufficentBalance, setIsSufficientBalance] = useState<boolean>(true)
  const [dropDownActive, setDropdownActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const inputRef = useRef(null);
  const { allBalances, togglePending, exec } = useGlobalState();
  const { account } = useWeb3React()

   const handleOnBlur = useCallback(() => {
     setTimeout(() => {
       setDropdownActive(false);
     }, 500);
   }, []);

   const onMaxClick = (percent: number) => {
     const inputOverride = formatBalancePercent(
       allBalances[asset.chain]![asset.shortName]?.walletBalance!,
       asset.decimals,
       percent / 100
     );
     setValue(inputOverride);
   };

    useEffect(() => {
      if (typeof allBalances["BinanceSmartChain"] === "undefined") return;
      const inputOverride = formatBalance(
        allBalances[asset.chain]![asset.shortName]?.walletBalance!,
        asset.decimals,
      );
      setIsSufficientBalance(+inputOverride >= Number(value));
    }, [value, setIsSufficientBalance, asset, allBalances]);
  return (
    <div className="mt-[100px]">
      <WarningPopup />
      <BridgeModalContainer>
        <div className="m-4 flex flex-col items-start justify-start gap-2 px-2 py-2">
          <div>
            <span className="text-[18px] font-[900]">Wallet</span>
          </div>
          <div className="my-1">
            <span className="text-[15px] font-[600] text-[#7a6eaa]">
              Deposit, withdraw or transfer tokens
            </span>
          </div>
        </div>
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
          {/* <div className="h-[1px] w-full bg-[rgb(231,227,235)]"></div> */}
        </div>
        <div className="m-4 flex flex-col items-start justify-start gap-2 px-2 py-2">
          <div className="flex w-full items-center justify-between hover:text-[#7a6eaa]">
            <div
              className={`itrm flex items-center justify-center gap-2 hover:cursor-pointer`}
              onClick={() => {
                if (!account) return;
                setShowTokenModal(true);
              }}
            >
              <div className="h-6 w-6">
                <AssetIcon
                  chainName={asset.Icon as string}
                  className="h-6 w-6"
                />
              </div>
              <span className="#280d5f font-[900]">{asset.shortName}</span>
              <div className={`flex h-6 w-6 items-center`}>
                <UilAngleDown className="h-6 w-6 font-[900]" />
              </div>
            </div>
            {account ? (
              <div>
                {allBalances["BinanceSmartChain"] ? (
                  <span className="text-[15px] font-[600] text-[#7a6eaa]">
                    {`balance ${formatBalance(
                      allBalances[asset.chain]![asset.shortName]
                        ?.walletBalance!,
                      asset.decimals
                    )} tBNB`}
                  </span>
                ) : (
                  <span className="text-[15px] font-[600] text-[#7a6eaa]">
                    fetching balance{" "}
                    <UilSpinnerAlt className="h-6 w-6 text-[#7a6eaa]" />
                  </span>
                )}
              </div>
            ) : null}
          </div>
          <div
            className={`my-1 flex h-[120px] w-full flex-col  justify-between gap-4 rounded-2xl bg-[#eeeaf4] px-2 py-2 ${
              dropDownActive
                ? "border-4 border-purple-500"
                : "border-4 border-[#eeeaf4]"
            } mb-3`}
            onClick={() => {
              //@ts-ignore
              inputRef.current.focus();
            }}
          >
            <Input
              ref={inputRef}
              type="number"
              value={value}
              onChange={(e: any) => setValue(e.currentTarget.value)}
              onFocus={() => setDropdownActive(true)}
              onBlur={handleOnBlur}
            />
            <div className="flex items-center justify-end gap-2">
              {[25, 50, 75, 100].map((percent: number) => {
                return (
                  <div
                    className="flex items-center justify-center rounded-2xl border-2 border-[#1fc7d4] text-center hover:cursor-pointer"
                    onClick={() => onMaxClick(percent)}
                  >
                    <span className="px-2 py-[0.5px] text-[15px] font-[800] text-[#1fc7d4] hover:text-[#33e1ed]">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
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
          <div
            className=" flex w-full items-center justify-center rounded-[24px] bg-[#1fc7d4] py-3 hover:bg-[#33e1ed]"
            onClick={() => {
              if (!account) return;
              toggleConfirmationModal();
            }}
          >
            {response ? (
              <span className="text-[18px] font-[900] text-white">
                {!account
                  ? "Connect Wallet"
                  : isSufficentBalance
                  ? transactionType
                  : "Insufficent Balance"}
              </span>
            ) : (
              <span className="text-[16px] font-[900] text-white">
                {"Starting Server. Please wait"}
              </span>
            )}
          </div>
        </div>
      </BridgeModalContainer>
    </div>
  );
};

export default WalletModal;
