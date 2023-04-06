import React from "react";
import { useWeb3React } from "@web3-react/core";
import { FormWrapper } from "../CSS/WalletModal.styles";
import PrimaryButton from "../Buttons/PrimaryButton";
import { WalletInfo, WALLETS } from "../../connection/wallets";
import { UilTimes } from '@iconscout/react-unicons';

const getWalletOptions = () => {
    return Object.values(WALLETS);
};

interface WalletOptionsProps {
    connect: (provider: any) => void;
    active: boolean;
    provider: any;
}

interface WalletSelectProps {
    toggleWalletModal: () => void;
    setConnecting: React.Dispatch<React.SetStateAction<boolean>>;
    connectOn: (provider1: any) => void;
    setPendingWallet: React.Dispatch<any>;
}

interface WalletSelectInnerProps {
    toggleWalletModal: () => void;
    active: boolean;
    connect: (provider: any) => void;
    deactivate: () => void;
}

const GreenDot = () => {
  return (
    <span className="flex flex-1 items-center justify-end">
      <div className="h-3 w-3 rounded-full bg-green-500"></div>
    </span>
  );
};

const WalletOption = ({ connect, provider, active }: WalletOptionsProps) => {
    return (
        <>
            {getWalletOptions().map((wallet: WalletInfo) => {
                return (
                    <div key={wallet.provider} onClick={() => connect(wallet)} className='flex flex-row gap-3 rounded-xl border border-gray-500 bg-tertiary px-4 py-4 hover:cursor-pointer hover:bg-lightTertiary'>
                        <div className='flex h-full'>
                            <wallet.icon />
                        </div>
                        <span className='text-[17px] font-semibold'>{wallet.name}</span>
                        {active && provider === wallet.provider && <GreenDot/>}
                    </div>
                );
            })}
        </>
    );
};

const WalletSelectModalInner = ({ connect, active, toggleWalletModal, deactivate }: WalletSelectInnerProps) => {
    const provider = localStorage.getItem("provider");
    return (
      <>
        <div className={`mb-2 flex items-center ${"justify-end"} px-2`}>
          <div onClick={toggleWalletModal}>
            <UilTimes className={" hover:cursor-pointer"} />
          </div>
        </div>
        <div className="mt-4 flex flex-col justify-center gap-3 px-2">
          <WalletOption connect={connect} provider={provider} active={active} />
          <div className="my-2 px-4 text-left text-[16px] text-gray-400">
            By connecting a wallet, you agree to Astrals’ Terms of Service and
            consent to its Privacy Policy.
          </div>
        </div>
        {active ? (
          <div className="mb-2 mt-2 flex items-center justify-center">
            <PrimaryButton
              className={
                "w-full justify-center rounded-lg bg-blue-500 py-4 text-center hover:cursor-pointer hover:bg-blue-600"
              }
              onClick={deactivate}
            >
              Disconnect
            </PrimaryButton>
          </div>
        ) : null}
      </>
    );
};

const WalletSelectModal = ({ toggleWalletModal, setConnecting, connectOn, setPendingWallet }: WalletSelectProps) => {
    const { active, deactivate } = useWeb3React();
 
    const disconnect = () => {
        deactivate()
        toggleWalletModal()
    }
    const connect = (web3Provider: any) => {
        if (active)  return;
        setPendingWallet(web3Provider);
        setConnecting(true);
        toggleWalletModal();
        setTimeout(() => {
            connectOn(web3Provider);
        }, 1200);
    };

    return (
      <FormWrapper>
        <WalletSelectModalInner
          toggleWalletModal={toggleWalletModal}
          connect={connect}
          deactivate={disconnect}
          active={active}
        />
      </FormWrapper>
    );
};

export default WalletSelectModal;
