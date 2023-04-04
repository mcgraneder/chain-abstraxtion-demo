import { AbstractConnector } from "@web3-react/abstract-connector";
import MetamaskIcon from "../../public/svgs/metamask-fox.svg";
import WalletConnectIcon from "../../public/svgs/wallet_connect.svg";
import { injected } from "./providers";
import { walletconnect } from "./providers";

export interface WalletInfo {
  provider: string;
  connector: AbstractConnector;
  name: string;
  href: string | null;
  description: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const PROVIDERS = {
  INJECTED: "injected",
  FORTMATIC: "fortmatic",
  WALLETCONNECT: "walletconnect",
  WALLETLINK: "walletlink",
  PORTIS: "portis",
};

export const WALLETS: { [key: string]: WalletInfo } = {
  [PROVIDERS.INJECTED]: {
    provider: "injected",
    connector: injected,
    name: "Metamask",
    href: null,
    description: "metamaskIcon wallet",
    icon: MetamaskIcon as WalletInfo["icon"],
  },
  [PROVIDERS.WALLETCONNECT]: {
    provider: "walletconnect",
    connector: walletconnect,
    name: "WalletConnect",
    href: null,
    description: "wallet connect wallet",
    icon: WalletConnectIcon as WalletInfo["icon"],
  },
};

export const walletIcon: {
  [x: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
  [PROVIDERS.INJECTED]: MetamaskIcon as WalletInfo["icon"],
  [PROVIDERS.WALLETCONNECT]: WalletConnectIcon as WalletInfo["icon"],
};

export const NetworkContextName = "NETWORK";
