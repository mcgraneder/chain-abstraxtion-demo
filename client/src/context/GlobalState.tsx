import {
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
  const { account, chainId, active } = useWeb3React();
  const [loading, setLoading] = useState<boolean>(true);
 
  const [allBalances, setAllBalances] = useState<{
    [chain: string]: { [x: string]: MulticallReturn };
  }>({});
  const [assetBalances, setAssetBalances] = useState<{
    [x: string]: MulticallReturn;
  } | undefined>(undefined);

  const memoizedFetchBalances = useCallback(async () => {
    if (!account) return;
    // setFetchingBalances(true);
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
      // setFetchingBalances(false);
      throw new Error("Multicall Failed");
    }

    console.log(tokensResponse.result.multicall)
    setAllBalances(tokensResponse.result.multicall);
    // setFetchingBalances(false);
  }, [account]);


 

  useEffect(() => {
    if (!active) return;
    memoizedFetchBalances();
    console.log("hey")
    const interval: NodeJS.Timer = setInterval(memoizedFetchBalances, 50000);
    return () => clearInterval(interval);
  }, [memoizedFetchBalances, active]);

 
  return (
    <GlobalStateContext.Provider
      value={{
        memoizedFetchBalances,
        allBalances,
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
