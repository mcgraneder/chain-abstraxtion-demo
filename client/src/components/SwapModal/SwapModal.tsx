import React, { useState, useEffect, useCallback } from "react";
import { BridgeModalContainer } from "../CSS/Wallet.styles";
import {
  UilArrowDown,
  UilExchange,
} from "@iconscout/react-unicons";
import { useGlobalState } from "@/context/GlobalState";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import { formatBalance } from "@/utils/misc";
import { useWeb3React } from "@web3-react/core";
import { usePriceQuery } from "@/hooks/usePriceQuery";
import { WarningPopup } from "../WarningModal/WarningModal";
import TransactionButton from "../Buttons/TransactionButton";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import ModalDescriptor from "../Common/ModalDescriptor";

interface IWalletModal {
  setShowTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  asset: AssetBaseConfig;
  inputAmount: string;
  setInputAmount: any;
  outputAmount: string;
  setOutputAmount: any;
  toAsset: AssetBaseConfig;
}

const CurrencyToggle = ({ toggleSwap }: { toggleSwap: () => void }) => {
  const [on, setOn] = useState<boolean>(false);
  return (
    <div className=" w-full">
      <div
        className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#eeeaf4] hover:cursor-pointer hover:bg-[#1fc7d4]"
        onMouseEnter={() => setOn(true)}
        onMouseLeave={() => setOn(false)}
        onClick={toggleSwap}
      >
        {on ? (
          <UilExchange className="h-8 w-8 font-[900] text-white" />
        ) : (
          <UilArrowDown className="h-8 w-8 text-[#1fc7d4] hover:text-[#33e1ed]" />
        )}
      </div>
    </div>
  );
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
  const { library, account } = useWeb3React();
  const { fetchPrice } = usePriceQuery(asset, toAsset);
  const [isSufficentBalance, setIsSufficientBalance] = useState<boolean>(true);
  const { allBalances } = useGlobalState();
  const [toggle, setToggle] = useState<boolean>(false);

  const toggleSwap = useCallback(() => setToggle((t: boolean) => !t), [setToggle])

  const getSwapPrice = useCallback(
    async (inputAmount: any, input: string) => {
      if (!library) return;

      await fetchPrice(library, inputAmount, account!, asset, toAsset, input)
        .then((res: any) => {
          input === "inputCurrency"
            ? setOutputAmount(res.convertedOutAmount)
            : setInputAmount(res.convertedOutAmount);
        })
        .catch((error: Error) => {
          // setInputAmount("")
        });
    },
    [account, library, inputAmount, outputAmount]
  );

  const onChange = useCallback(
    (v: string, input: string) => {
      let tokenValue: number | string = v;

      if (inputAmount === "" || (inputAmount === "0")) {
        setOutputAmount("0");
      } else if (
        outputAmount === "" ||
        (outputAmount === "0")
      ) {
        setInputAmount("0");
        return;
      }
      input === "inputCurrency"
        ? setInputAmount(tokenValue)
        : setOutputAmount(tokenValue);
      getSwapPrice(tokenValue, input);
    },
    [
      getSwapPrice,
      inputAmount,
      outputAmount,
      toAsset,
      asset,
    ]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    e.preventDefault();
    const inputAmount: string = e.target.value;
    onChange(inputAmount, input);
  };

  useEffect(() => {
    if (typeof allBalances["BinanceSmartChain"] === "undefined") {
      setIsSufficientBalance(false);
      return;
    }
    const inputOverride = formatBalance(
      allBalances[asset.chain]![asset.shortName]?.walletBalance!,
      asset.decimals
    );
    setIsSufficientBalance(+inputOverride >= Number(inputAmount));
  }, [inputAmount, setIsSufficientBalance, asset, allBalances]);

  return (
    <div className="mt-[100px]">
      <WarningPopup />

      <BridgeModalContainer>
        <ModalDescriptor
          heading="Swap"
          subTitle="Swap tokens without hassle"
          seperator={true}
        />
        <div className="m-4 flex flex-col items-start justify-start gap-2 px-2 py-2">
          <CurrencyInput
            asset={asset}
            setShowTokenModal={setShowTokenModal}
            value={toggle ? outputAmount : inputAmount}
            setValue={setInputAmount}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, toggle ? "outputCurrency" : "inputCurrency")
            }
            allBalances={allBalances}
            inputCurrency={true}
          />
          <CurrencyToggle toggleSwap={toggleSwap}/>
          <CurrencyInput
            asset={asset}
            setShowTokenModal={setShowTokenModal}
            value={toggle ? inputAmount : outputAmount}
            setValue={setOutputAmount}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, toggle ? "inputCurrency" : "outputCurrency")
            }
            allBalances={allBalances}
            inputCurrency={false}
          />

          <TransactionButton
            isSufficentBalance={isSufficentBalance}
            transactionType={"Swap"}
          />
        </div>
      </BridgeModalContainer>
    </div>
  );
};

export default SwapModal;
