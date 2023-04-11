import { NextApiRequest, NextApiResponse } from "next";
import { Wallet, ethers } from "ethers";
import FORWARDER_ABI  from"../../constants/ABIs/ForwarderABI.json"

const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("POST /submitRelayTx");
    console.log(req.body);
    const forwardRequest = req.body["forwardRequest"];
    const signature = req.body["signature"];

    const signer = new Wallet(
      "e3986801b4817d188fe551eca7cc58a1ae4097f6f40136499137427c62ed9a9b",
      provider as any
    );

    //handle case where this mapping returns null for unsupported chainId
    const forwarder = new ethers.Contract(
      "0xc82993eFc2B02bC4Df602D6De1cb70aC90b4DED2",
      FORWARDER_ABI,
      signer
    );

     const gasPrice = await forwarder!.provider.getGasPrice();
     try {
       const gas = await forwarder!.estimateGas.exec?.(
         forwardRequest,
         signature,
         req.body["from"]
       );
       console.log("check");
       const txCost = gasPrice.mul(gas!);
       const ADMIN = signer.getAddress();
       console.log("check1");
       const isPayingRelayer =
         forwardRequest.to === ADMIN || forwardRequest.value > 0;

       if (isPayingRelayer && txCost.gt(forwardRequest.amount)) {
         res.status(402).send({ error: "Insufficient fee payment" });
         return;
       }
     } catch (err: any) {
       console.log(400);
       res.status(400).send({ error:err });
       return;
     }
     console.log("check2");
     const execTx = await forwarder.populateTransaction.exec?.(
       forwardRequest,
       signature,
       req.body["from"],
       { gasLimit: 2000000 }
     );
     console.log("check3");
     const walletTx = await signer.sendTransaction(execTx!);
     const reciept = await walletTx.wait(1);
     console.log(reciept);
    res.status(200).json({ success: true });
}
