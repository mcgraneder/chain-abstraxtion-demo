import { useState, useCallback, useRef } from "react";
import { AssetBaseConfig } from "@/utils/assetsConfig";
import { useWeb3React } from "@web3-react/core";
import { UilSpinnerAlt, UilAngleDown } from "@iconscout/react-unicons";
import { Input } from "../CSS/Wallet.styles";
import { Icon as AssetIcon } from "../Icons/AssetLogs/Icon";
import { formatBalance, formatBalancePercent } from "@/utils/misc";
import { MulticallReturn } from "@/context/GlobalState";

interface ICurrencyProps {
  asset: AssetBaseConfig;
  setShowTokenModal: any;
  value: string;
  setValue: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, input: string) => void;
  allBalances: {
    [chain: string]: {
        [x: string]: MulticallReturn;
    };}
  inputCurrency: boolean;
}

export const BalanceMultiplier = ({
  onMaxClick,
}: {
  onMaxClick: (percent: number) => void;
}) => {
  return (
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
  );
};

const CurrencyInput = ({
  asset,
  setShowTokenModal,
  value,
  setValue,
  handleChange,
  allBalances,
  inputCurrency,
}: ICurrencyProps) => {
  const { account } = useWeb3React();
  const [dropDownActive, setDropdownActive] = useState<boolean>(false);
  const inputRef = useRef(null);

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
  return (
    <>
      <div className="flex w-full items-center justify-between hover:text-[#7a6eaa]">
        <div
          className={`itrm flex items-center justify-center gap-2 hover:cursor-pointer`}
          onClick={() => {
            if (!account) return;
            setShowTokenModal(true);
          }}
        >
          <div className="h-6 w-6">
            <AssetIcon chainName={asset.Icon as string} className="h-6 w-6" />
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
                  allBalances[asset.chain]![asset.shortName]?.walletBalance!,
                  asset.decimals
                )} tBNB`}
              </span>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-[15px] font-[600] text-[#7a6eaa]">
                  fetching balance{" "}
                </span>
                <UilSpinnerAlt className="h-6 w-6 animate-spin text-[#7a6eaa]" />
              </div>
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
          onChange={handleChange}
          onFocus={() => setDropdownActive(true)}
          onBlur={handleOnBlur}
        />
        {inputCurrency ? <BalanceMultiplier onMaxClick={onMaxClick} /> : null}
      </div>
    </>
  );
};

export default CurrencyInput;
