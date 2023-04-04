/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect } from "../connection/providers";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { type WalletInfo } from "../connection/wallets";
import { type AbstractConnector } from "@web3-react/abstract-connector";
import { CHAINS, type ChainType } from "../connection/chains";

export const ERROR_MESSSAGES: { [x: string]: string } = {
  ["NETWORK_SWITCH"]:
    "User deined the prompt to switch chains. Please try again",
  ["USER_REJECTED"]:
    "User rejected the request. Please click try again and follow the steps to connect in your wallet.",
  ["REQUEST_PENDING"]:
    "Metamask is already open in the background. Please open MetaMask via your extensions and accept the connection.",
  ["NO_PROVIDER"]:
    "You dont have Metamask installed. Please install Metamask to continue using this application",
  ["UNKNOWN"]:
    "Unknown error occured causing the connection to fail.  Please click try again and follow the steps to connect in your wallet.",
};

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

function useWallet() {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    library,
    activate,
    deactivate,
    active: connected,
    active,
    account,
  } = useWeb3React();

  const [error, setWalletError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    ERROR_MESSSAGES["USER_REJECTED"] as string
  );
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();
  const [pendingChain, setPendingChain] = useState<number | undefined>(
    undefined
  );
  const [hasSigned, setHasSigned] = useState<boolean>(true);
  const [activeSession, setActiveSession] = useState<boolean>(false);

  const toggleErrorModal = useCallback(
    () => setWalletError(false),
    [setWalletError]
  );
  const toggleConecting = useCallback(
    () => setConnecting((c) => !c),
    [setConnecting]
  );
  const toggleWalletModal = useCallback(
    () => setOpenWalletModal((w) => !w),
    [setOpenWalletModal]
  );

  useEffect(() => {
    if (active && errorMessage == ERROR_MESSSAGES["NETWORK_SWITCH"])
      setWalletError(false);
    if (error) setConnecting(false);
    if (typeof window !== undefined) {
      if (
        activeSession &&
        account &&
        active &&
        localStorage.getItem("authToken")
      )
        setHasSigned(false);
    }
  }, [active, error, account, activeSession, errorMessage]);

  useEffect(() => {
    setTimeout(() => {
      setConnecting(false);
    }, 1000);
  }, [connected]);

  useEffect(() => {
    setTimeout(() => setActiveSession(true), 4000);
  }, []);

  const getConnector = (provider: string): AbstractConnector => {
    let connector: AbstractConnector | null;
    if (provider === "injected") connector = injected;
    if (provider === "walletconnect") connector = walletconnect;
    else connector = injected;
    return connector;
  };

  const disconnect = useCallback(() => {
    deactivate();
    localStorage.removeItem("provider");
    localStorage.removeItem("authToken");
  }, [deactivate]);

  const activateWallet = useCallback(
    (wallet: AbstractConnector, manualLogin: boolean) => {
      if (wallet == undefined) return;
      activate(wallet, undefined, true).catch((err: ProviderRpcError) => {
       if (
          err instanceof UserRejectedRequestErrorInjected ||
          err instanceof UserRejectedRequestErrorWalletConnect
        ) {
          setWalletError(true);
          setErrorMessage(ERROR_MESSSAGES["USER_REJECTED"]!);
        } else if (err instanceof NoEthereumProviderError) {
          setWalletError(true);
          setErrorMessage(ERROR_MESSSAGES["NO_PROVIDER"]!);
        } else if (err.code == -32002) {
          setWalletError(true);
          setErrorMessage(ERROR_MESSSAGES["REQUEST_PENDING"]!);
        } else {
          setWalletError(true);
          setErrorMessage(ERROR_MESSSAGES["UNKNOWN"]!);
        }
        setHasSigned(true);
      })
       
      if (manualLogin) setHasSigned(false);
    },
    [activate]
  );

  const connectOnLoad = useCallback(
    (WalletConnector: AbstractConnector) => {
      if (WalletConnector === injected) {
        activateWallet(WalletConnector, false);
      } else {
        setTimeout(() => {
          activateWallet(WalletConnector, false);
        }, 2000);
      }
    },
    [activateWallet]
  ); //run once on page load

  const reset = (): void => {
    setOpenWalletModal(false);
    setConnecting(false);
    setWalletError(false);
  };

  //run only once on mount solves bug from our call.
  //if curious ask me and ill explain
  useEffect(() => {
    if (typeof window == "undefined") return;
    const provider = localStorage.getItem("provider");

    const WalletConnector = getConnector(provider!);
    if (!library && provider && WalletConnector) {
      connectOnLoad(WalletConnector);
    }
  }, []);

  function connectOn(wallet: WalletInfo) {
    localStorage.setItem("provider", wallet.provider);
    activateWallet(wallet.connector, true);
  }

  const _switchNetwork = useCallback(
    async (network: number) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const { ethereum } = window;
      const hexChainId = `0x${network.toString(16)}`;
      const chainInfo = CHAINS[network];

      try {
        await ethereum?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hexChainId }],
        });
        setWalletError(false);
      } catch (error) {
        const typedError = error as ProviderRpcError
        if (typedError.code === 4902) {
          // TODO: get new chain params
          try {
            await ethereum?.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: hexChainId,
                  chainName: chainInfo?.chainName,
                  rpcUrls: chainInfo?.rpcUrls,
                  nativeCurrency: {
                    name: chainInfo?.currency,
                    symbol: chainInfo?.symbol,
                    decimals: 18,
                  },
                  blockExplorerUrls: [chainInfo?.explorerLink],
                },
              ],
            });
            setWalletError(false);
          } catch (addError) {
            const typedError = addError as ProviderRpcError;
            // handle "add" error
            setConnecting(false);

            return { switched: false, errorCode: typedError.code };
          }
        } else if (typedError.code == -32002) {
          setWalletError(true);
          setErrorMessage(ERROR_MESSSAGES["REQUEST_PENDING"]!);
        }

        return { switched: false, errorCode: typedError.code };
      }
    },
    [setWalletError, setErrorMessage]
  );

  const needToSwitchChain = (id: number): boolean => {
    const chains = Object.values(CHAINS);
    const chain = chains.find((chain: ChainType) => chain.id == id);
    if (!chain) return false;
    else return true;
  };

  const switchNetwork = async (id: number) => {
    const result = await _switchNetwork(id);
    return result;
  };

  return {
    disconnect,
    connectOn,
    error,
    setWalletError,
    openWalletModal,
    setOpenWalletModal,
    connecting,
    setConnecting,
    pendingWallet,
    setPendingWallet,
    toggleErrorModal,
    toggleConecting,
    toggleWalletModal,
    reset,
    errorMessage,
    needToSwitchChain,
    switchNetwork,
    hasSigned,
    setHasSigned,
  };
}


export default useWallet;
