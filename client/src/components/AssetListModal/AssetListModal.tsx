import React, { useState, useCallback, useRef } from "react";
import { Input, TokenInput, TokenInputContainer } from "../CSS/AssetListModal.styles";
import { FormWrapper2 } from "../CSS/WalletModal.styles";
import { Backdrop } from "../CSS/WalletModal.styles";
import { Icon } from "../Icons/AssetLogs/Icon";
import { AssetBaseConfig, assetsBaseConfig } from "@/utils/assetsConfig";
import { UilTimes } from '@iconscout/react-unicons';
import { useGlobalState } from "@/context/GlobalState";
import { formatBalance } from "@/utils/misc";

interface IAssetModal {
  setShowTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
  setAsset: React.Dispatch<React.SetStateAction<AssetBaseConfig>>;
  setToAsset: React.Dispatch<React.SetStateAction<AssetBaseConfig>>;
}

const AssetListModal = ({
  setShowTokenModal,
  visible,
  setAsset,
  setToAsset
}: IAssetModal) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
    const [dropDownActive, setDropdownActive] = useState<boolean>(false);
    const inputRef = useRef(null);
    const { allBalances, isOutputCurrency, setIsOutputCurrency } = useGlobalState()

    const handleOnBlur = useCallback(() => {
      setTimeout(() => {
        setDropdownActive(false);
      }, 500);
    }, []);
  const close = useCallback((): void => {
    setShowTokenModal(false);
    setSearchTerm("");
  }, [setSearchTerm, setShowTokenModal]);

  const handleSearch = (val: any) => {
    if (!val) return;
    return (
      searchTerm === "" ||
      val.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCurrencyChange = useCallback(
    (option: AssetBaseConfig): void => {
      console.log(isOutputCurrency);
      isOutputCurrency ? setToAsset(option) : setAsset(option);
      setShowTokenModal(false);
      setIsOutputCurrency(false);
    },
    [setAsset, setShowTokenModal, isOutputCurrency]
  );

  return (
    <Backdrop visible={visible}>
      <FormWrapper2>
        <div className="border-[rgb(231,227,235)]; border-b px-[25px] pb-[15px] pt-[30px]">
          <div className={`mb-2 flex items-center ${"justify-between"} pb-4`}>
            <div>
              <span className="text-[18px] font-[900]">Select a Token</span>
            </div>
            <div onClick={close}>
              <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
            </div>
          </div>
          <div
            className={`my-1 flex h-[55px] w-full flex-col  justify-between gap-6 rounded-2xl bg-[#eeeaf4] px-2 py-2 ${
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
              type="text"
              placeholder="Search name or paste address"
              onFocus={() => setDropdownActive(true)}
              onBlur={handleOnBlur}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mb-2 mt-4 flex flex-row items-center justify-start gap-2">
            <div className="flex items-center justify-center gap-1 rounded-xl border border-[#eeeaf4] bg-white  p-2">
              <Icon chainName="BTC" className="h-6 w-6" />
              <span className="mx-1">BTC</span>
            </div>
            <div className="flex items-center justify-center gap-1 rounded-xl border border-[#eeeaf4] bg-white  p-2">
              <Icon chainName="ETH" className="h-6 w-6" />
              <span className="mx-1">ETH</span>
            </div>
          </div>
        </div>
        <div className=" max-h-[287px] min-h-[287px] overflow-y-auto bg-white">
          {allBalances["BinanceSmartChain"] !== undefined &&
            Object.values(assetsBaseConfig)
              .filter((val) => {
                return handleSearch(val);
              })
              // .sort(handleSort)
              .map((asset: AssetBaseConfig, index: number) => {
                console.log(allBalances.length);
                const formattedBalance = formatBalance(
                  allBalances[asset.chain]![asset.shortName]?.walletBalance!, asset.decimals
                );
                return (
                  <div
                    key={index}
                    className="cursor: pointer flex items-center justify-between px-8 py-[10px] hover:cursor-pointer hover:bg-[#f6f3f9]"
                    onClick={() => handleCurrencyChange(asset)}
                  >
                    <div className="flex items-center justify-center gap-4">
                      <Icon
                        chainName={asset.Icon as string}
                        className="h-8 w-8"
                      />
                      <div className="flex flex-col items-start justify-start text-center">
                        <span className="text-[16px] font-semibold leading-tight">
                          {asset.shortName}
                        </span>
                        <span className="text-[14px] leading-tight text-gray-500">
                          {asset.fullName}
                        </span>
                      </div>
                    </div>
                    <span className="text-[14px]">{formattedBalance}</span>
                  </div>
                );
              })}
        </div>
        <div className="border-t border-[#eeeaf4] px-[25px] py-[15px] text-center">
          <span className="text-center text-[17px] font-semibold text-blue-500">
            Currency selection
          </span>
        </div>
      </FormWrapper2>
    </Backdrop>
  );
};

export default AssetListModal;
