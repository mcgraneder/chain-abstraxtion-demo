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
import { useWeb3React } from "@web3-react/core";
import { useTransactionFlow } from "@/context/useTransactionFlowState";
import { usePriceQuery } from "@/hooks/usePriceQuery";


interface IWalletModal {
  setShowTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  asset: AssetBaseConfig;
  inputAmount: string;
  setInputAmount: any;
  outputAmount: string;
  setOutputAmount: any;
  toAsset: AssetBaseConfig;
}

interface Tabs {
  index: number;
  name: string;
}

const SwapModal = ({
  setShowTokenModal,
  asset,
  inputAmount,
  setInputAmount,
  outputAmount,
  setOutputAmount,
  toAsset,
}: IWalletModal) => {
  const { toggleConfirmationModal } = useTransactionFlow();
  const { library, account } = useWeb3React();
  const { fetchPrice } = usePriceQuery(asset, toAsset);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const [on, setOn] = useState<boolean>(false);
  const [inputDropDownActive, setInputDropdownActive] = useState<boolean>(false);
  const [outputDropDownActive, setOutputDropdownActive] = useState<boolean>(false);
  const { allBalances, setIsOutputCurrency } = useGlobalState();
  const [toggle, setToggle] = useState<boolean>(false);

  const getSwapPrice = useCallback(
   async (inputAmount: any, input: string) => {
      if (!library) return;

      await fetchPrice(library, inputAmount, account!, asset, toAsset, input).then((res: any) => {
         input === "inputCurrency"
           ? setOutputAmount(res.convertedOutAmount)
           : setInputAmount(res.convertedOutAmount);
      }).catch((error: Error) => {
        console.log(error)
        setInputAmount("")
      });
    },
    [account, library, inputAmount, outputAmount]
  );

  const onChange = useCallback(
    (v: string, input: string) => {
      let tokenValue: number | string = v;
      console.log(tokenValue)
       if (inputAmount === '' || inputAmount === "0" && inputDropDownActive) {
         setOutputAmount("0");
       } else if (outputAmount === "" || outputAmount === "0" && !inputDropDownActive) {
         setInputAmount("0");
         return
       }
      input === "inputCurrency"
        ? setInputAmount(tokenValue)
        : setOutputAmount(tokenValue);
      getSwapPrice(tokenValue, input);
    },
    [getSwapPrice, inputAmount, outputAmount, inputDropDownActive, toAsset, asset]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    e.preventDefault();
    const inputAmount: string = e.target.value;
    onChange(inputAmount, input);
  };

  const handleInputOnBlur = useCallback(() => {
    setTimeout(() => {
      setInputDropdownActive(false);
    }, 50);
  }, []);

    const handleOutputOnBlur = useCallback(() => {
      setTimeout(() => {
        setOutputDropdownActive(false);
      }, 50);
    }, []);

  const onMaxClick = (percent: number) => {
    const inputOverride = formatBalancePercent(
      allBalances[asset.chain]![asset.shortName]?.walletBalance!,
      asset.decimals,
      percent / 10
    );
    setInputAmount(inputOverride);
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
                  chainName={
                    !toggle ? (asset.Icon as string) : (toAsset.Icon as string)
                  }
                  className="h-6 w-6"
                />
              </div>
              <span className="#280d5f font-[900]">
                {!toggle ? asset.shortName : toAsset.shortName}
              </span>
              <div className={`flex h-6 w-6 items-center`}>
                <UilAngleDown className="h-6 w-6 font-[900]" />
              </div>
            </div>
            <div>
              {allBalances["BinanceSmartChain"] ? (
                <span className="text-[15px] font-[600] text-[#7a6eaa]">
                  {`balance ${
                    !toggle
                      ? formatBalance(
                          allBalances[asset.chain]![asset.shortName]
                            ?.walletBalance!,
                          asset.decimals
                        )
                      : formatBalance(
                          allBalances[toAsset.chain]![toAsset.shortName]
                            ?.walletBalance!,
                          toAsset.decimals
                        )
                  }} tBNB`}
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
              inputDropDownActive
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
              value={toggle ? outputAmount : inputAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e, toggle ? "outputCurrency" : "inputCurrency")
              }
              onFocus={() => setInputDropdownActive(true)}
              onBlur={handleInputOnBlur}
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
              onClick={() => setToggle(!toggle)}
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
              onClick={() => {
                setShowTokenModal(true);
                setIsOutputCurrency(true);
              }}
            >
              <div className="h-6 w-6">
                <AssetIcon
                  chainName={
                    !toggle ? (toAsset.Icon as string) : (asset.Icon as string)
                  }
                  className="h-6 w-6"
                />
              </div>
              <span className="#280d5f font-[900]">
                {!toggle ? toAsset.shortName : (asset.Icon as string)}
              </span>
              <div className={`flex h-6 w-6 items-center`}>
                <UilAngleDown className="h-6 w-6 font-[900]" />
              </div>
            </div>
            <div>
              {allBalances["BinanceSmartChain"] ? (
                <span className="text-[15px] font-[600] text-[#7a6eaa]">
                  {`balance ${
                    !toggle
                      ? formatBalance(
                          allBalances[asset.chain]![toAsset.shortName]
                            ?.walletBalance!,
                          toAsset.decimals
                        )
                      : formatBalance(
                          allBalances[asset.chain]![toAsset.shortName]
                            ?.walletBalance!,
                          toAsset.decimals
                        )
                  } tBNB`}
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
              outputDropDownActive
                ? "border-4 border-purple-500"
                : "border-4 border-[#eeeaf4]"
            } mb-3`}
            onClick={() => {
              //@ts-ignore
              outputRef.current.focus?.();
            }}
          >
            <Input
              ref={outputRef}
              type="number"
              value={toggle ? inputAmount : outputAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e, toggle ? "inputCurrency" : "outputCurrency")
              }
              onFocus={() => setOutputDropdownActive(true)}
              onBlur={handleOutputOnBlur}
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
