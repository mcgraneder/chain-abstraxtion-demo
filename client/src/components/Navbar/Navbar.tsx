import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components/macro";
import { UilAngleDown, UilSpinnerAlt, UilBars } from "@iconscout/react-unicons";
import { useWeb3React } from "@web3-react/core";
import { formatBalance, shortenAddress } from "@/utils/misc";
import { walletIcon } from "@/connection/wallets";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icon as AssetIcon } from "../Icons/AssetLogs/Icon";
import Wallet from "../../../public/svgs/Wallet.svg";
import AstralLogo from "../../../public/images/logo.svg";
import { Wrapper, Nav, Box, BoxItemContainer } from "../CSS/Navbar.styles";
import { useGlobalState } from "@/context/GlobalState";
import Settings from "../../../public/svgs/settings.svg";
import Global from "../../../public/svgs/global.svg";
import Pancake from "../../../public/svgs/pcake.svg";
import TokenSelectDropdown from "../CahinSelector/ChainSelector";
import CakeIcon from "../../../public/svgs/assets/cake.svg";
import SlideOver from "../Sidebar/Sidebar";

interface INavbar {
  toggleWalletModal: () => void;
  toggleAccoundDetailsModal: () => void;
}

const ROUTES: string[] = ["home", "swap", "wallet", "history"];

const NavLinks = ({
  routes,
  activePath,
}: {
  routes: string[];
  activePath: string;
}) => {
  return (
    <>
      {routes.map((route: string, index: number) => {
        return (
          <Link
            href={`/${route}`}
            key={route}
            className="mx-1 hidden flex-row items-center gap-2 sm:flex"
            id={route}
          >
            <span
              className={`my-2 w-full rounded-xl px-2 py-2 text-center text-[16px] font-[900] ${
                activePath.slice(1, activePath.length) === route
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
  const [openSideBar, setOpenSideBar] = useState(false);

  const [provider, setProvider] = useState<string | null>(null);
  const router = useRouter();
  const { account, active } = useWeb3React();
  const { pending, allBalances } = useGlobalState();
  const activePath = router.pathname;

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
    toggleWalletModal();
  }, [toggleWalletModal]);
  return (
    <>
      <SlideOver
        open={openSideBar}
        setOpen={() => setOpenSideBar(!openSideBar)}
      />

      <Wrapper isNavbarDark={isNavbarDark}>
        <Nav>
          <Box>
            <BoxItemContainer allignment={"flex-start"}>
              <div className="mr-2 hidden h-full items-center gap-2 md2:flex">
                <AstralLogo className="mx-4 hidden h-[170px] w-[170px] mlg1:block" />
                <CakeIcon className="mx-4 block h-8 w-8 mlg1:hidden" />

                <NavLinks routes={ROUTES} activePath={activePath} />
              </div>
              <div className="mr-6 flex h-full items-center gap-2 md2:hidden">
                <UilBars
                  className="h-8 w-8 text-[#c3c5c8] hover:cursor-pointer"
                  onClick={() => setOpenSideBar(!openSideBar)}
                />
              </div>
            </BoxItemContainer>

            <BoxItemContainer allignment={"flex-end"}>
              <div className=" hidden items-center justify-center gap-6 px-4 md:flex">
                <div className="flex items-center justify-end gap-2">
                  <Pancake />
                  {allBalances["BinanceSmartChain"] && (
                    <span className="text-[16px] font-[900] text-[rgb(122,110,170)]">
                      {formatBalance(
                        (
                          Number(
                            allBalances["BinanceSmartChain"]!["CAKE"]
                              ?.walletBalance!
                          ) /
                          10 ** 18
                        ).toString(),
                        3
                      )}
                    </span>
                  )}
                </div>
                <Global className="text-[rgb(122,110,170)]" />
                <Settings className="text-[rgb(122,110,170)]" />
              </div>
              {account ? <TokenSelectDropdown /> : null}
              <div className="mr-5 flex  h-full items-center">
                {/* <div className="mr-5 flex  h-full items-center"> */}
                <PrimaryButton
                  className={`relative mt-[2px] ${
                    account || !pending
                      ? "border-b-[3px] border-[#d7d8da] bg-[#e9eaeb] hover:bg-[#eeeef1]"
                      : "bg-[#1fc7d4] hover:bg-[#33e1ed]"
                  } py-[4px]`}
                  onClick={ac}
                >
                  {account || pending ? (
                    <div className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1fc7d4] bg-white">
                      <Wallet className="h-7 w-7 text-[#1fc7d4]" />
                    </div>
                  ) : null}
                  <span
                    className={`${
                      account || pending
                        ? "ml-6 mr-2 text-[#280d5f]"
                        : " text-white"
                    } hidden font-[900] xs:block`}
                  >
                    {pending
                      ? "1 Pending Tx"
                      : account
                      ? shortenAddress(account)
                      : "Connect Wallet"}
                  </span>
                  {pending ? (
                    <UilSpinnerAlt className="h-6 w-6 animate-spin text-gray-500" />
                  ) : (
                    account && (
                      <UilAngleDown className={"h-5 w-5 text-[#280d5f] "} />
                    )
                  )}
                </PrimaryButton>
              </div>
            </BoxItemContainer>
          </Box>
        </Nav>
      </Wrapper>
    </>
  );
};

export default Navbar;
