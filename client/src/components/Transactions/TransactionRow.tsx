import Identicon from "../Identicon/Identicon";
import styled from "styled-components";
import {
  UilExclamationTriangle,
  UilSpinnerAlt,
  UilCheckCircle,
} from "@iconscout/react-unicons";
import { formatTime } from "@/utils/date";
import { UserTxType } from "./TransactionTable";
import Link from "next/link";
import { Icon } from "../Icons/AssetLogs/Icon";
import { shortenAddress } from "@/utils/misc";

export const StyledTokenRow = styled(Link)`
  background-color: transparent;
  display: grid;
  font-size: 16px;
  grid-template-columns: 12fr 4fr 4fr 4fr;
  line-height: 24px;
  max-width: 1200px;
  min-width: 390px;
  padding: 15px 20px;
  width: 100%;

  @media (max-width: 1000px) {
    grid-template-columns: 8fr 4fr 4fr 4fr;
  }
  @media (max-width: 780px) {
    grid-template-columns: 10fr 4fr 4fr;
  }
    @media (max-width: 600px) {
    grid-template-columns: 10fr 5fr;
  }
`;

const Spinner = () => {
  return <UilSpinnerAlt className={" h-5 w-5 animate-spin text-gray-400"} />;
};
export interface RowData {
  txHash: string;
  Id: string;
  date: string;
  txType: string;
  chain: string;
  status: string;
  currency: string;
  amount: string;
}

const TransactionRow = (data: any) => {
  const date = formatTime(Math.floor(data.date / 1000).toString(), 0);
  const shortenedAddress = shortenAddress(data.transactionHash, 17);
  return (
    <StyledTokenRow
      href={`/history/${data.transactionHash}`}
      className={"hover:bg-[#f6f3f9]"}
    >
      <div className="flex items-center gap-2 text-blue-600">
        <Identicon size={18} />
        <span className="hidden md1:block">{`${data.transactionHash}`}</span>
        <span className="block md1:hidden">{shortenedAddress}</span>
      </div>
      <div className="hidden text-[#7a6eaa] md2:block">
        <span>{date}</span>
      </div>
      <div className="hidden text-[#7a6eaa] sm2:block">
        <span>{data.type}</span>
      </div>
      <div className="flex items-center gap-2 text-[#7a6eaa]">
        <span>{data.amount}</span>
        <Icon chainName={data.currency} className="h-5 w-5" />
      </div>
    </StyledTokenRow>
  );
};

export default TransactionRow;
