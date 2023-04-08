import { AssetBaseConfig } from "../../utils/assetsConfig";

export const MESSAGES = (
  transactionType: string,
  success: boolean,
  amount: string,
  asset: AssetBaseConfig,
): string => {
  const messageMapping: { [title: string]: string } = {
    ["Deposit"]: `${
      success ? "Successfully deposited" : "Failed to deposit"
    } ${amount} ${asset.Icon}`,
    ["Withdraw"]: `${
      success ? "Successfully withdrew" : "Failed to withdraw"
    } ${amount} ${asset.Icon}`,
    ["Approve"]: `${
      success ? "Successfully approved" : "Failed to approve"
    } ${amount} ${asset.Icon}`,
  };

  return messageMapping[transactionType] as string;
};
