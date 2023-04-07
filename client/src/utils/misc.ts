import BigNumber from "bignumber.js";
export function isProduction() {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
}

export const shortenAddress = (d: string, offset = 4) => {
  return `${d?.substring(0, 2)}...${d?.substring(
    d?.length - offset,
    d?.length
  )}`;
};

export const formatBalance = (balanceStr: string, decimals: number): string => {
  const formattedBal = new BigNumber(balanceStr).shiftedBy(-decimals)
  return formattedBal.toFixed(3);
}

export const formatBalancePercent = (balanceStr: string, decimals: number, percent: number): string => {
  const formattedBal = new BigNumber(balanceStr).shiftedBy(-decimals).multipliedBy(percent);
  return formattedBal.toFixed(3);
};