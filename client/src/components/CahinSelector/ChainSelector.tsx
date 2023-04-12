import React, { useState, useEffect, useRef } from "react";
import { UilAngleDown } from "@iconscout/react-unicons";
import styled from "styled-components";
import { CHAINS, ChainType } from "../../connection/chains";
import { useWeb3React } from "@web3-react/core";
import GreenDot from "../Icons/GreenDot";
import useWallet from "@/hooks/useWallet";
import PrimaryButton from "../Buttons/PrimaryButton";
import { Icon } from "../Icons/AssetLogs/Icon";

export const FormWrapper = styled.div`
  position: fixed;
  right: 0%;
  top: 29%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: white;
  text-align: right;
  padding: 10px;
  padding-bottom: 20px;
  border: 1.5px solid rgb(231, 227, 235);
  border-radius: 15px;
  display: block;
  z-index: 10000000000;
`;

const getChainOptions = () => {
  return Object.values(CHAINS);
};

const TokenSelectDropdown = () => {
  const { chainId } = useWeb3React();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeChain, setActiveChain] = useState<ChainType | undefined>(
    chainId ? CHAINS[chainId] : undefined
  );

  const { needToSwitchChain, switchNetwork } = useWallet();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chainId) return;
    const activeChain: ChainType | undefined = CHAINS[chainId];
    setActiveChain(activeChain);
  }, [chainId, needToSwitchChain]);

  useEffect(() => {
    const checkIfClickedOutside = (e: Event) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node | null)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", checkIfClickedOutside);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className="relative h-fit w-fit" ref={ref}>
        <ChainSelectorButton
          setIsMenuOpen={setIsMenuOpen}
          activeChain={activeChain}
        />
        {isMenuOpen ? (
          <FormWrapper>
            {getChainOptions()
              .filter((chain: ChainType) => chain.isTestnet)
              .map((chain: ChainType, index: number) => {
                return (
                  <ChainSelector
                    key={index}
                    chain={chain}
                    currentChain={chainId}
                    switchNetwork={switchNetwork}
                  />
                );
              })}
          </FormWrapper>
        ) : null}
      </div>
    </>
  );
};

const ChainSelectorButton = ({
  setIsMenuOpen,
  activeChain,
}: {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeChain: ChainType | undefined;
}) => {
  return (
    <div className="mr-5 flex  h-full items-center">
      <PrimaryButton
        className="relative mt-[2px] border-b-[3px] border-[#d7d8da] bg-[#e9eaeb] bg-white py-[4px] hover:bg-[#eeeef1]"
        onClick={() => setIsMenuOpen(true)}
      >
        <div className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-black bg-white">
          {activeChain && <activeChain.logo className="h-6 w-6" />}
        </div>
        <span className="ml-6 mr-2 hidden font-[900] text-[#280d5f] xs:block">
          {activeChain?.chainName}
        </span>
        <UilAngleDown className={"h-5 w-5 text-[#280d5f] "} />
      </PrimaryButton>
    </div>
  );
};
const ChainSelector = ({
  chain,
  currentChain,
  switchNetwork,
}: {
  chain: ChainType;
  currentChain: number | undefined;
  switchNetwork: any;
}) => {
  return (
    <div
      className="flex flex-row items-center gap-3 rounded-lg px-2 py-2 hover:cursor-pointer hover:bg-[#e9eaeb]"
      onClick={() => switchNetwork(chain.id)}
    >
      <div className="flex h-full">
        <chain.logo className={"h-5 w-5"} />
      </div>
      <span
        className={`font-[800] ${
          currentChain && currentChain == chain.id
            ? "text-[rgb(118,69,217)]"
            : "text-[#280d5f]"
        }`}
      >
        {chain.chainName}
      </span>
      {currentChain && currentChain == chain.id && <GreenDot />}
    </div>
  );
};

export default TokenSelectDropdown;
