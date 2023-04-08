import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PopulatedTransaction } from "ethers";
import { ethers } from "hardhat";
import { Forwarder } from "../typechain-types/contracts/DelegatedEcexutorV1.sol/Forwarder";
import { Staking } from "../typechain-types/contracts/Deposit.sol/Staking";
import { ERC20 } from "../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";
import { ForwarderV2 } from "../typechain-types/contracts/DelegatedExecutorV2.sol/ForwarderV2";
const hre = require("hardhat");
import { defaultAbiCoder } from "@ethersproject/abi";

const { expect } = require("chai");
let Staking: any;
let Wbtc: any;
let staking: Staking;
let wbtc: ERC20;
let WBTC: any;

let owner: SignerWithAddress;
let wallet1: SignerWithAddress;
let wallet2: SignerWithAddress;

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
let forwarder: ForwarderV2;

//Meta Transactions
const sign = async (
  userOps: UserOp[],
  tx: PopulatedTransaction,
  account: SignerWithAddress
) => {
  const domain = {
    name: "Executor",
    version: "0.0.1",
    chainId: hre.network.config.chainId!,
    verifyingContract: forwarder.address,
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

  const values = {
    userOps: userOps,
    nonce: 0,
    chainID: hre.network.config.chainId!,
    sigChainID: hre.network.config.chainId!,
  };

  console.log("IDDDDDDDDDDDDDDDDDDDD", hre.network.config.chainId);
  const signature = await account._signTypedData(domain, types, values);
  const sig = defaultAbiCoder.encode(
    ["uint256", "bytes"],
    [hre.network.config.chainId!, signature]
  );
  const txn = {
    userOps,
    chainID: hre.network.config.chainId!,
    signature: sig,
  };
  return {
    values,
    sig,
    txn,
  };
};

describe("Staking", function () {
  beforeEach(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners();
    console.log(owner.address, wallet1.address, wallet2.address);

    // console.log(owner.address, wallet1.address, wallet2.address);

    // deploy Forworder
    const Forwarder = await ethers.getContractFactory("ForwarderV2");
    forwarder = (await Forwarder.deploy()) as ForwarderV2;
    await forwarder.deployed();
    console.log(forwarder.address);

    const Staking = await ethers.getContractFactory("Staking", owner);
    staking = (await Staking.deploy(forwarder.address)) as Staking;
    await staking.deployed();

    const Wbtc = await ethers.getContractFactory("Wbtc", wallet1);
    wbtc = (await Wbtc.deploy()) as ERC20;
    await wbtc.deployed();

    wbtc.connect(wallet1).transfer(wallet2.address, 1000);
    // await wbtc.connect(wallet1).approve(staking.address, 100);
    // await wbtc.connect(wallet2).approve(staking.address, 100);

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

      expect(await staking.accountBalances(wallet1.address, WBTC)).to.equal(0);
      expect(await staking.accountBalances(wallet2.address, WBTC)).to.equal(
        100
      );
    });
  });

  describe("withdraw", function () {
    it("should withdraw wbtc from the contract", async function () {
    //   await wbtc.connect(wallet1).approve(staking.address, 600);
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
    //   await wbtc.connect(wallet1).approve(staking.address, 100);

      console.log(
        "balance Before",
        await staking.accountBalances(wallet1.address, WBTC)
      );
      const ALICEabcUnsignedTx = await wbtc
        .connect(wallet1)
        .populateTransaction.approve(staking.address, 100);

      const ALICEabcUnsignedTx2 = await staking
        .connect(wallet1)
        .populateTransaction.depositTokensToForwarder(
          100,
          wbtc.address,
          forwarder.address
        );

      const ALICEabcUnsignedTx3 = await wbtc
        .connect(wallet1)
        .populateTransaction.transfer(owner.address, 100);
      const userOps: UserOp[] = [
        // Pay relayer for submission.
        {
          to: wbtc.address,
          amount: "0",
          data: ALICEabcUnsignedTx.data!,
        },
        {
          to: staking.address,
          amount: "0",
          data: ALICEabcUnsignedTx2.data!,
        },

        {
          to: wbtc.address,
          amount: "0",
          data: ALICEabcUnsignedTx3.data!,
        },
      ];
      const ALICEabcSignedTx = await sign(userOps, ALICEabcUnsignedTx, wallet1);
      await forwarder.exec(
        ALICEabcSignedTx.values.userOps,
        ALICEabcSignedTx.sig,
        ALICEabcUnsignedTx.from!
      );
      console.log("balance after", Number(await wbtc.balanceOf(owner.address)));
      // const ALICEabcSignedTx2 = await sign(ALICEabcUnsignedTx2, wallet1);
      //  await forwarder.execute(ALICEabcSignedTx2.values, ALICEabcSignedTx2.sig);
      //  console.log(
      //    "balance after",
      //    Number(await wbtc.balanceOf(owner.address))
      //  );
    });
  });
});
