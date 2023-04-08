import React, {
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWeb3React } from "@web3-react/core";
import { Chain, Asset } from "@renproject/chains";
import API from "../constants/Api";
import { get, post } from "../services/axios";

interface GlobalStateProviderProps {
  children: React.ReactNode;
}

type GlobalContextType = {
  memoizedFetchBalances: () => Promise<void>;
  allBalances: {
    [chain: string]: { [x: string]: MulticallReturn };
  };
  pending: boolean;
  setPending: React.Dispatch<SetStateAction<boolean>>;
  togglePending: () => void;
  fetchingBalances: boolean;
  exec: (execute: () => void) => void;
};

export type MulticallReturn = {
  tokenAddress: string;
  chain: Chain;
  asset: Asset;
  walletBalance: string;
  bridgeBalance: string;
};

export type GP = {
  type: string;
  gasPrice: number | null;
  gasLimit: number | null;
};
const GlobalStateContext = createContext({} as GlobalContextType);

function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const { account, active } = useWeb3React();
  const [fetchingBalances, setFetchingBalances] = useState<boolean>(false)
  const [pending, setPending] = useState<boolean>(false);
 
  const [allBalances, setAllBalances] = useState<{
    [chain: string]: { [x: string]: MulticallReturn };
  }>({});
  const [assetBalances, setAssetBalances] = useState<{
    [x: string]: MulticallReturn;
  } | undefined>(undefined);

  const togglePending = useCallback(() => {
    setPending((p: boolean) => !p)
  }, [setPending])

  const memoizedFetchBalances = useCallback(async () => {
    if (!account) return;
    setFetchingBalances(true);
    const tokensResponse = await get<{
      result: {
        multicall: {
          [chain: string]: { [x: string]: MulticallReturn };
        };
      };
    }>(API.next.balancesof, {
      params: {
        of: account,
      },
    });
    if (!tokensResponse) {
      setFetchingBalances(false);
      throw new Error("Multicall Failed");
    }
    setAllBalances(tokensResponse.result.multicall);
  }, [account]);

  useEffect(() => {
    if (!active) return;
    memoizedFetchBalances();
    console.log("hey")
    const interval: NodeJS.Timer = setInterval(memoizedFetchBalances, 50000);
    return () => clearInterval(interval);
  }, [memoizedFetchBalances, active]);

  const exec = (execute: () => void) => execute()
 
  return (
    <GlobalStateContext.Provider
      value={{
        memoizedFetchBalances,
        allBalances,
        pending,
        setPending,
        togglePending,
        fetchingBalances,
        exec
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

const useGlobalState = () => {
  return useContext(GlobalStateContext);
};

export { GlobalStateProvider, useGlobalState };
