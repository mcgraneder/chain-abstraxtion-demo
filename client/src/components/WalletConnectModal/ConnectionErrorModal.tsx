import React from "react";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { UilExclamationTriangle, UilTimes } from '@iconscout/react-unicons';
import { AbstractConnector } from "@web3-react/abstract-connector";

interface ConnectionErrorModalProps {
    close: () => void;
    setConnecting: React.Dispatch<React.SetStateAction<boolean>>;
    toggleWalletModal: () => void;
    pendingWallet: AbstractConnector | undefined;
    connectOn: (provider1: any) => void;
    message: string;
} 

const ConnectionErrorModalInner = ({ close, setConnecting, toggleWalletModal, pendingWallet, connectOn, message }: ConnectionErrorModalProps) => {

    const backToWalletModal = (): void => {
        toggleWalletModal();
        close();
    };
    const connect = (): void => {
        if (!pendingWallet) {
            return;
        }
        close();
        setConnecting(true);
        setTimeout(() => connectOn(pendingWallet), 1200);
    };

    return (
      <>
        <div className={`mb-2 flex items-center ${"justify-end"} px-2`}>
          <div onClick={close}>
            <UilTimes className={" hover:cursor-pointer"} />
          </div>
        </div>
        <div className="my-4 flex flex-col items-center justify-center  px-2">
          <UilExclamationTriangle className={"h-20 w-20 text-red-500"} />
        </div>
        <div className="my-2 flex flex-col items-center gap-2 text-center">
          <span className=" text-[17px] font-semibold">Error connecting</span>
          <span className="text-[15px] text-gray-500">{message}</span>
        </div>
        {/* {message !== ERROR_MESSSAGES["REQUEST_PENDING"] &&
        message !== ERROR_MESSSAGES["NO_PROVIDER"] ? (
          <div className="mb-2 mt-8 flex items-center justify-center">
            <PrimaryButton
              className={
                "w-full justify-center rounded-lg bg-blue-500 py-4 text-center"
              }
              onClick={connect}
            >
              Try again
            </PrimaryButton>
          </div>
        ) : (
          <div className="focus-visible:ring-primary flex w-full items-center justify-center rounded-lg bg-blue-500 px-5 py-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
            <a
              href="https://www.bing.com/ck/a?!&&p=115f4954ff3b300cJmltdHM9MTY3NzU0MjQwMCZpZ3VpZD0xODZmYmI1ZC0xODIyLTYzMGQtMTYzNS1hOTNiMTk5OTYyZWImaW5zaWQ9NTQyOA&ptn=3&hsh=3&fclid=186fbb5d-1822-630d-1635-a93b199962eb&psq=metamask&u=a1aHR0cHM6Ly9tZXRhbWFzay5pby9kb3dubG9hZC8&ntb=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              get Metamask
            </a>
          </div>
        )} */}
      </>
    );
};

function ConnectionErrorModal({ close, setConnecting, toggleWalletModal, pendingWallet, connectOn, message }: ConnectionErrorModalProps) {

    return (
      <FormWrapper>
        <ConnectionErrorModalInner
          close={close}
          setConnecting={setConnecting}
          toggleWalletModal={toggleWalletModal}
          pendingWallet={pendingWallet}
          connectOn={connectOn}
          message={message}
        />
      </FormWrapper>
    );
}

export default ConnectionErrorModal;
