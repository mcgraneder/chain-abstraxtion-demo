import React, { useState, useEffect, useCallback, useRef } from "react";
import { BridgeModalContainer, Input } from "../CSS/Wallet.styles";
import { Icon as AssetIcon } from "../Icons/AssetLogs/Icon";
import {
  UilAngleDown,
  UilSpinnerAlt,
  UilArrowDown,
  UilExchange
} from "@iconscout/react-unicons";
import { useGlobalState } from "@/context/GlobalState";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import { formatBalance, formatBalancePercent } from "@/utils/misc";
import getContract from "@/utils/getContract";
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import { useWeb3React } from "@web3-react/core";
import { Wallet, ethers } from "ethers";
import { getMetaTxTypedData } from "@/utils/getMetaTx";
import ForwarderABI from "../../constants/ABIs/ForwarderABI.json";
import API from "@/constants/Api";
import BigNumber from "bignumber.js";
import { get, post } from "@/services/axios";
import {
  IPosition,
  notifyType,
  useNotification,
} from "@/context/useNotificationState";
import { useTransactionFlow } from "@/context/useTransactionFlowState";

interface IWalletModal {
  setShowTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  asset: AssetBaseConfig;
  value: string;
  setValue: any;
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

const SwapModal = ({
  setShowTokenModal,
  asset,
  value,
  setValue,
}: IWalletModal) => {
  const { toggleConfirmationModal } = useTransactionFlow();
  const [on, setOn] = useState<boolean>(false)
  const [dropDownActive, setDropdownActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const inputRef = useRef(null);
  const { allBalances, togglePending, exec } = useGlobalState();

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      setDropdownActive(false);
    }, 500);
  }, []);

  const onMaxClick = (percent: number) => {
    const inputOverride = formatBalancePercent(
      allBalances[asset.chain]![asset.shortName]?.walletBalance!,
      asset.decimals,
      percent / 10
    );
    setValue(inputOverride);
  };
  return (
    <div className="mt-[100px]">
      <BridgeModalContainer>
        <div className="m-4 flex flex-col items-start justify-start gap-2 px-2 py-2">
          <div>
            <span className="text-[18px] font-[900]">Wallet</span>
          </div>
          <div className="my-1">
            <span className="text-[15px] font-[600] text-[#7a6eaa]">
              Swap tokens without hassle
            </span>
          </div>
        </div>
        <div className="h-[1px] w-full bg-[rgb(231,227,235)]"></div>
        <div className="m-4 flex flex-col items-start justify-start gap-2 px-2 py-2">
          <div className="flex w-full items-center justify-between hover:text-[#7a6eaa]">
            <div
              className={`itrm flex items-center justify-center gap-2 hover:cursor-pointer`}
              onClick={() => setShowTokenModal(true)}
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
            <div>
              {allBalances["BinanceSmartChain"] ? (
                <span className="text-[15px] font-[600] text-[#7a6eaa]">
                  {`balance ${formatBalance(
                    allBalances[asset.chain]![asset.shortName]?.walletBalance!,
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
          </div>
          <div
            className={`my-1 flex h-[120px] w-full flex-col  justify-between gap-4 rounded-2xl bg-[#eeeaf4] px-2 py-2 ${
              dropDownActive
                ? "border-4 border-purple-500"
                : "border-4 border-[#eeeaf4]"
            } mb-3`}
            onClick={() => {
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
          <div className=" w-full">
            <div
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#eeeaf4] hover:cursor-pointer hover:bg-[#1fc7d4]"
              onMouseEnter={() => setOn(true)}
              onMouseLeave={() => setOn(false)}
            >
              {on ? (
                <UilExchange className="h-8 w-8 font-[900] text-white" />
              ) : (
                <UilArrowDown className="h-8 w-8 text-[#1fc7d4] hover:text-[#33e1ed]" />
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-between hover:text-[#7a6eaa]">
            <div
              className={`itrm flex items-center justify-center gap-2 hover:cursor-pointer`}
              onClick={() => setShowTokenModal(true)}
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
            <div>
              {allBalances["BinanceSmartChain"] ? (
                <span className="text-[15px] font-[600] text-[#7a6eaa]">
                  {`balance ${formatBalance(
                    allBalances[asset.chain]![asset.shortName]?.walletBalance!,
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
          </div>
          <div
            className={`my-1 flex h-[90px] w-full flex-col  justify-between gap-4 rounded-2xl bg-[#eeeaf4] px-2 py-2 ${
              dropDownActive
                ? "border-4 border-purple-500"
                : "border-4 border-[#eeeaf4]"
            } mb-3`}
            onClick={() => {
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
          </div>

          <div
            className=" flex w-full items-center justify-center rounded-[24px] bg-[#1fc7d4] py-3 hover:bg-[#33e1ed]"
            onClick={toggleConfirmationModal}
          >
            <span className="text-[18px] font-[900] text-white">Deposit</span>
          </div>
        </div>
      </BridgeModalContainer>
    </div>
  );
};

export default SwapModal;
