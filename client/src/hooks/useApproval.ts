import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useCallback } from "react";
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import getContract from "../utils/getContract";
import { useTransactionFlow } from "../context/useTransactionFlowState";
import { useGlobalState } from "@/context/GlobalState";

export const useApproval = () => {
  const { setPending } = useGlobalState();
  const { library, account: address, chainId } = useWeb3React();
  const { toggleRejectedModal } =
    useTransactionFlow();

  const init = useCallback(
    <contract extends Contract = Contract>(
      tokenAddress: string | undefined,
      ABI: any,
      withSignerIfPossible = true
    ): contract | null => {
      if (!tokenAddress || !ABI || !library || !chainId) return null;
      try {
        return getContract(
          tokenAddress,
          ABI,
          library,
          withSignerIfPossible && address ? address : undefined
        ) as contract;
      } catch (err) {
        console.error("Failed to get contract", err);
        return null;
      }
    },
    [library, chainId, address]
  );

  const approve = useCallback(
    async (
      tokenAddress: string,
      amount: any,
      addressToApprove: string
    ) => {
      // togglePendingModal()
      const tokenContract = init(tokenAddress, ERC20ABI, true);
      let receipt = null
      if (tokenContract) {
        try {
          const approvalTransaction = await tokenContract.approve(
            addressToApprove,
            ethers.constants.MaxUint256
          );
          // toggleSubmittedModal()
          receipt = await approvalTransaction.wait(1);
          setPending(false);
        } catch (err) {
          console.error(err);
          toggleRejectedModal();
        }
        return receipt
      }
    },
    [init, setPending, toggleRejectedModal]
  );

  return { approve, init };
};
