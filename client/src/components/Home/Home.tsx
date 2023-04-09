import Flex from "../Box/Flex";
import Image from "next/legacy/image";
import styled, { keyframes } from "styled-components";
import bunnyImage from "../../../public/images/astronaut-bunny.png";
import CompositeImage, { CompositeImageProps } from "./CompositeImage";
import { SlideSvgDark, SlideSvgLight } from "./SlideSvg";
import { useWeb3React } from "@web3-react/core";
import { forwardRef } from "react";
import NextLink from "next/link";
import Heading, { Heading2 } from "../Box/Heading";
import PrimaryButton from '../Buttons/PrimaryButton';


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
  bottom: -3px;
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

const Hero = () => {
  const { account, chainId } = useWeb3React();

  return (
    <>
      <style jsx global>
        {`
          .slide-svg-dark {
            display: none;
          }
          .slide-svg-light {
            display: block;
          }
          [data-theme="dark"] .slide-svg-dark {
            display: block;
          }
          [data-theme="dark"] .slide-svg-light {
            display: none;
          }
        `}
      </style>
      <BgWrapper>
        <InnerWrapper>
          <SlideSvgDark className="slide-svg-dark" width="100%" />
          <SlideSvgLight className="slide-svg-light" width="100%" />
        </InnerWrapper>
      </BgWrapper>
      <Flex
        position="relative"
        flexDirection={["column-reverse", null, null, "row"]}
        alignItems={["flex-end", null, null, "center"]}
        justifyContent="center"
        mt={[account ? "280px" : "50px", null, 0]}
        id="homepage-hero"
      >
        <Flex flex="1" flexDirection="column">
          <Heading scale="xxl" color="rgb(118,69,217)" mb="24px">
            {"Enjoy your Cake from anywhere!"}
          </Heading>
          <Heading2 scale="md" mb="24px" color={""}>
            {
              "On PancakeSwap V3, Defi users can execute swaps & trades on any chain from any chain. It's that simple"
            }
          </Heading2>
          <Flex>
            <PrimaryButton
              className={`relative mr-4 mt-[2px] ${
                account
                  ? "border-[#1fc7d4] border-b-[3px] bg-[#e9eaeb] hover:bg-[#eeeef1]"
                  : "bg-[#1fc7d4] hover:bg-[#33e1ed]"
              } rounded-xl py-[12px]`}
              // onClick={ac}
            >
              <span
                className={`${
                  account ? "ml-6 mr-2 text-[#280d5f]" : " text-white"
                } hidden font-[900] xs:block`}
              >
                Learn More
              </span>
            </PrimaryButton>
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
          </Flex>
        </Flex>
        <Flex
          height={["192px", null, null, "100%"]}
          width={["192px", null, null, "100%"]}
          flex={[null, null, null, "1"]}
          mb={["24px", null, null, "0"]}
          position="relative"
        >
          <BunnyWrapper>
            <Image
              src={bunnyImage}
              priority
              placeholder="blur"
              alt={"Lunar bunny"}
            />
          </BunnyWrapper>
          <StarsWrapper>
            <CompositeImage {...starsImage} />
          </StarsWrapper>
        </Flex>
      </Flex>
    </>
  );
};

export default Hero;
