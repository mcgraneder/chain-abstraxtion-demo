import { BigNumberish, PopulatedTransaction } from "ethers";

const getMetaTxTypedData = async (
  tx: PopulatedTransaction,
  sigChainID: number,
  from?: string,
  chainId?: number,
  nonceIn?: BigNumberish,
  catalogForwarder?: string
) => {
  const domain = {
    name: "CatalogForworder",
    version: "0.0.1",
    chainId: sigChainID,
    verifyingContract: Forwarder || Forwarder.address,
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

  const nonce =
    nonceIn || (await CatalogForwarder.getNonce(from ? from : tx.from!));

  const values = {
    from: from ? from : tx.from!,
    to: tx.to!,
    value: 0,
    gas: tx.gasLimit! || 0,
    nonce: nonce.toString(),
    chainID: chainId || hre.network.config.chainId!,
    sigChainID: sigChainID,
    data: tx.data!,
  };

  return {
    domain: domain,
    types: types,
    values: values,
  };
};
