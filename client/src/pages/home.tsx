import React, { useState, useCallback, useEffect } from "react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import { useGlobalState } from "@/context/GlobalState";
import Hero from "@/components/Home/Home";
import styled from "styled-components"
import Navbar from "@/components/Navbar/Navbar";
import PageSection from "@/components/Home/PageSection";
import WalletConnect from "@/components/WalletConnectModal/WalletConnectModal";
import Stats from "@/components/Home/Stats";

const StyledHeroSection = styled(PageSection)`
  padding-top: 150px;
  height: 100vh;


`;

const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading2:
    "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  paragraph:
    "font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
};
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
      <Navbar
        toggleWalletModal={toggleWalletModal}
        toggleAccoundDetailsModal={toggleWalletModal}
      />
      <WalletConnect
        toggleWalletModal={toggleWalletModal}
        openWalletModal={openWalletModal}
      />
      {/* <StyledHeroSection
        innerProps={{ style: { margin: "0", width: "100%" } }}
        containerProps={{
          id: "home-1",
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <Hero />
      </StyledHeroSection> */}
      <div className={` ${styles.flexStart} mt-[80px]`}>
        <div className={`${styles.boxWidth}`}>
          <Hero toggleOpenWallet={toggleWalletModal} />
          {/* <Stats/> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
