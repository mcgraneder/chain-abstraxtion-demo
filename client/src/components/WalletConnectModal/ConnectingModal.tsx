import React from "react";
import { useWeb3React } from "@web3-react/core";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { UilCheckCircle, UilSpinner, UilArrowLeft, UilTimes } from '@iconscout/react-unicons';

interface ConnectingModalProps {
  close: () => void;
}

interface IconProps {
    active: boolean;
}
export const GetIcon = ({ active }: IconProps) => {
    return (
        <>
            {active ? (
                <div>
                    <UilCheckCircle color={"rgb(59 130 246)"} size={"80px"} />
                </div>
            ) : (
                <UilSpinner size={20} className={" h-20 w-20 animate-spin text-blue-500"} />
            )}
        </>
    );
};

const ConnectingModalInner = ({ active, close }: { active: boolean; close: () => void }) => {
    return (
      <>
        <div className={`mb-2 flex items-center ${"justify-between"} px-2`}>
          <div onClick={close}>
            <UilArrowLeft className={"hover:cursor-pointer"} />
          </div>
          <div onClick={close}>
            <UilTimes className={" hover:cursor-pointer"} />
          </div>
        </div>
        <div className="my-4 flex flex-col items-center justify-center  px-2">
          <GetIcon active={active} />
        </div>
        <div className="my-2 flex flex-col items-center gap-2">
          <span className=" text-[17px] font-semibold">Waiting to connect</span>
          <span className="text-[15px] text-gray-500">
            Please confirm the request in your wallet
          </span>
        </div>
      </>
    );
};

function ConnectingModal({ close }: ConnectingModalProps) {
    const { active } = useWeb3React();

    return (
      <FormWrapper>
        <ConnectingModalInner active={active} close={close} />
      </FormWrapper>
    );
}

export default ConnectingModal;
