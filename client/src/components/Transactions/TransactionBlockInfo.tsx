// import Tooltip from "../../Tooltip/Tooltip";
import {
  UilCheck,
  UilHourglass,
  UilQuestionCircle,
} from "@iconscout/react-unicons";
import Web3 from "web3";
// import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
// import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
// import { useNumberOfBlockConfirmations } from "../../../hooks/useBlockNumberConfirmations";
import Link from "next/link";
import styled, { css } from "styled-components";
import Accordion from "../Accordian/Accordian";
import Tooltip from "../Tooltip/Tooltip";

export const StyledTokenRow = styled.div`
  background-color: transparent;
  display: grid;
  font-size: 16px;
  grid-template-columns: 3fr 7fr;
  line-height: 24px;
  max-width: 1200px;
  min-width: 390px;
  padding: 15px 20px;
  width: 100%;
`;

var hexToNumber = function (hex: string) {
  return parseInt(hex, 16);
};

// interface ITransactionDataTab {
//   ethrpc: EthereumJSONRPC;
//   transaction: TransactionOrNull;
//   setActiveBlock: any;
//   handleAddress: any;
//   handleBlock: any;
//   decodedInputData: any;
// }

interface InavLink {
  href: string;
  display: string;
  tooltipText: string;
  page: string;
}
export const NavLink = ({ href, display, tooltipText, page }: InavLink) => {
  return (
    <Tooltip content={tooltipText}>
      <Link key={href} href={`/${page}/${href}`}>
        <div className=" font-semibold text-primary hover:cursor-pointer">
          {display}
        </div>
      </Link>
    </Tooltip>
  );
};

export const DataRow = ({
  tooltipContent,
  rowTitle,
  classNames,
  children,
}: any) => {
  return (
    <div className=" flex cursor-auto flex-col gap-[30px] px-5  py-5 md:flex-row">
      <div className="flex items-center gap-2">
        <Tooltip content={tooltipContent}>
          <UilQuestionCircle className="text-grey-400 h-5 w-5" />
        </Tooltip>
        <div className="w-[200px] text-white lg:w-[280px]">{rowTitle}</div>
      </div>
      <div className={`flex gap-2 overflow-hidden break-words ${classNames}`}>
        {children}
      </div>
    </div>
  );
};

interface ITransactionBlockInfo {
  transaction: any;
}
const TransactionBlockInfo = ({ transaction }: ITransactionBlockInfo) => {
  return (
    <div className=" flex w-full flex-col items-start justify-center px-4">
      <Accordion transaction={transaction} />
    </div>
  );
};

export default TransactionBlockInfo;
