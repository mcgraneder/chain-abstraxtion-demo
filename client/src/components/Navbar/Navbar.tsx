import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components/macro";
import { UilAngleDown } from "@iconscout/react-unicons";
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "@/utils/misc";
import { walletIcon } from "@/connection/wallets";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icon as AssetIcon } from "../Icons/AssetLogs/Icon";
import Wallet from "../../../public/svgs/Wallet.svg"
import AstralLogo from "../../../public/images/logo.svg";
import { Wrapper, Nav, Box, BoxItemContainer } from "../CSS/Navbar.styles";

interface INavbar {
  toggleWalletModal: () => void;
  toggleAccoundDetailsModal: () => void;
}

const ROUTES: string[] = ["bridge", "wallet", "history", "trade"];

const NavLinks = ({ routes, activePath }: { routes: string[], activePath: string }) => {
  return (
    <>
      {routes.map((route: string, index: number) => {
        return (
          <Link
            href={`/${route === "history" ? "transactions" : route}`}
            key={route}
            className="mx-1 hidden flex-row items-center gap-2 sm:flex"
            id={route}
          >
            <span
              className={`my-2 w-full rounded-xl px-4 py-2 text-center text-[16px] font-[900] ${
                index === 0
                  ? "text-[rgb(118,69,217)]"
                  : "text-[#7a6eaa]"
              } hover:cursor-pointer hover:bg-[#e9eaeb]`}
            >
              {route}
            </span>
          </Link>
        );
      })}
    </>
  );
};

export const Navbar = ({
  toggleWalletModal,
  toggleAccoundDetailsModal,
}: INavbar) => {
  const [isNavbarDark, setIsNavbarDark] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const router = useRouter();
  const { account, active } = useWeb3React();
  const activePath = router.pathname;
  console.log(activePath)

  const changeBackground = () => {
    if (window.scrollY >= 66) {
      setIsNavbarDark(true);
    } else {
      setIsNavbarDark(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    changeBackground();
    window.addEventListener("scroll", changeBackground);
  });

  useEffect(() => {
    if (typeof window == "undefined" || !active) return;
    const provider = localStorage.getItem("provider");
    setProvider(provider);
  }, [active]);

  const Icon = provider ? walletIcon[provider] : undefined;

  const ac = useCallback(() => {
    console.log("hey");
    toggleWalletModal();
  }, [toggleWalletModal]);
  return (
    <Wrapper isNavbarDark={isNavbarDark}>
      <Nav>
        <Box>
          <BoxItemContainer allignment={"flex-start"}>
            <div className="mr-5 hidden h-full items-center gap-2 sm:flex">
              <AstralLogo className="mx-4 h-[170px] w-[170px]" />
              {activePath !== "/home" && (
                <NavLinks routes={ROUTES} activePath={activePath} />
              )}
            </div>
          </BoxItemContainer>
          <BoxItemContainer allignment={"flex-end"}>
            {/* {activePath !== "/home" && (
              <div className="mr-5 flex h-full items-center">
                <TokenSelectDropdown />
              </div>
            )} */}
            { account ? (<div className="mr-5 flex  h-full items-center">
              <PrimaryButton
                className="relative mt-[2px] border-b-[3px] border-[#d7d8da] bg-[#e9eaeb] bg-blue-500 bg-white py-[4px] hover:bg-blue-600"
                onClick={ac}
              >
                <div className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-black bg-white">
                  <AssetIcon
                    chainName={"BinanceSmartChain" as string}
                    className="h-6 w-6"
                  />
                </div>
                <span className="ml-6 mr-2 hidden font-[900] text-[#280d5f] xs:block">
                  {"Binance Smart Chain"}
                </span>
                <UilAngleDown className={"h-5 w-5 text-[#280d5f] "} />
              </PrimaryButton>
            </div>) : null}
            <div className="mr-5 flex  h-full items-center">
              <PrimaryButton
                className={`relative mt-[2px] ${
                  account
                    ? "border-b-[3px] border-[#d7d8da] bg-[#e9eaeb]"
                    : "bg-[#1fc7d4] hover:bg-[#33e1ed]"
                } py-[4px]`}
                onClick={ac}
              >
                {account ? (
                  <div className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1fc7d4] bg-white">
                    <Wallet className="h-7 w-7 text-[#1fc7d4]" />
                  </div>
                ) : null}
                <span
                  className={`${
                    account ? "ml-6 mr-2 text-[#280d5f]" : " text-white"
                  } hidden font-[900] xs:block`}
                >
                  {account ? shortenAddress(account) : "Connect Wallet"}
                </span>
                {account ? (
                  <UilAngleDown className={"h-5 w-5 text-[#280d5f] "} />
                ) : null}
              </PrimaryButton>
            </div>
          </BoxItemContainer>
        </Box>
      </Nav>
    </Wrapper>
  );
};

export default Navbar;
