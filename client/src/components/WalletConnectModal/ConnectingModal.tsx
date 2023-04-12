import React from "react";
import { useWeb3React } from "@web3-react/core";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { UilCheckCircle, UilSpinner, UilArrowLeft, UilTimes } from '@iconscout/react-unicons';
import { useViewport } from "@/hooks/useViewport";
import { Breakpoints } from "@/constants/Breakpoints";
import BottomSheetOptions from "../BottomSheet/BottomSheet";

interface ConnectingModalProps {
  close: () => void;
  open: boolean;
}

interface IconProps {
    active: boolean;
}
export const GetIcon = ({ active }: IconProps) => {
    return (
      <>
        {active ? (
          <div>
            <UilCheckCircle
              color={"#1fc7d4"}
              size={"80px"}
            />
          </div>
        ) : (
          <UilSpinner
            size={20}
            className={
              " h-20 w-20 animate-spin  text-[#1fc7d4] text-blue-500"
            }
          />
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
            <UilTimes className={" hover:cursor-pointer text-[1fc7d4]"} />
          </div>
        </div>
        <div className="my-4 flex flex-col items-center justify-center  px-2">
          <GetIcon active={active} />
        </div>
        <div className="my-2 flex flex-col items-center gap-2">
          <span className=" #280d5f text-[20px] font-[900]">
            Waiting to connect
          </span>
          <span className="text-[16px]  text-[#7a6eaa]">
            Please confirm the request in your wallet
          </span>
        </div>
      </>
    );
};

function ConnectingModal({ close, open }: ConnectingModalProps) {
    const { active } = useWeb3React();
    const { width } = useViewport()

    return (
      <>
        {width > 0 && width >= Breakpoints.sm1 ? (
          <FormWrapper>
            <ConnectingModalInner active={active} close={close} />
          </FormWrapper>
        ) : (
          <BottomSheetOptions
            hideCloseIcon
            open={open}
            setOpen={close}
            title={"Connecting"}
          >
            <ConnectingModalInner active={active} close={close} />
          </BottomSheetOptions>
        )}
      </>
    );
}

export default ConnectingModal;
