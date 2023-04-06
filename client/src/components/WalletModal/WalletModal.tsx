import React, { useState, useEffect, useCallback, useRef } from "react";
import { BridgeModalContainer, Input } from "../CSS/Wallet.styles";
import { Icon as AssetIcon } from "../Icons/AssetLogs/Icon";
import { UilAngleDown } from "@iconscout/react-unicons";

const WalletModal = () => {
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
              className={`my-1 flex h-[100px] w-full  justify-end rounded-2xl bg-[#eeeaf4] px-4 ${
                dropDownActive ? "border-4 border-purple-500" : ""
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
            </div>
          <div className=" flex w-full items-center justify-center rounded-[24px] bg-[#1fc7d4] py-4">
            <span className="text-[18px] text-white">Deposit</span>
          </div>
        </div>
      </BridgeModalContainer>
    </div>
  );
};

export default WalletModal;
