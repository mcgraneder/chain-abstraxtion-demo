import React, { useState, useCallback } from "react";
import { UilInfoCircle, UilTimes } from '@iconscout/react-unicons';
import PrimaryButton from "../Buttons/PrimaryButton";
import styled, { css } from "styled-components";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { Backdrop } from "../CSS/WalletModal.styles";

interface PendingTransactionModalProps {
  close: () => void;
  open: boolean;
  message: JSX.Element;
  isHomePageWarning: boolean;
}

interface IconProps {
  active: boolean;
}

const SecondStep = ({ close }: { close: () => void }) => {
  return (
    <>
      

      <div className="my-4 flex flex-col items-center justify-center gap-2">
        <span className=" px-2 text-center text-[15px] text-gray-400">
          Since this App is in early stages of development i made a Demo &
          explanation video to show how to use the current available features
        </span>
      </div>
      <div className="aspect-w-16 aspect-h-9 mx-10 flex items-center justify-center p-2">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/ncKJP39yjME"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className="my-4 flex flex-col items-center justify-center gap-2">
        <span className=" px-2 text-center text-[15px] text-gray-400">
          In the video i give an explanation of how my app works/will work
          architecturally from the backend smart contract design as well as the
          server and API design
        </span>
      </div>
      <div className="mb-2 mt-8 flex items-center justify-center">
        <PrimaryButton
          className={
            "w-full justify-center rounded-2xl bg-[#1fc7d4] py-[15.5px] text-center text-[17px] font-semibold"
          }
          onClick={close}
        >
          {"Close"}
        </PrimaryButton>
      </div>
    </>
  );
};

const UserInfoModalInner = ({
  close,
  message,
  buttonTitle,
}: {
  close: () => void;
  message: JSX.Element;
  buttonTitle: string;
}) => {
  return (
    <>
       <div className={`mb-2 flex items-center ${"justify-end"} px-2`}>
       
        <div onClick={close}>
          <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
        </div>
      </div>

      <div className="my-4 flex flex-col items-center justify-center  px-2">
        <UilInfoCircle className={"h-24 w-24 text-[#1fc7d4]"} />
      </div>
      <div className="mx-auto my-2 flex max-w-[90%] flex-col items-center justify-center gap-2">
        <span className=" px-2 text-center text-[15px] text-gray-400">
          {message}
        </span>
      </div>
      <div className="mb-2 mt-8 flex items-center justify-center">
        <PrimaryButton
          className={
            "w-full justify-center rounded-2xl bg-[#1fc7d4] py-[15.5px] text-center text-[17px] font-semibold"
          }
          onClick={close}
        >
          {buttonTitle}
        </PrimaryButton>
      </div>
    </>
  );
};

function UserInfoModal({
  close,
  open,
  message,
  isHomePageWarning,
}: PendingTransactionModalProps) {
  const [isFirstStep, setIsFirstStep] = useState<boolean>(true);
  const handleSecondStep = useCallback(
    () => setIsFirstStep((s: boolean) => !s),
    [setIsFirstStep]
  );
  return (
    <>
      <Backdrop visible={open}>
        <FormWrapper>
          {isFirstStep ? (
            <UserInfoModalInner
              close={!isHomePageWarning ? close : handleSecondStep}
              message={message}
              buttonTitle={!isHomePageWarning ? "Close" : "Next"}
            />
          ) : (
            <SecondStep close={close} />
          )}
        </FormWrapper>
      </Backdrop>
    </>
  );
}

export default UserInfoModal;
