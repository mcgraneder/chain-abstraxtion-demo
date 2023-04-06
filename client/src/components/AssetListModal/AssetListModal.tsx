import React, { useState, useCallback, useRef } from "react";
import { Input, TokenInput, TokenInputContainer } from "../CSS/AssetListModal.styles";
import { FormWrapper2 } from "../CSS/WalletModal.styles";
import { Backdrop } from "../CSS/WalletModal.styles";
import { Icon } from "../Icons/AssetLogs/Icon";
import { AssetBaseConfig, assetsBaseConfig } from "@/utils/assetsConfig";
import { UilTimes } from '@iconscout/react-unicons';

interface IAssetModal {
  setShowTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
  setAsset: React.Dispatch<React.SetStateAction<AssetBaseConfig>>;
}

const AssetListModal = ({
  setShowTokenModal,
  visible,
  setAsset,
}: IAssetModal) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
    const [dropDownActive, setDropdownActive] = useState<boolean>(false);
    const inputRef = useRef(null);

    const handleOnBlur = useCallback(() => {
      setTimeout(() => {
        setDropdownActive(false);
      }, 500);
    }, []);
  const close = useCallback((): void => {
    setShowTokenModal(false);
    setSearchTerm("");
  }, [setSearchTerm, setShowTokenModal]);

//   const handleSearch = (val: any) => {
//     if (!val) return;
//     return (
//       searchTerm === "" ||
//       val.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       val.fullName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const handleSort = (a: any, b: any) => {
//     if (buttonState.tabName === "Deposit") {
//       if (
//         Number(assetBalances[a.Icon]?.walletBalance) >
//         Number(assetBalances[b.Icon]?.walletBalance)
//       )
//         return -1;
//     } else {
//       if (
//         Number(assetBalances[a.Icon]?.bridgeBalance) >
//         Number(assetBalances[b.Icon]?.bridgeBalance)
//       )
//         return -1;
//     }
//     return 0;
//   };

//   const setSelectedToken = React.useCallback(
//     (option: any, type: string) => {
//       if (type === "currency") {
//         setAsset(option);
//       } else if (type === "chain" && chainType === "from") {
//         setFromChain(option);
//       } else if (type === "chain" && chainType === "destination") {
//         setDestinationChain(option);
//       }
//       setSearchTerm("");
//       close();
//     },
//     [close, setAsset, setDestinationChain, chainType, setFromChain]
//   );

//   const handleCurrencyChange = useCallback(
//     (currency: string, option: Partial<AssetConfig>): void => {
//       setSelectedToken(option, "currency");
//       if (WhiteListedLegacyAssets.includes(option.Icon as Asset))
//         setFromChain(chainsBaseConfig[option.fullName as Chain]);
//       const selectedCurrency = getOptionBySymbol(currency, "currency");
//       localStorage.setItem(
//         "selected_currency",
//         JSON.stringify(selectedCurrency)
//       );
//       setShowTokenModal(false);
//     },
//     [setSelectedToken, setShowTokenModal, setFromChain]
//   );

//   const handleChainChange = useCallback(
//     (chain: string, option: any): void => {
//       setSelectedToken(option, "chain");
//       const selectedChain = getOptionBySymbol(chain, "chain");
//       localStorage.setItem("selected_chain", JSON.stringify(selectedChain));
//       setShowTokenModal(false);
//     },
//     [setSelectedToken, setShowTokenModal]
//   );
  return (
    <Backdrop visible={visible}>
      <FormWrapper2>
        <div className="border-[rgb(231,227,235)]; border-b px-[25px] pb-[15px] pt-[30px]">
          <div
            className={`mb-2 flex items-center ${"justify-between"} pb-4`}
          >
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
              type="number"
              placeholder="Search name or paste address"
              onFocus={() => setDropdownActive(true)}
              onBlur={handleOnBlur}
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
          {Object.values(assetsBaseConfig)
            // .filter((val: string) => {
            //   return handleSearch(val);
            // })
            // .sort(handleSort)
            .map((asset: AssetBaseConfig, index: number) => {
              return (
                <div
                  key={index}
                  className="cursor: pointer flex items-center justify-between px-8 py-[10px] hover:cursor-pointer hover:bg-[#f6f3f9]"
                  onClick={() => null}
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
                  {/* {walletAssetType === "currency" ? (
                      <span className="text-[14px]">{formattedBalance}</span>
                    ) : null} */}
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
