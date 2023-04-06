import React, { useState, useEffect, useCallback, useRef } from "react";
import { BridgeModalContainer, Input } from "../CSS/Wallet.styles";
import { Icon as AssetIcon } from "../Icons/AssetLogs/Icon";
import { UilAngleDown } from "@iconscout/react-unicons";

interface IWalletModal {
  setShowTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const WalletModal = ({ setShowTokenModal }: IWalletModal) => {
  const [dropDownActive, setDropdownActive] = useState<boolean>(false);
  const inputRef = useRef(null);

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      setDropdownActive(false);
    }, 500);
  }, []);
  return (
    <div className="mt-[100px]">
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
        <div>
          <div className="h-[1px] w-full bg-[rgb(231,227,235)]"></div>
        </div>
        <div className="m-4 flex flex-col items-start justify-start gap-2 px-2 py-2">
          <div className="flex w-full items-center justify-between hover:text-[#7a6eaa]">
            <div
              className={`flex items-center justify-center gap-2 hover:cursor-pointer`}
              onClick={() => setShowTokenModal(true)}
            >
              <div className="h-6 w-6">
                <AssetIcon
                  chainName={"BinanceSmartChain" as string}
                  className="h-6 w-6"
                />
              </div>
              <span className="#280d5f font-[900]">tBNB</span>
              <div className={`flex h-6 w-6 items-center`}>
                <UilAngleDown className="h-6 w-6 font-[900]" />
              </div>
            </div>
            <div>
              <span className="text-[15px] font-[600] text-[#7a6eaa]">
                balance 0.00123 tBNB
              </span>
            </div>
          </div>
          <div
            className={`my-1 flex h-[120px] w-full flex-col  justify-between gap-4 rounded-2xl bg-[#eeeaf4] px-2 py-2 ${
              dropDownActive
                ? "border-4 border-purple-500"
                : "border-[#eeeaf4] border-4"
            } mb-3`}
            onClick={() => {
              inputRef.current.focus();
            }}
          >
            <Input
              ref={inputRef}
              type="number"
              onFocus={() => setDropdownActive(true)}
              onBlur={handleOnBlur}
            />
            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center justify-center rounded-2xl border-2 border-[#1fc7d4] text-center">
                <span className="px-2 py-[0.5px] text-[15px] font-[800] text-[#1fc7d4] hover:text-[#33e1ed]">
                  25%
                </span>
              </div>
              <div className="flex items-center justify-center rounded-2xl border-2 border-[#1fc7d4] text-center">
                <span className="px-2 py-[0.5px] text-[15px] font-[800] text-[#1fc7d4] hover:text-[#33e1ed]">
                  50%
                </span>
              </div>
              <div className="flex items-center justify-center rounded-2xl border-2 border-[#1fc7d4] text-center">
                <span className="px-2 py-[0.5px] text-[15px] font-[800] text-[#1fc7d4] hover:text-[#33e1ed]">
                  75%
                </span>
              </div>
              <div className="flex items-center justify-center rounded-2xl border-2 border-[#1fc7d4] text-center">
                <span className="px-2 py-[0.5px] text-[15px] font-[800] text-[#1fc7d4] hover:text-[#33e1ed]">
                  100%
                </span>
              </div>
            </div>
          </div>
          <div className=" flex w-full items-center justify-center rounded-[24px] bg-[#1fc7d4] py-3 hover:bg-[#33e1ed]">
            <span className="text-[18px] font-[900] text-white">Deposit</span>
          </div>
        </div>
      </BridgeModalContainer>
    </div>
  );
};

export default WalletModal;
