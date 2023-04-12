import React, { useCallback} from "react";
import { useWeb3React } from "@web3-react/core";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { UilCheckCircle, UilArrowLeft, UilTimes } from '@iconscout/react-unicons';
import Link from "next/link";
import { useViewport } from "@/hooks/useViewport";
import { Breakpoints } from "@/constants/Breakpoints";
import BottomSheetOptions from "../BottomSheet/BottomSheet";

interface TxSubmittedProps {
  close: () => void;
  open: boolean;
  asset: any;
  chain: any;
}

const TxSubmittedInner = ({
  active,
  close,
}: {
  active: boolean;
  close: () => void;
}) => {
  return (
    <>
      <div className={`mb-2 flex items-center ${"justify-between"} px-2`}>
        <span className="font-800 text-[17px] text-[#280d5f]">Success</span>
        <div onClick={close}>
          <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
        </div>
      </div>
      <div className="my-4 flex flex-col items-center justify-center  px-2">
        <UilCheckCircle className={"h-24 w-24 text-[#1fc7d4]"} />
      </div>
      {/* <div
        className="mx-auto my-0 mt-4 flex w-fit items-center justify-center gap-3 rounded-full bg-tertiary px-4 py-2 text-gray-400 hover:cursor-pointer hover:bg-lightTertiary"
        onClick={addAsset}
      >
        <span>Add Token to Metamask</span>
        <Icon />
      </div> */}
      <div className="my-2 flex flex-col items-center gap-[6px]">
        <span className=" text-[18px] font-semibold text-[#280d5f]">
          Transaction Submitted
        </span>
        <span className="text-center text-[15px] text-gray-500">
          Please wait while your transaction settles.
        </span>
      </div>
    </>
  );
};

function TransactionSubmittedModal({
  close,
  open,
  asset,
  chain,
}: TxSubmittedProps) {
  const { active } = useWeb3React();
  const { width } = useViewport();

  // const AddAsset = useCallback(async(): Promise<void> => {
  //   const tokenAddress = chainAdresses[chain.fullName]!.assets[asset.Icon]?.tokenAddress
  //   const symbol = `testRen${asset.Icon}`
  //   //@ts-ignore
  //   const { ethereum } = window;
  //   try {
  //     await ethereum.request({
  //     method: "wallet_watchAsset",
  //     params: {
  //       type: "ERC20",
  //       options: {
  //         address: tokenAddress,
  //         symbol: symbol,
  //         decimals: asset.decimals,
  //       },
  //     },
  //   });
  //   } catch(error: any) {
  //     console.log(error)
  //   }
  // }, [asset, chain])

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <FormWrapper>
          <TxSubmittedInner active={active} close={close} />
        </FormWrapper>
      ) : (
        <BottomSheetOptions
          hideCloseIcon
          open={open}
          setOpen={close}
          title={"Submitted"}
        >
          <TxSubmittedInner active={active} close={close} />
        </BottomSheetOptions>
      )}
    </>
  );
}


export default TransactionSubmittedModal;
