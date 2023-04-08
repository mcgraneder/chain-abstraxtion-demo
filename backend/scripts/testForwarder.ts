

 // We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { ethers as et } from "ethers";
import { Forwarder } from "../typechain-types/contracts/DelegatedEcexutorV1.sol/Forwarder";
import { ERC20ABI } from '@renproject/chains-ethereum/contracts';
import { BigNumberish, Contract, PopulatedTransaction } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Forwarder__factory } from '../typechain-types/factories/contracts/DelegatedEcexutorV1.sol/Forwarder__factory';
import { get } from "http";
import { getChain, getEVMChain, getEVMProvider } from '../api/utils/getProvider';
import { Arbitrum, Ethereum } from "@renproject/chains-ethereum";
import { ADMIN_KEY } from '../utils/config';
import {
  BinanceSmartChain,
  Goerli,
  Avalanche,
  Fantom,
  Polygon,
  Kava,
  Moonbeam,
} from "@renproject/chains-ethereum";
import RenJS from "@renproject/ren";
import { RenNetwork } from "@renproject/utils";
  //Meta Transactions
let RenJSProvider: RenJS
const getMetaTxTypedData = async (
  tx: PopulatedTransaction,
  sigChainID: number,
  chainId: number,
  from: SignerWithAddress,
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

  const { signer } = getChain(
    RenJSProvider,
    "BinanceSmartChain",
    RenNetwork.Testnet
  );
  const forwarder = await Forwarder__factory.connect(
    "0x6bB441DA26a349a706B1af6C8C4835B802cDe7d8",
    (RenJSProvider.getChain("BinanceSmartChain")).signer!
  );
  const nonce = nonceIn || (await forwarder.getNonce(from.address ? from.address : tx.from!));

  const values = {
    from: from.address ? from.address : tx.from!,
    to: tx.to!,
    value: 0,
    gas: tx.gasLimit! || 0,
    nonce: nonce.toString(),
    chainID: chainId,
    sigChainID: sigChainID,
    data: tx.data!,
  };

  console.log(values)

  const sig = await from._signTypedData(domain, types, values);
  return {
    values,
    sig,
  };
};
async function main() {
  const [owner, wallet1] = await ethers.getSigners()

   const ArbitrumChain = getEVMChain(Arbitrum, RenNetwork.Testnet, { privateKey: ADMIN_KEY });
   const AvalancheChain = getEVMChain(Avalanche, RenNetwork.Testnet, { privateKey: ADMIN_KEY });
   const BinanceSmartChainChain = getEVMChain(BinanceSmartChain, RenNetwork.Testnet, {
     privateKey: ADMIN_KEY,
   });
   const FantomChain = getEVMChain(Fantom, RenNetwork.Testnet, { privateKey: ADMIN_KEY });
   const PolygonChain = getEVMChain(Polygon, RenNetwork.Testnet, { privateKey: ADMIN_KEY });
//    const OptimismChain = getEVMChain(Optimism, RenNetwork.Testnet, { privateKey: ADMIN_KEY });
   const MoonBeamChain = getEVMChain(Moonbeam, RenNetwork.Testnet, { privateKey: ADMIN_KEY });
   const KavaChain = getEVMChain(Kava, RenNetwork.Testnet, { privateKey: ADMIN_KEY });
   const EthereumChain = new Ethereum({
     network: RenNetwork.Testnet,
     defaultTestnet: "goerli",
     // ...getEVMProvider(Ethereum, RenNetwork.Testnet, catalogAdminKey),
     ...getEVMProvider(Goerli, RenNetwork.Testnet, { privateKey: ADMIN_KEY }),
   });

   RenJSProvider = new RenJS(RenNetwork.Testnet).withChains(
     ArbitrumChain,
     AvalancheChain,
     BinanceSmartChainChain,
     EthereumChain,
     FantomChain,
     PolygonChain,
     KavaChain,
     MoonBeamChain
   );

   const p = new ethers.providers.JsonRpcProvider(
     "https://data-seed-prebsc-1-s1.binance.org:8545/"
   );

  const BUSD = new et.Contract(
    "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
    ERC20ABI,
    p
    
  );
  
  console.log(owner.address)

  const forwarder = await Forwarder__factory.connect(
    "0x6bB441DA26a349a706B1af6C8C4835B802cDe7d8",
    RenJSProvider.getChain("BinanceSmartChain").signer!
  );
  
  console.log(await BUSD.connect(p.getSigner(wallet1.address)).allowance(wallet1.address, owner.address))
  const ALICEabcUnsignedTx = await BUSD.connect(p.getSigner(wallet1.address)).populateTransaction.approve(owner.address, 100);
  const ALICEabcSignedTx = await getMetaTxTypedData(ALICEabcUnsignedTx, 97, 97, wallet1);
  const tx = await forwarder.connect(owner).populateTransaction.execute(ALICEabcSignedTx.values, ALICEabcSignedTx.sig);

  const walletTx = await owner.sendTransaction(tx);
  const r = await walletTx.wait(1);
 
  console.log(r)
  console.log("balance after", Number(await BUSD.balanceOf(owner.address))); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});