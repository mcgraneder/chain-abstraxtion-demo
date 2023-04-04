import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components/macro";
import { UilAngleDown } from "@iconscout/react-unicons";
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "@/utils/misc";
import { walletIcon } from "@/connection/wallets";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import AstralLogo from "../../../public/images/astralLogo.png"
import { Wrapper, Nav, Box, BoxItemContainer } from "../CSS/Navbar.styles";

interface INavbar {
  toggleWalletModal: () => void;
  toggleAccoundDetailsModal: () => void;
}

const ROUTES: string[] = ["bridge", "wallet", "history", "trade"];

const NavLinks = ({ routes }: { routes: string[] }) => {
  return (
    <>
      {routes.map((route: string) => {
        return (
          <Link
            href={`/${route === "history" ? "transactions" : route}`}
            key={route}
            className="mx-1 hidden flex-row items-center gap-2 sm:flex"
            id={route}
          >
            <span className="my-2 w-full rounded-xl bg-black bg-opacity-40 px-4 py-2 text-center text-[16px] hover:cursor-pointer hover:bg-black hover:bg-opacity-60">
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
  const [provider, setProvider] = useState<string | null>(null)
  const router = useRouter();
  const { account, active } = useWeb3React()
  const activePath = router.pathname;

  const changeBackground = () => {
    if (window.scrollY >= 66) {
      setIsNavbarDark(true);
    } else {
      setIsNavbarDark(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return
    changeBackground();
    window.addEventListener("scroll", changeBackground);
  });

  useEffect(() => {
    if (typeof window == "undefined" || !active) return;
    const provider = localStorage.getItem("provider");
    setProvider(provider);
  }, [active]);

  const Icon = provider ? walletIcon[provider] : undefined;
  return (
    <Wrapper isNavbarDark={isNavbarDark}>
      <Nav>
        <Box>
          <BoxItemContainer allignment={"flex-start"}>
            <div className="mr-5 hidden h-full items-center gap-2 sm:flex">
              <Image alt="" src={AstralLogo} className="mx-4 h-10 w-10 " />
              {activePath !== "/home" && <NavLinks routes={ROUTES} />}
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
                onClick={
                  !active ? toggleWalletModal : toggleAccoundDetailsModal
                }
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
