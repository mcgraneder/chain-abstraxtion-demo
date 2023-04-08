import {
  BinanceSmartChain,
  Goerli,
  Ethereum,
  Avalanche,
  Fantom,
  Polygon,
  Kava,
  Moonbeam,
} from "@renproject/chains-ethereum";

//chainIds in official ren package incorrect. correct change
//made in these ovverride configs
import { Optimism } from "./chain/OptimismOverrideConfig";
import { Arbitrum } from "./chain/ArbitrumOverrideConfig";

import { RenJS } from "@renproject/ren";
import { RenNetwork } from "@renproject/utils";
import cors from "cors";
import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { ethers, ethers as et } from 'ethers';
import { ADMIN_KEY } from "../utils/config";
import { APIError } from "./utils/APIError";
import { getEVMProvider, getEVMChain, getChain } from "./utils/getProvider";
import { EthereumBaseChain } from "@renproject/chains-ethereum/base";
import { returnContract } from "./utils/getContract";
import { ERC20__factory, Forwarder, Forwarder__factory, IERC20 } from "../typechain-types";
import { ERC20ABI } from "@renproject/chains-ethereum/contracts";
import { BigNumber as BN, BigNumberish, PopulatedTransaction } from "ethers";
import ForwarderABI from "../constants/ABIs/Forwarder.json"
import { ChainIdToChainName, forwarderDepolyments } from "../constants/deployments";

const isAddressValid = (address: string): boolean => {
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) return true;
  return false;
};

config();

const app = express();
const port = 4000;

let EthereumChain: Ethereum;
let BinanceSmartChainChain: BinanceSmartChain;
let ArbitrumChain: Arbitrum;
let AvalancheChain: Avalanche;
let PolygonChain: Polygon;
let KavaChain: Kava;
let MoonBeamChain: Moonbeam;
let OptimismChain: Optimism;
let FantomChain: Fantom;

let RenJSProvider: RenJS;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.status(200).send({ result: "ok" });
});

function parseContractError(err: any): string {
  return (
    err as {
      reason: string;
    }
  ).reason;
}

const getMetaTxTypedData = async (
  tx: PopulatedTransaction,
  sigChainID: number,
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

  const forwarder = await Forwarder__factory.connect(
    forwarderDepolyments[chainId],
    (RenJSProvider.getChain("BinanceSmartChain") as EthereumBaseChain).signer!
  );
  const nonce = nonceIn || (await forwarder.getNonce(from ? from : tx.from!));

  const values = {
    from: from ? from : tx.from!,
    to: tx.to!,
    value: 0,
    gas: tx.gasLimit! || 0,
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

function requireQueryParams(params: Array<string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const fails: string[] = [];
    for (const param of params) {
      if (!req.query[param]) {
        fails.push(param);
      }
    }
    if (fails.length > 0) {
      res.status(400).send(`${fails.join(",")} required`);
    } else {
      next();
    }
  };
}

app.get(
  "/approvalTxTypedData",
  requireQueryParams(["chainID", "sigChainID", "token", "to", "amount", "from"]),
  async (req, res) => {
    console.log("GET /transferTxTypedData");
    const chainID = parseInt(req.query.chainID!.toString());
    const sigChainID = parseInt(req.query.sigChainID!.toString());
    const tokenAddress = req.query.token!.toString();
    const to = req.query.to!.toString();
    const amount = req.query.amount!.toString();
    const from = req.query.from!.toString();
    
    const { signer } = getChain(RenJSProvider, "BinanceSmartChain", RenNetwork.Testnet)
    const tokenContract = await ERC20__factory.connect(
      tokenAddress,
      (RenJSProvider.getChain("BinanceSmartChain") as EthereumBaseChain).signer!
    );
    const transferTx = await tokenContract
      .connect(signer)
      .populateTransaction.approve(to, amount, { gasLimit: 2000000 });
    
    const typedData = await getMetaTxTypedData(transferTx, sigChainID, chainID, from);
    console.log(typedData);
    res.json({ result: typedData });
  }
);


app.post("/submitRelayTx", async (req, res) => {
  console.log("POST /submitRelayTx");
  console.log(req.body);
  const forwardRequest = req.body["forwardRequest"];
  const signature = req.body["signature"];

  //handle case where this mapping returns null for unsupported chainId
  const forwarder = await Forwarder__factory.connect(
    forwarderDepolyments[ChainIdToChainName[forwardRequest.chainID]],
    (RenJSProvider.getChain("BinanceSmartChain") as EthereumBaseChain).signer!
  );
  const { signer } = getChain(RenJSProvider, "BinanceSmartChain", RenNetwork.Testnet)
  const gasPrice = await forwarder!.provider.getGasPrice();
   try {
     const gas = await forwarder!.estimateGas.execute(
       forwardRequest,
       signature
     );
     const txCost = gasPrice.mul(gas);
     const ADMIN = signer.getAddress();
     const isPayingRelayer =
       forwardRequest.to === ADMIN || forwardRequest.value > 0;

     if (isPayingRelayer && txCost.gt(forwardRequest.amount)) {
       res.status(402).send({ error: "Insufficient fee payment" });
       return;
     }
   } catch (err: any) {
     console.log(400, parseContractError(err));
     res.status(400).send({ error: parseContractError(err) });
     return;
   }
   const execTx = await forwarder.populateTransaction.execute(
     forwardRequest,
     signature,
     { gasLimit: 2000000 }
   );
   const walletTx = await signer.sendTransaction(execTx);
   const reciept = await walletTx.wait(1);
   console.log(reciept);
  res.status(200).json({ success: true });
});


app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  err.status = err.status || 500;
  if (!(err instanceof APIError)) {
    err = new APIError((err as any).message, null, (err as any).status);
  }
  res.status(err.status).send(err.toJson());
});

