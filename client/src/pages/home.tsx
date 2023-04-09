import React, { useState, useCallback, useEffect } from "react";
import AssetListModal from "@/components/AssetListModal/AssetListModal";
import WalletModal from "@/components/WalletModal/WalletModal";
import { Layout } from "@/layouts";
import type { NextPage } from "next";
import { AssetBaseConfig, assetsBaseConfig } from "../utils/assetsConfig";
import TransactionFlowModals from "@/components/TxConfirmationModalFlow";
import { useWeb3React } from "@web3-react/core";
import {
  IPosition,
  notifyType,
  useNotification,
} from "@/context/useNotificationState";
import { useTransactionFlow } from "@/context/useTransactionFlowState";
import API from "@/constants/Api";
import BigNumber from "bignumber.js";
import { useGlobalState } from "@/context/GlobalState";
import { get, post } from "@/services/axios";
import { defaultAbiCoder } from "@ethersproject/abi";
import { PopulatedTransaction, ethers } from "ethers";
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import Hero from "@/components/Home/Home";
import styled from "styled-components"
import Navbar from "@/components/Navbar/Navbar";
import PageSection from "@/components/Home/PageSection";
import WalletConnect from "@/components/WalletConnectModal/WalletConnectModal";

const StyledHeroSection = styled(PageSection)`
  padding-top: 150px;
  height: 100vh;


`;
//   ${({ theme }) => theme.mediaQueries.md} {
//     padding-top: 48px;
//   }

export const swapSectionData = () => ({
  headingText: 'Trade anything. No registration, no hassle.',
  bodyText: 'Trade any token on BNB Smart Chain in seconds, just by connecting your wallet.',
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: 'Trade Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.pancakeswap.finance/',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '../../public/images/',
    attributes: [
      { src: 'BNB', alt: 'BNB token'},
      { src: 'BTC', alt: 'BTC token' },
      { src: 'CAKE', alt: 'CAKE token' },
    ],
  },
})

const Home: NextPage = () => {
  const { library, account, chainId } = useWeb3React();
  const { openWalletModal, toggleWalletModal } = useGlobalState()
 
  return (
    <div>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(139.73deg, #e6fdff 0%, #f3efff 100%);
          }
          [data-theme="dark"] #home-1 .page-bg {
            background: radial-gradient(
              103.12% 50% at 50% 50%,
              #21193a 0%,
              #191326 100%
            );
          }
          #home-2 .page-bg {
            background: linear-gradient(180deg, #ffffff 22%, #d7caec 100%);
          }
          [data-theme="dark"] #home-2 .page-bg {
            background: linear-gradient(180deg, #09070c 22%, #201335 100%);
          }
          #home-3 .page-bg {
            background: linear-gradient(180deg, #6fb6f1 0%, #eaf2f6 100%);
          }
          [data-theme="dark"] #home-3 .page-bg {
            background: linear-gradient(180deg, #0b4576 0%, #091115 100%);
          }
          #home-4 .inner-wedge svg {
            fill: #d8cbed;
          }
          [data-theme="dark"] #home-4 .inner-wedge svg {
            fill: #201335;
          }
        `}
      </style>
      <Navbar
        toggleWalletModal={toggleWalletModal}
        toggleAccoundDetailsModal={toggleWalletModal}
      />
      <WalletConnect
        toggleWalletModal={toggleWalletModal}
        openWalletModal={openWalletModal}
      />
      <StyledHeroSection
        innerProps={{ style: { margin: "0", width: "100%" } }}
        containerProps={{
          id: "home-1",
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <Hero />
      </StyledHeroSection>
    </div>
  );
};

export default Home;
