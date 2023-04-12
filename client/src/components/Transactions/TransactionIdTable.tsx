import { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import HeaderRow from "./HeaderRow";
import TransactionRow from "./TransactionRow";
import { StyledTokenRow } from "./HeaderRow";
import { useWeb3React } from "@web3-react/core";
import { useGlobalState } from "@/context/GlobalState";
import { keyframes } from "styled-components"
import TransactionBlockInfo from "./TransactionBlockInfo";
import { useRouter } from "next/router";


export const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;


export const MAX_WIDTH_MEDIA_BREAKPOINT = "1200px";

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  background-color: white;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  /* justify-content: center; */
  align-items: center;
  border: 1px solid rgb(231, 227, 235);
`;

export type UserTxType = {
  Id: string;
  account: string;
  amount: string;
  chain: string;
  Ethereum: string;
  currency: string;
  BTC: string;
  date: number;
  status: string;
  completed: string;
  txHash: string;
  txType: string;
  deposit: string;
};

export const GlowingText = styled.div`
  font-size: 35px;
  width: 100%;
  height: 80%;
  border-radius: 12px;
  animation-fill-mode: both;
  background: ${(props: any) =>
    props.loading
      ? `linear-gradient(
    to left,
    rgb(179, 223, 228) 25%,
    rgb(233, 247, 247) 50%,
    rgb(182, 212, 224) 75%
  )`
      : "white"};
  will-change: background-position;
  background-size: 400%;

  color: transparent;

  ${(props: any) =>
    props.loading &&
    css`
      animation: ${loadingAnimation} 1s infinite;
    `}
`;

interface TransactionTableProps {
  filteredChain: any;
  filteredStatus: any;
  filteredType: any;
}

export default function TransactionIdTable() {
    const { account } = useWeb3React()
 const { pending, transactions: txs } = useGlobalState()

     const { query } = useRouter();
    //  const [loading, setLoading] = useState<boolean>(true);
     const [transaction, setTransaction] = useState<any[] | undefined>(
       undefined
     );

     const fetchTxs = useCallback(() => {
       console.log(query.transactionId);
       if ( !query.transactionId) return;
        const filteredTransaction = txs.filter((tx: any) => tx.transactionHash === query.transactionId)
        console.log(filteredTransaction)
         setTransaction(filteredTransaction);
      
     }, [setTransaction, query.transactionId]);

     useEffect(() => {
       fetchTxs();
     }, [query.transactionId]);

  if (!transaction)
    return (
      <GridContainer>
        <HeaderRow />
        <div className="w-full border-[0.5px] border-gray-800" />
        {["1"].map(
          (item: any, index: number) => {
            return (
              <StyledTokenRow key={index}>
                <div className="flex w-[90%] items-center gap-2 text-blue-600">
                  <GlowingText loading={true}>
                    <div className=" h-5 w-5 rounded-full" />
                  </GlowingText>
                </div>
                <div className="flex w-[90%] items-center gap-2">
                  <GlowingText loading={true}>
                    <div className=" h-5 w-5 rounded-full" />
                  </GlowingText>
                </div>
                <div className="flex w-[90%] items-center gap-2">
                  <GlowingText loading={true}>
                    <div className=" h-5 w-5 rounded-full" />
                  </GlowingText>
                </div>
                <div className="flex w-[80%] items-center gap-2">
                  <GlowingText loading={true}>
                    <div className=" h-5 w-5 rounded-full" />
                  </GlowingText>
                </div>
                
              </StyledTokenRow>
            );
          }
        )}
      </GridContainer>
    );
    return (
      <GridContainer>
        <HeaderRow />
        <div className="w-full border-[0.5px] border-[rgb(231,227,235)]" />
        <TransactionRow {...transaction[0]} />;
        <TransactionBlockInfo transaction={transaction[0]} />
      </GridContainer>
    );
}