app.use((req, res, next) => {
  res.status(404).send("Nothing here :)");
});

async function setup() {
  const network = RenNetwork.Testnet;

  ArbitrumChain = getEVMChain(Arbitrum, network, { privateKey: ADMIN_KEY });
  AvalancheChain = getEVMChain(Avalanche, network, { privateKey: ADMIN_KEY });
  BinanceSmartChainChain = getEVMChain(BinanceSmartChain, network, {
    privateKey: ADMIN_KEY,
  });
  FantomChain = getEVMChain(Fantom, network, { privateKey: ADMIN_KEY });
  PolygonChain = getEVMChain(Polygon, network, { privateKey: ADMIN_KEY });
  OptimismChain = getEVMChain(Optimism, network, { privateKey: ADMIN_KEY });
  MoonBeamChain = getEVMChain(Moonbeam, network, { privateKey: ADMIN_KEY });
  KavaChain = getEVMChain(Kava, network, { privateKey: ADMIN_KEY });
  EthereumChain = new Ethereum({
    network,
    defaultTestnet: "goerli",
    // ...getEVMProvider(Ethereum, network, catalogAdminKey),
    ...getEVMProvider(Goerli, network, { privateKey: ADMIN_KEY }),
  });

  RenJSProvider = new RenJS(RenNetwork.Testnet).withChains(
    ArbitrumChain,
    AvalancheChain,
    BinanceSmartChainChain,
    EthereumChain,
    FantomChain,
    PolygonChain,
    OptimismChain,
    KavaChain,
    MoonBeamChain
  );

  EthereumChain.signer
    ?.getAddress()
    .then((address: string) => {
      console.log(`Fetching ${address} balances...`);
    })
    .catch(() => {});
  [
    ArbitrumChain,
    AvalancheChain,
    BinanceSmartChainChain,
    EthereumChain,
    FantomChain,
    PolygonChain,
    OptimismChain,
    KavaChain,
    MoonBeamChain,
  ].forEach(async (chain: EthereumBaseChain) => {
    try {
      console.log(
        `${chain.chain} balance: ${ethers.utils.formatEther(
          await chain.signer!.getBalance()
        )} ${chain.network.config.nativeCurrency.symbol}`
      );
    } catch (error) {
      console.error(`Unable to fetch ${chain.chain} balance.`);
    }
  });
}

setup().then(() =>
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  })
);
