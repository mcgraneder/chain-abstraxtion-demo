import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import FORWARDER_ABI from "../../constants/ABIs/ForwarderABI.json";
import DEPOSITOR_ABI from "../../constants/ABIs/Depositer.json";

import { UserOp } from '../../../../backend/api/app';
import { Wallet, ethers } from "ethers";
import { ERC20ABI } from '@renproject/chains-ethereum/contracts';

 const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");

const getMetaTxTypedData = async (
  userOps: any,
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

  const forwarder = new ethers.Contract(
    "0xc82993eFc2B02bC4Df602D6De1cb70aC90b4DED2",
    FORWARDER_ABI,
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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("GET /transferTxTypedData");
  const chainID = parseInt(req.query.chainID!.toString());
  const sigChainID = parseInt(req.query.sigChainID!.toString());
  const tokenAddress = req.query.token!.toString();
  const to = req.query.to!.toString();
  const amount = req.query.amount!.toString();
  const from = req.query.from!.toString();
  const transactionType = req.query.transactionType!.toString();

   const signer = new Wallet(
      "e3986801b4817d188fe551eca7cc58a1ae4097f6f40136499137427c62ed9a9b",
      provider as any
    )

  const tokenContract = new ethers.Contract(
    tokenAddress,
    ERC20ABI,
    provider
  );
  const depositer = new ethers.Contract(
      "0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532",
      DEPOSITOR_ABI,
      signer
    );
 let tx2 = null;
 let tx3 = null;

 if (transactionType === "Deposit") {
   tx2 = await depositer
     .connect(signer)
     .populateTransaction.depositTokens?.(amount, from, tokenContract.address, {
       gasLimit: 2000000,
     });

   // tx3 = await tokenContract
   //   .connect(signer)
   //   .populateTransaction.transfer(
   //     "0x081B3edA60f50631E5e966ED75bf6598cF69ee3C",
   //     amount,
   //     { gasLimit: 2000000 }
   //   );
 } else if (transactionType === "Withdraw" || transactionType === "Transfer") {
   tx2 =
     transactionType === "Withdraw"
       ? await depositer
           .connect(signer)
           .populateTransaction.withdrawTokens?.(
             amount,
             to,
             from,
             tokenContract.address,
             { gasLimit: 2000000 }
           )
       : await depositer
           .connect(signer)
           .populateTransaction.withdrawTokens?.(
             amount,
             from,
             from,
             tokenContract.address,
             { gasLimit: 2000000 }
           );
 }

 const userOps: UserOp[] = [
   {
     to: depositer.address,
     amount: "0",
     data: tx2?.data!,
   },
 ];
 const typedData = await getMetaTxTypedData(userOps, sigChainID, chainID, from);
 console.log(typedData);
  res.status(200).json({ result: typedData });
}
