// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Staking } from "../typechain-types/contracts/Deposit.sol";
import { ForwarderV2 } from "../typechain-types/contracts/DelegatedExecutorV2.sol/ForwarderV2";

async function main() {
  const [owner] = await ethers.getSigners();
  const forwarder = await ethers.getContractAt(
    "ForwarderV2",
    "0x65046EB582b300b3fe593D73aA381aE91932c25E"
  ) as ForwarderV2;
  const Staking = await ethers.getContractFactory("Staking");
  let staking = (await Staking.connect(owner).deploy(
    "0xc82993eFc2B02bC4Df602D6De1cb70aC90b4DED2"
  )) as Staking;
  await staking.deployed();

  console.log("Staking deployed to:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
