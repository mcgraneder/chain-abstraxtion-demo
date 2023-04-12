import React, { useState, useCallback, useEffect } from "react";
import { Backdrop } from "@/components/CSS/WalletModal.styles";
import { UilAngleDown, UilTimes } from '@iconscout/react-unicons';
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { useWeb3React } from "@web3-react/core";
import AssetSummary from "./components/AssetSummary";
import FeeSummary from "./components/FeeSummary";
import TransactionSummary from "./components/TransactionSummary";
import ProtocolBanner from "./components/GasOptionSummary";
import styled from "styled-components"
import { useViewport } from "@/hooks/useViewport";
import BottomSheetOptions from "@/components/BottomSheet/BottomSheet";
import { Breakpoints } from "@/constants/Breakpoints";

export const FormWrapper = styled.div`
  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  background-color: rgb(13, 17, 28);
  text-align: right;
  padding: 30px 15px;
  padding-bottom: 20px;
  border-radius: 15px;
  display: block;
  z-index: 10000000000;
  border-radius: 24px;
  max-width: 400px;
  width: 100%;
  z-index: 1;
  border: 1px solid rgb(231, 227, 235);
  background: white;
  color: #280d5f;
  /* font-weight: 900; */
  /* padding: 20px; */
  position: relative;
`;

interface IAssetModalInner {
  asset: any;
  close: () => void;
  transactionType: string;
  text: string;
  executeTx: () => Promise<void>
}

const TxModalInner = ({
  asset,
  text,
  transactionType,
  close,
  executeTx
}: IAssetModalInner) => {
  return (
    <>
      <div className={`mb-2 flex items-center ${"justify-between"} px-2`}>
        <span className="text-[17px] font-800">
          Confirm Transaction
        </span>
        <div onClick={close}>
          <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
        </div>
      </div>
      <div className="relative flex flex-col">
        <AssetSummary
          fullName={asset.fullName}
          shortName={asset.shortName}
          icon={asset.Icon}
        />
        <AssetSummary
          fullName={"BinanceSmartChain"}
          shortName={"Bsc"}
          icon={"BinanceSmartChain"}
        />
        <div className="absolute right-[45%] top-[37%] flex h-9 w-9 items-center justify-center rounded-xl border border-gray-600 bg-darkBackground">
          <UilAngleDown className={""} />
        </div>
      </div>
      <div className="my-2 px-4 text-left">
        <span>{`1 ${asset.Icon} = ${0.0012}`}</span>
      </div>
      <FeeSummary asset={asset} text={text} />
      <ProtocolBanner type={"standard"} />
      <TransactionSummary fee={0.2} asset={asset} text={text} />
      <PrimaryButton
        className={
          "w-full justify-center rounded-2xl bg-[#1fc7d4] hover:bg-[#33e1ed] py-[14px] text-center font-800 text-[18px]"
        }
        onClick={executeTx}
      >
        Confirm {transactionType}
      </PrimaryButton>
    </>
  );
};

interface IAssetModal {
  toggleConfirmationModal: () => void;
  confirmation: boolean;
  text: string;
  asset: any;
  transactionType: string;
  executeTx: () => Promise<void>;
  open: boolean;
}

const TxConfirmationModal = ({
  toggleConfirmationModal,
  confirmation,
  text,
  asset,
  transactionType,
  executeTx,
  open
}: IAssetModal) => {
  const { account, library } = useWeb3React();
  const { width } = useViewport()

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        // <Backdrop visible={confirmation}>
        <FormWrapper>
          <TxModalInner
            asset={asset}
            text={text}
            transactionType={transactionType}
            close={toggleConfirmationModal}
            executeTx={executeTx}
          />
        </FormWrapper>
      ) : (
        <BottomSheetOptions
          hideCloseIcon
          open={open}
          setOpen={toggleConfirmationModal}
          title={"Connecting"}
        >
          <TxModalInner
            asset={asset}
            text={text}
            transactionType={transactionType}
            close={toggleConfirmationModal}
            executeTx={executeTx}
          />
        </BottomSheetOptions>
      )}
    </>
    // </Backdrop>
  );
};

export default TxConfirmationModal;
