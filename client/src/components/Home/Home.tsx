
import Discount from "../../../public/Discount.svg";
import Robot from "../../../public/robot.png"
import Image from "next/image";
import Flex from "../Box/Flex";
// import Image from "next/legacy/image";
import styled, { keyframes } from "styled-components";
import bunnyImage from "../../../public/images/astronaut-bunny.png";
import CompositeImage, { CompositeImageProps } from "./CompositeImage";
import { SlideSvgDark, SlideSvgLight } from "./SlideSvg";
import { useWeb3React } from "@web3-react/core";
import { forwardRef } from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import NextLink from "next/link";
import Section2 from "./Stats";
import Footer from "./Footer";


// react-router-dom LinkProps types
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: any;
  replace?: boolean;
  innerRef?: React.Ref<HTMLAnchorElement>;
  // next
  prefetch?: boolean;
}

const A = styled.a``;

/**
 * temporary solution for migrating React Router to Next.js Link
 */
export const NextLinkFromReactRouter = forwardRef<any, LinkProps>(
  ({ to, replace, children, prefetch, ...props }, ref) => (
    // Add legacyBehavior to avoid hydration error
    <NextLink
      legacyBehavior
      href={to as string}
      replace={replace}
      passHref
      prefetch={prefetch}
    >
      <A ref={ref} {...props}>
        {children}
      </A>
    </NextLink>
  )
);


const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }
`;

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }
`;

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`;

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
`;

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
  will-change: transform;
  > span {
    overflow: visible !important; // make sure the next-image pre-build blur image not be cropped
  }
`;

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`;

const starsImage: CompositeImageProps = {
  path: "/images/home/lunar-bunny/",
  attributes: [
    { src: "star-l", alt: "3D Star" },
    { src: "star-r", alt: "3D Star" },
    { src: "star-top-r", alt: "3D Star" },
  ],
};


const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading2:
    "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  paragraph:
    "font-poppins text-[18px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-8 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
};
const GetStarted = () => (
  <div
    className={`${styles.flexCenter} bg-blue-gradient h-[140px] w-[140px] cursor-pointer rounded-full p-[2px]`}
  >
    <div
      className={`${styles.flexCenter} h-[100%] w-[100%] flex-col rounded-full`}
    >
      <div className={`${styles.flexStart} flex-row`}>
        <p className="font-poppins text-[18px] font-medium leading-[23.4px]">
          <span className="text-gradient">Get</span>
        </p>
        {/* <img
          src={arrowUp}
          alt="arrow-up"
          className="h-[23px] w-[23px] object-contain"
        /> */}
      </div>

      <p className="font-poppins text-[18px] font-medium leading-[23.4px]">
        <span className="text-gradient">Started</span>
      </p>
    </div>
  </div>
);

interface IHero {
  togleOpenWallet: () => void;
}

const Hero = ({ toggleOpenWallet}: { toggleOpenWallet: () => void}) => {
  const { account } = useWeb3React()
  return (
    <>
      <section
        id="home"
        className={`flex flex-col md:flex-row  h-screen `}
      >
        <BgWrapper>
          <InnerWrapper>
            <SlideSvgLight className="slide-svg-light" width="100%" />
          </InnerWrapper>
        </BgWrapper>
        <div
          className={`flex-1 ${styles.flexStart} min-h-[600px] flex-col px-6 sm:px-16 xl:px-0`}
        >
          <div className="flex w-full flex-row items-center justify-between ">
            <h1 className="ss:text-[79px]  flex-1 font-poppins text-[65px] font-[800] leading-[65px] text-[rgb(118,69,217)]">
              Enjoy your
              <span className="text-gradient font-[800] text-[rgb(31,199,212)]">
                {" "}
                Cake
              </span>{" "}
            </h1>
            <div className="ss:flex mr-0 hidden md:mr-4">
              <GetStarted />
            </div>
          </div>

          <h1 className="ss:text-[68px] w-full font-poppins text-[65px] font-[800] leading-[65px] text-[rgb(118,69,217)]">
            from anywhere.
          </h1>
          <p
            className={`${styles.paragraph} mt-5 max-w-[520px] font-[800] text-[rgb(40,13,95)]`}
          >
            Swap any token on any chain, from any chain all for free with 0 gas.
            Simply amazing.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            {!account && (
              <PrimaryButton
                className={`relative mr-4 mt-[2px] ${
                  account
                    ? "border-b-[3px] border-[#1fc7d4] bg-[#e9eaeb] hover:bg-[#eeeef1]"
                    : "bg-[#1fc7d4] hover:bg-[#33e1ed]"
                } rounded-xl py-[12px]`}
                onClick={toggleOpenWallet}
              >
                <span
                  className={`${
                    account ? "ml-6 mr-2 text-[#280d5f]" : " text-white"
                  } hidden font-[900] xs:block`}
                >
                  Connect Wallet
                </span>
              </PrimaryButton>
            )}
            <NextLinkFromReactRouter to="/swap">
              <PrimaryButton
                className={`relative mt-[2px] ${
                  account
                    ? "border-b-[3px] border-[#d7d8da] bg-[#e9eaeb] hover:bg-[#eeeef1]"
                    : "bg-[#1fc7d4] hover:bg-[#33e1ed]"
                } rounded-xl py-[12px]`}
                // onClick={ac}
              >
                <span
                  className={`${
                    account ? "ml-6 mr-2 text-[#280d5f]" : " text-white"
                  } hidden font-[900] xs:block`}
                >
                  Get Started
                </span>
              </PrimaryButton>
            </NextLinkFromReactRouter>
          </div>
        </div>

        {/* <div className={`ss:hidden ${styles.flexCenter}`}>
        <GetStarted />
      </div> */}
        <div
          className={`hidden md:flex md:flex-1 ${styles.flexCenter} relative my-10 items-center justify-center md:my-0`}
        >
          <BunnyWrapper>
            <Image
              src={bunnyImage}
              priority
              placeholder="blur"
              alt={"Lunar bunny"}
              width={600}
            />
          </BunnyWrapper>
          <StarsWrapper>
            <CompositeImage {...starsImage} />
          </StarsWrapper>
        </div>
      </section>
      <Section2 />
      <Footer/>
    </>
  );
};

export default Hero;
