import { BigNumberish, PopulatedTransaction } from "ethers";
import getContract from "./getContract";
import ForwarderABI from "../constants/ABIs/ForwarderABI.json"
import { Web3Provider } from '@ethersproject/providers';

export const getMetaTxTypedData = async (
  tx: PopulatedTransaction,
  sigChainID: number,
  library: Web3Provider,
  chainId: number,
  from?: string,
  nonceIn?: BigNumberish
) => {
  const domain = {
    name: "CatalogForworder",
    version: "0.0.1",
    chainId: sigChainID,
    verifyingContract: "0x6bB441DA26a349a706B1af6C8C4835B802cDe7d8",
  };

  const types = {
    CatalogRequest: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "gas", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "chainID", type: "uint256" },
      { name: "sigChainID", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
  };

  const CatalogForwarder = getContract(
    "0x6bB441DA26a349a706B1af6C8C4835B802cDe7d8",
    ForwarderABI,
    library
  );

  const nonce =
    nonceIn || (await CatalogForwarder.getNonce(from ? from : tx.from!));

  const values = {
    from: from ? from : tx.from!,
    to: tx.to!,
    value: 0,
    gas: 50000,
    nonce: nonce.toString(),
    chainID: chainId,
    sigChainID: sigChainID,
    data: tx.data!,
  };

  return {
    domain: domain,
    types: types,
    values: values,
  };
};
