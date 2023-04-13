import React, { useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useViewport } from "../../hooks/useViewport";
import { Breakpoints } from "../../constants/Breakpoints";
import BottomSheetOptions from "../BottomSheet/BottomSheet";
import PrimaryButton from "../Buttons/PrimaryButton";
import {
  UilTimes,
  UilAngleRightB,
  UilSun,
  UilCheckCircle,
} from "@iconscout/react-unicons";
import { useRouter } from "next/router";
import Identicon from "../Identicon/Identicon";
import { shortenAddress } from "../../utils/misc";
import CopyIcon from "../Icons/CopyIcon";
import { ExternalLink, Power } from "react-feather";
import styled, { css } from "styled-components";
import BalanceDisplay from "../BalanceDisplay/BalanceDisplay";
import Tooltip from "../Tooltip/Tooltip";
import useWallet from "@/hooks/useWallet";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { Backdrop } from "../CSS/WalletModal.styles";

interface AccountDetailsProps {
  toggleAccoundDetailsModal: () => void;
  showAccount?: boolean;
}

interface ITopRow {
  account: any;
  toggleAccoundDetailsModal: () => void;
}

export const TopRowNavigation = ({
  account,
  toggleAccoundDetailsModal,
}: ITopRow) => {
  const { disconnect } = useWallet();
  const { chainId } = useWeb3React();
  const explorerLink =" CHAINS[chainId!]?.explorerLink";
  return (
    <div className={`mb-2 flex items-center justify-between px-2`}>
      <div className="flex items-center gap-2">
        <Identicon />
        <span className="text-[16px]">{shortenAddress(account, 12)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip content={"Copy Address"}>
          <div className="rounded-xl bg-[#eeeaf4] p-0.5 hover:bg-gray-300">
            <CopyIcon text={account} />
          </div>
        </Tooltip>

        <div className="rounded-xl bg-[#eeeaf4] p-0.5 hover:bg-gray-300">
          <Tooltip content={"View address on explorer"}>
            <button className="bg-black-600 rounded-full p-[5px]">
              <a
                href={explorerLink}
                rel="noreferrer noopener"
                target={"_blank"}
              >
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            </button>
          </Tooltip>
        </div>
        <div className="rounded-xl bg-[#eeeaf4] p-0.5 hover:bg-gray-300">
          <Tooltip content={"Disconnect"}>
            <button
              className="bg-black-600 rounded-full p-[5px]"
              onClick={disconnect}
            >
              <Power className="h-4 w-4 text-gray-400 " />
            </button>
          </Tooltip>
        </div>
        <div className="rounded-xl bg-[#eeeaf4] p-0.5 hover:bg-gray-300">
          <button
            className="bg-black-600 rounded-full p-[5px]"
            onClick={toggleAccoundDetailsModal}
          >
            <UilTimes className="h-4 w-4 text-gray-400 " />
          </button>
        </div>
      </div>
    </div>
  );
};

const AccountDetailsModalIner = ({
  toggleAccoundDetailsModal,
  toggleTxModal,
}: AccountDetailsProps & { toggleTxModal: () => void }) => {
  const { disconnect } = useWallet();
  const { account } = useWeb3React();
  const { push } = useRouter();

  const deactivate = (): void => {
    disconnect();
    toggleAccoundDetailsModal();
    push("/home");
  };

  return (
    <>
      <TopRowNavigation
        account={account}
        toggleAccoundDetailsModal={toggleAccoundDetailsModal}
      />
      <BalanceDisplay />
      <hr className="mx-[4px] h-[1px] border-[rgb(231,227,235)]" />
      <div className="mt-4 flex items-center justify-center">
        <PrimaryButton
          className={
            "w-full justify-center rounded-lg bg-blue-500 py-[10px] text-center"
          }
          onClick={deactivate}
        >
          Disconnect
        </PrimaryButton>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div
          className="flex w-full items-center justify-between rounded-xl p-2 hover:cursor-pointer hover:bg-[#eeeaf4]"
          onClick={toggleTxModal}
        >
          <span className="text-[15px] text-gray-400">Recent Transactions</span>
          <UilAngleRightB className={"text-gray-400"} />
        </div>
        <div className="flex w-full items-center justify-between rounded-xl p-2 hover:cursor-pointer hover:bg-[#eeeaf4]">
          {/* <Tooltip content="Light Theme Not Implemented yet" className="flex justify-between w-full"> */}
          <span className="text-[15px] text-gray-400">Dark Theme</span>
          <UilSun className={"text-gray-400"} />
          {/* </Tooltip> */}
        </div>
      </div>
    </>
  );
};


function AccountDetailsModal({
  toggleAccoundDetailsModal,
  showAccount,
}: AccountDetailsProps) {
  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const { width } = useViewport();

  const toggleTxModal = useCallback(() => {
    setShowTransactions((t: boolean) => !t);
  }, [setShowTransactions]);
  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Backdrop visible={showAccount}>
          <FormWrapper>
            <AccountDetailsModalIner
              toggleAccoundDetailsModal={toggleAccoundDetailsModal}
              toggleTxModal={toggleTxModal}
            />
          </FormWrapper>
        </Backdrop>
      ) : (
        <BottomSheetOptions
          hideCloseIcon
          open={showAccount!}
          setOpen={toggleAccoundDetailsModal}
          title={"Connecting"}
        >
          <AccountDetailsModalIner
            toggleAccoundDetailsModal={toggleAccoundDetailsModal}
            toggleTxModal={toggleTxModal}
          />
        </BottomSheetOptions>
      )}
    </>
  );
}

export default AccountDetailsModal;
