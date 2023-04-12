import { useEffect, useRef, useState } from "react";
import { getRefValue } from "../../hooks/useGetRefValue";
import { StyledTokenRow } from "../Transactions/TransactionBlockInfo";
import Tooltip from "../Tooltip/Tooltip";

import { UilQuestionCircle, UilAngleDown, UilPump, UilLockAlt, UilSpinnerAlt } from '@iconscout/react-unicons';
import BigNumber from "bignumber.js";
import { loadingAnimation } from "../Transactions/TransactionTable";
import styled, { css } from "styled-components"
import { Chain } from '@renproject/chains';
// import { chainsBaseConfig } from '../utils/chainsConfig';
// import { CHAINS } from "../connection/chains";

export const GlowingText = styled.span`
  font-size: 16px;
  animation-fill-mode: both;
  background: ${(props: any) =>
    props.loading
      ? `linear-gradient(
    to left,
    rgb(98, 107, 128) 25%,
    rgb(255, 255, 255) 50%,
    rgb(98, 107, 128) 75%
  )`
      : "white"};
  will-change: background-position;
  background-size: 400%;
  -webkit-background-clip: text;
  color: transparent;

  ${(props: any) =>
    props.loading &&
    css`
      animation: ${loadingAnimation} 1.6s infinite;
    `}
`;

