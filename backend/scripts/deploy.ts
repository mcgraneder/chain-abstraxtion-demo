// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Forwarder } from "../typechain-types/contracts/DelegatedEcexutorV1.sol/Forwarder";

async function main() {
  const [owner] = await ethers.getSigners()
   const Forwarder = await ethers.getContractFactory("Forwarder");
   let forwarder = (await Forwarder.connect(owner).deploy()) as Forwarder;
   await forwarder.deployed();

  console.log("forwarder deployed to:", forwarder.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
