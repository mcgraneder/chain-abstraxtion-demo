import { NextApiRequest, NextApiResponse } from "next";
import { ERC20__factory } from '../../../../backend/typechain-types/factories/@openzeppelin/contracts/token/ERC20/ERC20__factory';
import { Staking__factory } from '../../../../backend/typechain-types/factories/contracts/Deposit.sol/Staking__factory';
import { Wallet, ethers } from "ethers";
import { Forwarder__factory } from "../../../../backend/typechain-types";

 const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");

 export interface UserOp {
  to: string;
  amount: string;
  data: string;
}

export interface Transaction {
  userOps: UserOp[];
  chainID: number;
  signature: string;
}
const getMetaTxTypedData = async (
  userOps: UserOp[],
  sigChainID: number,
  chainId: number,
  from?: string
) => {
  const domain = {
    name: "Executor",
    version: "0.0.1",
    chainId: sigChainID,
    verifyingContract: "0x96B3059bA1785120aa072a6dcA329acc8C8FA324",
  };

  const types = {
    UserOperation: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    ECDSAExec: [
      { name: "userOps", type: "UserOperation[]" },
      { name: "nonce", type: "uint256" },
      { name: "chainID", type: "uint256" },
      { name: "sigChainID", type: "uint256" },
    ],
  };

  const forwarder = await Forwarder__factory.connect(
    "0xc82993eFc2B02bC4Df602D6De1cb70aC90b4DED2",
    provider
    
  );
  const nonce = await forwarder.getNonce(from!);
  const values = {
    userOps: userOps,
    nonce: nonce,
    chainID: chainId,
    sigChainID: sigChainID,
  };

  return {
    domain,
    types,
    values,
  };
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    const chainID = parseInt(req.query.chainID!.toString());
    const sigChainID = parseInt(req.query.sigChainID!.toString());
    const tokenAddress = req.query.token!.toString();
    const amount = req.query.amount!.toString();
    const from = req.query.from!.toString();
         
    const signer = new Wallet(
      "e3986801b4817d188fe551eca7cc58a1ae4097f6f40136499137427c62ed9a9b",
      provider as any
    )
    const tokenContract = await ERC20__factory.connect(
      tokenAddress,
      signer
    );
    const depositer = await Staking__factory.connect(
      "0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532",
      signer
    );
    const tx1 = await depositer
      .connect(signer)
      .populateTransaction.depositTokensToForwarder(
        amount,
        tokenContract.address,
        from,
        "0xc82993eFc2B02bC4Df602D6De1cb70aC90b4DED2",
        {
          gasLimit: 2000000,
        }
      );
    const tx2 = await tokenContract
      .connect(signer)
      .populateTransaction.approve(
        "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
        amount
      );

    const userOps: UserOp[] = [
      {
        to: depositer.address,
        amount: "0",
        data: tx1?.data!,
      },
      {
        to: tokenContract.address,
        amount: "0",
        data: tx2?.data!,
      },
    ];
    const typedData = await getMetaTxTypedData(
      userOps,
      sigChainID,
      chainID,
      from
    );
    console.log(typedData);
    res.json({ result: typedData });
}
