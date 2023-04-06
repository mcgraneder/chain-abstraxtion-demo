import React from "react";
import { Icons as AssetIcons } from "./assets/index";
import { Icons as ChainIcons } from "./chains/index";
import Image from "next/image";

interface Props {
  chainName: string;
  white?: boolean;
}

export const Icon: React.FC<
  Props &
    (React.SVGProps<SVGSVGElement> &
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ chainName, white, className, ...props }) => {
  const Icon = ChainIcons[chainName] || AssetIcons[chainName];
  return <>{Icon && <Icon className={className} {...props} />}</>
};


export const IMGIcon: React.FC<
  Props &
    (React.SVGProps<SVGSVGElement> &
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ chainName, white, className, ...props }) => {
  const Icon = ChainIcons[chainName] || AssetIcons[chainName];
  return (
    <>
      {
        <Image
          alt="CAKE2 logo"
          src="https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png"
        ></Image>
      }
    </>
  );
};

