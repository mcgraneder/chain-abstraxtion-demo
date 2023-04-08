// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { ForwarderV2 } from "../typechain-types/contracts/DelegatedExecutorV2.sol/ForwarderV2";

async function main() {
  const [owner] = await ethers.getSigners();
  const Forwarder = await ethers.getContractFactory("ForwarderV2");
  let forwarder = (await Forwarder.connect(owner).deploy()) as ForwarderV2;
  await forwarder.deployed();

  console.log("forwarder deployed to:", forwarder.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
