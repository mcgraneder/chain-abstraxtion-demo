import { useTransactionFlow } from "@/context/useTransactionFlowState";
import PrimaryButton from "./PrimaryButton";
import { useWeb3React } from "@web3-react/core";

interface ITransactionProps {
  isSufficentBalance: boolean;
  transactionType: string;
}

const TransactionButton = ({
  isSufficentBalance,
  transactionType,
}: ITransactionProps) => {
  const { account } = useWeb3React();
  const { toggleConfirmationModal } = useTransactionFlow();
  const error = !account || !isSufficentBalance;

  const getButtonText = () => {
    if (!account) return "Connect Wallet";
    else if (!isSufficentBalance) return "Insufficent Balance";
    else return transactionType;
  };

  const getButtonColor = () => {
    if (!account || !isSufficentBalance) return "bg-[#c9c6cc]";
    else return "bg-[#1fc7d4] hover:bg-[#33e1ed]";
  };

  return (
    <PrimaryButton
      className={`flex w-full items-center justify-center rounded-[24px] py-3 hover:cursor-pointer ${getButtonColor()}`}
      onClick={() => {
        if (!account) return;
        toggleConfirmationModal();
      }}
      disabled={false}
    >
      <span className="text-[18px] font-[900] text-white">
        {getButtonText()}
      </span>
    </PrimaryButton>
  );
};

export default TransactionButton;
