import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components/macro";
import { UilAngleDown } from "@iconscout/react-unicons";
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "@/utils/misc";
import { walletIcon } from "@/connection/wallets";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
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
              {activePath !== "/home" && <NavLinks routes={ROUTES} activePath={activePath}/>}
            </div>
          </BoxItemContainer>
          <BoxItemContainer allignment={"flex-end"}>
            {/* {activePath !== "/home" && (
              <div className="mr-5 flex h-full items-center">
                <TokenSelectDropdown />
              </div>
            )} */}
            <div className="mr-5 flex  h-full items-center">
              <PrimaryButton
                className="mt-[2px] bg-blue-500 py-[6px] hover:bg-blue-600"
                onClick={ac}
              >
                <span className="mr-2 hidden xs:block">
                  {account ? shortenAddress(account) : "Connect"}
                </span>
                <span className="mr-2 hidden xs:block">|</span>
                {active && Icon ? (
                  <></> //<Icon className={"h-5 w-5"} />
                ) : (
                  <UilAngleDown className={"h-5 w-5"} />
                )}
              </PrimaryButton>
            </div>
          </BoxItemContainer>
        </Box>
      </Nav>
    </Wrapper>
  );
};

export default Navbar;