function AccordionItem({
    transaction,
    isOpen,
    btnOnClick
}: {
    transaction: any;
    isOpen: boolean;
    btnOnClick: () => void;
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (isOpen) {
            const contentEl = getRefValue(contentRef);

            setHeight(contentEl.scrollHeight - 155);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    const effectiveGP = Number(transaction.effectiveGasPrice.hex)
    const gasUsed = Number(transaction.gasUsed.hex)

    const maxBaseFee = Number(transaction.cumulativeGasUsed.hex);
    const maxPriorityFee = new BigNumber(
        transaction.maxPriorityFeePerGas
    ).shiftedBy(-9);

    const explorerLink =""
    return (
      <li className={` ${isOpen ? "active" : ""}`}>
        <div className="my-2 flex items-center justify-start">
          <div
            className={
              "hover:  flex items-center justify-center py-[2px] text-center font-[600] text-[#280d5f] hover:cursor-pointer"
            }
            onClick={btnOnClick}
          >
            <UilAngleDown />
            <span>Expand to view more info.</span>
          </div>
        </div>
        <div
          className={`accordion-item-container mb-5 rounded-[10px] border-b border-tertiary`}
          style={{ height }}
        >
          <div
            ref={contentRef}
            className="accordion-item-content overflow-y-auto"
            style={{ height }}
          >
            <StyledTokenRow>
              <div className="flex items-center gap-2">
                <Tooltip content={"info"}>
                  <UilQuestionCircle className="h-5 w-5 font-[600] text-[#280d5f]" />
                </Tooltip>
                <span className="font-[600] text-[#280d5f]">
                  {"Block Hash:"}
                </span>
              </div>
              {transaction.blockHash ? (
                <div className="flex items-center gap-2 text-[#1fc7d4]">
                  <Tooltip content={"View on Etherscan"}>
                    <a
                      href={`${explorerLink}/block/${transaction.blockNumber}`}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {transaction.blockHash}
                    </a>
                  </Tooltip>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <GlowingText loading={true}>
                    waiting for transaction to complete...
                  </GlowingText>
                  <UilSpinnerAlt
                    className={" h-6 w-6 animate-spin text-[#7a6eaa]"}
                  />
                </div>
              )}
            </StyledTokenRow>
            <StyledTokenRow>
              <div className="flex items-center gap-2">
                <Tooltip content={"info"}>
                  <UilQuestionCircle className="h-5 w-5 font-[600] text-[#280d5f]" />
                </Tooltip>
                <span className="font-[600] text-[#280d5f]">
                  {"Block Number:"}
                </span>
              </div>
              {transaction.blockNumber ? (
                <div className="flex items-center gap-2 ">
                  <span className="text-[#7a6eaa]">
                    {transaction.blockNumber}
                  </span>
                  <UilLockAlt className="h-5 w-5 font-[600] text-[#280d5f]" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <GlowingText loading={true}>
                    waiting for transaction to complete...
                  </GlowingText>
                  <UilSpinnerAlt
                    className={" h-6 w-6 animate-spin text-[#7a6eaa]"}
                  />
                </div>
              )}
            </StyledTokenRow>

            <StyledTokenRow>
              <div className="flex items-center gap-2">
                <Tooltip content={"info"}>
                  <UilQuestionCircle className="h-5 w-5 font-[600] text-[#280d5f]" />
                </Tooltip>
                <span className="font-[600] text-[#280d5f]">
                  {"From Address:"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#1fc7d4]">
                <Tooltip content={"View on Etherscan"}>
                  <a
                    href={`${explorerLink}/address/${transaction.from}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {transaction.from}
                  </a>
                </Tooltip>

              </div>
            </StyledTokenRow>
            <StyledTokenRow>
              <div className="flex items-center gap-2">
                <Tooltip content={"info"}>
                  <UilQuestionCircle className="h-5 w-5 font-[600] text-[#280d5f]" />
                </Tooltip>
                <span className="font-[600] text-[#280d5f]">
                  {"To Address:"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#1fc7d4]">
                <Tooltip content={"View on Etherscan"}>
                  <a
                    href={`${explorerLink}/address/${transaction.to}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {transaction.to}
                  </a>
                </Tooltip>

                
              </div>
            </StyledTokenRow>
            <StyledTokenRow>
              <div className="flex items-center gap-2">
                <Tooltip content={"info"}>
                  <UilQuestionCircle className="h-5 w-5 font-[600] text-[#280d5f]" />
                </Tooltip>
                <span className="font-[600] text-[#280d5f]">{"Gas Used:"}</span>
              </div>
              {gasUsed ? (
                <div className="">
                  <span className="text-[#7a6eaa]">{`${gasUsed} Gwei`}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <GlowingText loading={true}>
                    waiting for transaction to complete...
                  </GlowingText>
                  <UilSpinnerAlt
                    className={" h-6 w-6 animate-spin text-[#7a6eaa]"}
                  />
                </div>
              )}
            </StyledTokenRow>
            <StyledTokenRow>
              <div className="flex items-center gap-2">
                <Tooltip content={"info"}>
                  <UilQuestionCircle className="h-5 w-5 font-[600] text-[#280d5f]" />
                </Tooltip>
                <span className="font-[600] text-[#280d5f]">
                  {"Effective GasPrice:"}
                </span>
              </div>
              {transaction.gasPrice !== "NaN" ? (
                <div className="flex items-center gap-2 ">
                  <span className="text-[#7a6eaa]">{`${effectiveGP} Gwei`}</span>
                  <UilPump className="h-5 w-5 font-[600] text-[#280d5f]" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <GlowingText loading={true}>
                    waiting for transaction to complete...
                  </GlowingText>
                  <UilSpinnerAlt
                    className={" h-6 w-6 animate-spin text-[#7a6eaa]"}
                  />
                </div>
              )}
            </StyledTokenRow>
            <StyledTokenRow>
              <div className="flex items-center gap-2">
                <Tooltip content={"info"}>
                  <UilQuestionCircle className="h-5 w-5 font-[600] text-[#280d5f]" />
                </Tooltip>
                <span className="font-[600] text-[#280d5f]">
                  {"Cumulative Gas Used:"}
                </span>
              </div>
              <div className="">
                <span className="text-[#7a6eaa]">{`${maxBaseFee} Gwei`}</span>
              </div>
            </StyledTokenRow>
            <StyledTokenRow>
              <div className="flex items-center gap-2">
                <Tooltip content={"info"}>
                  <UilQuestionCircle className="h-5 w-5 font-[600] text-[#280d5f]" />
                </Tooltip>
                <span className="font-[600] text-[#280d5f]">{"Value:"}</span>
              </div>
              <div className="">
                <span className="font-[600] text-[#7a6eaa]">
                  {"0.00 Ether"}
                </span>
              </div>
            </StyledTokenRow>
          </div>
        </div>
      </li>
    );
}

export default AccordionItem;
