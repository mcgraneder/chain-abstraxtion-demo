import { Wallet, ethers } from "ethers";
import { ERC20ABI } from '@renproject/chains-ethereum/contracts';
import DEPOSITOR_ABI  from"../constants/ABIs/Depositer.json"
import FORWARDER_ABI  from"../constants/ABIs/ForwarderABI.json"
import { UserOp } from "../../../backend/api/app";


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

export async function getSwapTypedData(chainID: number, sigChainID: number, tokenAddress: string, amount: string, from: string) {
         
    const signer = new Wallet(
      "e3986801b4817d188fe551eca7cc58a1ae4097f6f40136499137427c62ed9a9b",
      provider as any
    )
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20ABI,
      signer
    );
    const depositer = new ethers.Contract(
      "0x678Ae5BFfFAb5320F33673149228Ed3F8a02D532",
      DEPOSITOR_ABI,
      signer
    );
    const tx1 = await depositer?.connect(signer)
      .populateTransaction.depositTokensToForwarder?.(
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
      .populateTransaction.approve?.(
        "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
        amount
      );

    const userOps = [
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
    return typedData
}

export async function walletTypedData(
    chainID: number,
    sigChainID: number,
    tokenAddress: string,
    to: string,
    amount: string,
    from: string,
    transactionType: string
) {
  const signer = new Wallet(
    "e3986801b4817d188fe551eca7cc58a1ae4097f6f40136499137427c62ed9a9b",
    provider as any
  );

  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
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
      .populateTransaction.depositTokens?.(
        amount,
        from,
        tokenContract.address,
        {
          gasLimit: 2000000,
        }
      );
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
  const typedData = await getMetaTxTypedData(
    userOps,
    sigChainID,
    chainID,
    from
  );
 return typedData
}


export default async function SubmitRelayTx(forwardRequest: UserOp[], signature: string, from: string, forwarderAddress: string) {

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
        from
      );
      console.log("check");
      const txCost = gasPrice.mul(gas!);
      const ADMIN = signer.getAddress();
      console.log("check1");
    //   const isPayingRelayer =
    //     forwardRequest[0]?.to! === ADMIN || Number(forwardRequest[0]?.amount!) > 0;

    //   if (isPayingRelayer && txCost.gt(forwardRequest[0].amount)) {
    //    throw new Error("error")
    //   }
    } catch (err: any) {
      return;
    }
    // console.log("check2");
    const execTx = await forwarder.populateTransaction.exec?.(
      forwardRequest,
      signature,
      from,
      { gasLimit: 2000000 }
    );
    console.log("check3");
    const walletTx = await signer.sendTransaction(execTx!);
    const reciept = await walletTx.wait(1);
    return reciept
}

