import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PopulatedTransaction } from "ethers";
import { ethers } from "hardhat";
import { Forwarder } from '../typechain-types/contracts/DelegatedEcexutorV1.sol/Forwarder';
import { Staking } from '../typechain-types/contracts/Deposit.sol/Staking';
import { ERC20 } from '../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20';
const hre = require("hardhat")

const { expect } = require("chai");
let Staking: any;
let Wbtc: any;
let staking: Staking;
let wbtc: any;
let WBTC: any;

let owner: SignerWithAddress
let wallet1: SignerWithAddress;
let wallet2: SignerWithAddress;

 let forwarder: Forwarder

  //Meta Transactions
  const sign = async (tx: PopulatedTransaction, account: SignerWithAddress) => {
    const domain = {
      name: "CatalogForworder",
      version: "0.0.1",
      chainId: hre.network.config.chainId!,
      verifyingContract: forwarder.address,
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

    const nonce = await forwarder.getNonce(account.address);

    const values = {
      from: tx.from!,
      to: tx.to!,
      value: 0,
      gas: tx.gasLimit!,
      nonce: nonce,
      chainID: hre.network.config.chainId!,
      sigChainID: hre.network.config.chainId!,
      data: tx.data!,
    };

    const sig = await account._signTypedData(domain, types, values);
    return {
      values,
      sig,
    };
  };

describe("Staking", function () {
  beforeEach(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners();

    // console.log(owner.address, wallet1.address, wallet2.address);

    // deploy Forworder
    const Forwarder = await ethers.getContractFactory("Forwarder");
    forwarder = (await Forwarder.deploy()) as Forwarder;
    await forwarder.deployed();

    const Staking = await ethers.getContractFactory("Staking", owner);
    staking = (await Staking.deploy(forwarder.address)) as Staking;
    await staking.deployed();

    const Wbtc = await ethers.getContractFactory("Wbtc", wallet1);
    wbtc = await Wbtc.deploy();
    await wbtc.deployed();

    wbtc.connect(wallet1).transfer(wallet2.address, 1000);
    await wbtc.connect(wallet1).approve(staking.address, 100);
    await wbtc.connect(wallet2).approve(staking.address, 100);

    WBTC = ethers.utils.formatBytes32String("Wbtc");
    await staking.whitelistToken(WBTC, wbtc.address);
  });

  describe("deployment", function () {
    it("should mint tokens to wallet 1", async function () {
      expect(await wbtc.balanceOf(wallet1.address)).to.equal(4000);
    });

    it("should transfer tokens to wallet 2", async function () {
      expect(await wbtc.balanceOf(wallet2.address)).to.equal(1000);
    });

    it("should whitelist wbtc on the contract", async function () {
      expect(await staking.whitelistedTokens(WBTC)).to.equal(wbtc.address);
    });
  });

  describe("depositTokens", function () {
    it("should deposit wbtc", async function () {
      // await staking.connect(wallet1).depositTokens(100, WBTC);
      await staking.connect(wallet2).depositTokens(100, WBTC);

      expect(await wbtc.balanceOf(wallet1.address)).to.equal(4000);
      expect(await wbtc.balanceOf(wallet2.address)).to.equal(900);

      expect(await staking.accountBalances(wallet1.address, WBTC)).to.equal(
        0
      );
      expect(await staking.accountBalances(wallet2.address, WBTC)).to.equal(100);
    });
  });

  describe("withdraw", function () {
    it("should withdraw wbtc from the contract", async function () {
      await wbtc.connect(wallet1).approve(staking.address, 600);
      await staking.connect(wallet1).depositTokens(600, WBTC);
      await staking.connect(wallet1).withdrawTokens(100, WBTC);

      expect(await wbtc.balanceOf(wallet1.address)).to.equal(3500);
      expect(await staking.accountBalances(wallet1.address, WBTC)).to.equal(
        500
      );
    });

    it("should not allow withdrawing more than has been deposited", async function () {
      await expect(
        staking.connect(wallet1).withdrawTokens(10000, WBTC)
      ).to.be.revertedWith("Insufficent funds");
    });
    
  });
  describe("Forwarder", function () {
    it("should be able to deposit through frowarder", async function () {
      await wbtc
        .connect(wallet1)
        .approve(staking.address, 100);
     
      console.log(
        "balance Before",
        await staking.accountBalances(wallet1.address, WBTC)
      );  
      const ALICEabcUnsignedTx = await wbtc
        .connect(wallet1)
        .populateTransaction.approve(staking.address, 100)
      const ALICEabcSignedTx = await sign(ALICEabcUnsignedTx, wallet1);
      await forwarder.execute(ALICEabcSignedTx.values, ALICEabcSignedTx.sig);
            console.log(
              "balance after",
              Number(await wbtc.balanceOf(owner.address))
            ); 
      //  const ALICEabcUnsignedTx2 = await wbtc.populateTransaction.transfer(owner.address, 100); 
      // const ALICEabcSignedTx2 = await sign(ALICEabcUnsignedTx2, wallet1);
      //  await forwarder.execute(ALICEabcSignedTx2.values, ALICEabcSignedTx2.sig);
      //  console.log(
      //    "balance after",
      //    Number(await wbtc.balanceOf(owner.address))
      //  ); 
    });
  });
});