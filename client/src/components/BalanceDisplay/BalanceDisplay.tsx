import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { CHAINS } from "../../connection/chains";
import { GlowingText } from "../Transactions/TransactionTable";

interface ITokenDisplay {
  balance: any;
  chainId: number | undefined;
}

const BalanceDisplayInner = ({
  balance,
  chainId,
}: ITokenDisplay) => {
  return (
    <div
      className={`border my-5 flex min-h-[96px] flex-col items-center rounded-lg border-[rgb(231,227,235)] p-2 text-center`}
    >
      <span className=" text-[17px] text-[rgb(118,69,217)]">
        <span className="text-[rgb(118,69,217)]">BNB</span> Balance
        <span className="text-[rgb(118,69,217)]"> on Binance Testnet</span>
      </span>
      <span className="text-[36px]">
        {balance ? balance : "0.00"}
        {balance ? <span className="text-[36px]">{` ${CHAINS[chainId!]?.symbol}`}</span> : null}
      </span>
    </div>
  );
};
const BalanceDisplay = () => {
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const { library, account, chainId } = useWeb3React();

  useEffect(() => {
    if (!library || !account) return;
    library
      .getBalance(account)
      .then((balance: string): void =>
        setBalance(
         Number(ethers.utils.formatUnits(balance)).toFixed(4).toString()
        )
      );

    const balanceInteral: NodeJS.Timer = setInterval((): void => {
      library
        .getBalance(account)
        .then((balance: string): void =>
          setBalance(
            Number(ethers.utils.formatUnits(balance)).toFixed(4).toString()
          )
        );
    }, 60000);
    return (): void => clearInterval(balanceInteral);
  }, [balance, library, account]);

  return (
    <BalanceDisplayInner
      chainId={chainId}
      balance={balance}
    />
  );
};

export default BalanceDisplay;
