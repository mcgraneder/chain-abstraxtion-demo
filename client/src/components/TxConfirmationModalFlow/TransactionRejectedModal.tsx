import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useViewport } from "../../hooks/useViewport";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { UilExclamationTriangle, UilTimes } from '@iconscout/react-unicons';
import PrimaryButton from "../Buttons/PrimaryButton";

interface PendingTransactionModalProps {
  close: () => void;
  open: boolean;
}

const TransactionRejectedInner = ({
  active,
  close,
}: {
  active: boolean;
  close: () => void;
}) => {
  return (
    <>
      <div className={`mb-2 flex items-center ${"justify-between"} px-2`}>
        <span className="font-800 text-[17px] text-[#280d5f]">Error</span>
        <div onClick={close}>
          <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
        </div>
      </div>
      <div className="my-4 flex flex-col items-center justify-center  px-2">
        <UilExclamationTriangle className={"h-24 w-24 text-red-500"} />
      </div>
      <div className="my-2 flex flex-col items-center gap-[6px]">
        <span className=" text-[18px] font-semibold text-[#280d5f]">
          Transaction Failed
        </span>
        <span className="text-center text-[15px] text-gray-500">
          Oops your transaction failed unexpectedly
        </span>
      </div>
      <div className="mb-2 mt-8 flex items-center justify-center">
        <PrimaryButton
          className={
            "font-800 w-full justify-center rounded-2xl bg-[#1fc7d4] py-[14px] text-center text-[18px] hover:bg-[#33e1ed]"
          }
          onClick={close}
        >
          Close
        </PrimaryButton>
      </div>
    </>
  );
};

function TransactionRejectedModal({ close, open }: PendingTransactionModalProps) {
  const { active } = useWeb3React();
  const { width } = useViewport();

  return (
    <FormWrapper>
      <TransactionRejectedInner active={active} close={close} />
    </FormWrapper>
  );
}

export default TransactionRejectedModal;
