import React, { useState } from "react";
import Image from "next/image";
import SwapImg from "../../../public/images/swapCard.png";
import ReactCardFlip from "react-card-flip";
import { HiOutlineXCircle } from "react-icons/hi";
import styled from "styled-components";
import meshSrc from "../../../public/images/Mesh.png";
import { motion } from "framer-motion";
import { StyledTitle, StyledTitle2 } from "../CSS/HomePage.styles";
import useWallet from '@/hooks/useWallet';
import {
  UilDollarSignAlt,
  UilAngleUp,
  UilBoltAlt,
  UilShieldCheck,
} from "@iconscout/react-unicons";
import Link from "next/link";

interface Props {
  onClick?: () => void;
  className?: String;
}

function LearnMoreButton({ onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`my-4 w-fit rounded-full border-2 border-blue-500 px-6 py-1 text-blue-500 transition duration-200 ease-in-out hover:border-blue-400 hover:bg-blue-400 hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 ${className}`}
    >
      <span className={`text-sm ${className}`}>Learn More</span>
    </button>
  );
}
export const fadeIn = (direction: string, delay: number | undefined) => {
  return {
    hidden: {
      y: direction === "up" ? 150 : direction === "down" ? -150 : 0,
      opacity: 0,
      x: direction === "left" ? 150 : direction === "right" ? -150 : 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};


const DARK_MODE_GRADIENT =
  "radial-gradient(101.8% 4091.31% at 0% 0%, #2ab4d3 0%, #7b54c8 100%)";

const Banner = styled.div<{ isDarkMode: boolean }>`
  border-radius: 25px;

  position: relative;

  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: space-between;
  padding: 10px 15px;


  width: 100%;
  height: 100%;
  min-height: 150px;

  margin-top: 50px;

  box-shadow: 0px 10px 24px rgba(51, 53, 72, 0.04);

  background: url(${meshSrc}), ${DARK_MODE_GRADIENT};

  @media (max-width: 1020px) {
    flex-direction: column;
  }
`;

const ProtocolBanner = () => {
  return (
    <Banner>
      <Image
        alt=""
        src={meshSrc}
        className="absolute top-0 max-h-[100%] min-h-[150px] w-full"
      />
      <div className="flex max-w-[100%] flex-col gap-2 px-4 lg:max-w-[75%]">
        <div className="items-left my-1 flex pt-1 text-2xl lg:text-3xl">
          <span className="text-white">
            Powered By the Pancake Protocol
          </span>
        </div>
        <div className="items-left mt-1 flex">
          <span className="text-sm text-gray-300 lg:text-base">
            PancakeSwap is an extended fork of the Uniswap V3 smart Contracts. We have
            all of the functionality of Uni v3 but with far more such as NTF's, staking and weekly lotteries. 
            Theres no better place in DeFi.
          </span>
        </div>
      </div>
      <a
        href={"https://github.com/mcgraneder/astral-sol"}
        rel="noopener noreferrer"
        target="_blank"
        className={`z-50 my-8  mr-4 hidden w-fit items-center rounded-full border-2 border-white px-8 text-white transition duration-200 ease-in-out hover:border-blue-300 hover:bg-primary hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 lg:flex `}
      >
        <span className={`text-base`}>Learn More</span>
      </a>
    </Banner>
  );
};

interface CrossButtonProps {
  onClick: () => void;
}

interface Props {
  children: React.ReactNode;
  className?: String;
}

export const Container = ({ children, className = "", ...rest }: Props) => {
  return (
    <div
      className={`bg-bg-white relative w-full overflow-hidden rounded-2xl drop-shadow-2xl lg:w-auto ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export const Title = ({ children, className = "", ...rest }: Props) => {
  return (
    <h3 className={`font-[800] tracking-wide ${className}`} {...rest}>
      {children}
    </h3>
  );
};

export const Description = ({
  children,
  className = "",
  ...rest
}: Props & { left?: boolean }) => {
  return (
    <p className={`font-normal tracking-wide ${className}`} {...rest}>
      {children}
    </p>
  );
};

const CrossButton = ({ onClick }: CrossButtonProps) => {
  return (
    <span className="absolute right-4 top-3 cursor-pointer" onClick={onClick}>
      <HiOutlineXCircle className="h-8 w-8 text-blue-500" />
    </span>
  );
};

const Cards = {
  tradeFreely: "trade_freely",
  ownMoney: "ownMoney",
  freeTransfer: "freeTransfer",
  ultraSecure: "ultraSecure",
  atomic: "atomic",
};

function Section2() {
  const [flipped, setFlipped] = useState({
    [Cards.freeTransfer]: false,
    [Cards.ownMoney]: false,
    [Cards.tradeFreely]: false,
    [Cards.ultraSecure]: false,
    [Cards.atomic]: false,
  });

  const toggleWalletModal = () => null;
  const flip = (key: string, value: boolean) => {
    console.log("flipping");
    setFlipped((f) => ({ ...f, [key]: value }));
  };

  return (
    <>
      <div className="absolute h-[110vh] w-screen bg-[rgb(190,214,245)] left-0 top-[100%] -z-50" />
      <motion.div
        variants={fadeIn("up", 0.01)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: true, amount: 0.15 }}
        id="features"
        className="max-w-screen z-50 mb-24 flex flex-col items-center  px-0 lg:px-12"
      >
        <StyledTitle2
          size={40}
          margin={0}
          weight={800}
          align={"center"}
          color="rgb(31,199,212)"
        >
          Used By Millions.
          <StyledTitle2
            size={40}
            margin={0}
            weight={800}
            align={"center"}
            color="rgb(31,199,212)"
          >
            Trusted with billions
          </StyledTitle2>
        </StyledTitle2>

        <div className="mt-6 max-w-[55%] break-words text-center text-[18px] text-[#7a6eaa]  lg:mt-8 ">
          PancakeSwap has the most users of any decentralized platform, ever.
          And those users are now entrusting the platform with over $3 billion
          in funds.
        </div>
        <div className="mt-6 max-w-[55%] break-words text-center text-[18px] font-[900]  text-[#7a6eaa] lg:mt-8 ">
          Will you join them?
        </div>
        <div className="mt-10 flex w-full flex-col items-center justify-between gap-8 px-8 mlg1:flex-row">
          <Container className="relative h-[250px] w-full min-w-[25%] border border-[rgb(231,227,235)] bg-white">
            <div className="mgl1:mx-12 mx-6 mt-5 flex flex-col mlg1:mt-3">
              <div className="flex flex-row items-center justify-between">
                <Title className="items-center text-center text-2xl font-[800] text-[rgb(31,199,212)] lg:w-80 lg:text-left mlg:text-3xl">
                  Any Chain
                </Title>
                <UilBoltAlt className="h-12 w-12 font-[800] text-[rgb(31,199,212)]" />
              </div>
              <div className="mt-14 max-w-[100%] break-words text-[#7a6eaa]  lg:mt-8 lg:max-w-full">
                Trading easy. You no longer need to worry about which network
                your on to trade. Well handle it for you!
              </div>
              <div
                className="mt-4 flex gap-1 font-semibold  text-[rgb(136,79,250)] hover:cursor-pointer"
                onClick={toggleWalletModal}
              >
                <span className="text-[rgb(118,69,217)] ">Trade Now</span>
                <span>
                  <UilAngleUp className="text-[rgb(118,69,217)] " />
                </span>
              </div>
            </div>
          </Container>
          <Container className="bg-bg-white relative h-[250px] w-full min-w-[25%] border border-[rgb(231,227,235)] bg-white">
            <div className="mgl1:mx-12 mx-6 mt-5 flex flex-col mlg1:mt-3">
              <div className="flex flex-row items-center justify-between">
                <Title className="items-center text-left  text-2xl font-[800] text-[rgb(31,199,212)] lg:w-80 mlg:text-3xl">
                  Reduced Fees
                </Title>
                <UilShieldCheck className="h-12 w-12 font-[800] text-[rgb(31,199,212)]" />
              </div>
              <div className="mt-14 max-w-[100%]  break-words text-[#7a6eaa]  lg:mt-8 lg:max-w-full">
                For loyal pancake users we now offer reduced fees where we pay
                half the fee for you. How about thst!
              </div>
              <div
                className="mt-4 flex gap-1 font-semibold  text-[rgb(136,79,250)] hover:cursor-pointer"
                onClick={toggleWalletModal}
              >
                <span className="text-[rgb(118,69,217)] ">Trade Now</span>
                <span>
                  <UilAngleUp className="text-[rgb(118,69,217)] " />
                </span>
              </div>
            </div>
          </Container>
          <Container className="bg-bg-white relative h-[250px] w-full min-w-[25%] border border-[rgb(231,227,235)] bg-white">
            <div className="mgl1:mx-12 mx-6 mt-5 flex flex-col mlg1:mt-3">
              <div className="flex flex-row items-center justify-between">
                <Title className="items-center text-center text-2xl font-[800] text-[rgb(31,199,212)] lg:w-80 lg:text-left mlg:text-3xl">
                  Lightning Fast
                </Title>
                <UilDollarSignAlt className="text-[rgb(31,199,212))] h-12 w-12 font-[800]" />
              </div>
              <div className="mt-14 max-w-[100%]  break-words text-[#7a6eaa] lg:mt-8 lg:max-w-full">
                PancakeSwap V3 just rolled out. Now trades are quicker and
                faster than ever to execute.
              </div>
              <div
                className="mt-4 flex gap-1 font-semibold  text-[rgb(136,79,250)] hover:cursor-pointer"
                onClick={toggleWalletModal}
              >
                <span className="text-[rgb(118,69,217)] ">Trade Now</span>
                <span>
                  <UilAngleUp className="text-[rgb(31,199,212)] " />
                </span>
              </div>
            </div>
          </Container>
        </div>
        <ProtocolBanner />
      </motion.div>
    </>
  );
}

export default Section2;
