0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Staking } from "../typechain-types/contracts/Deposit.sol";
import { ForwarderV2 } from "../typechain-types/contracts/DelegatedExecutorV2.sol/ForwarderV2";
import { ERC20__factory } from '../typechain-types/factories/@openzeppelin/contracts/token/ERC20/ERC20__factory';

async function main() {
  const [owner, one] = await ethers.getSigners();
  const tokenContract = await ERC20__factory.connect(
    "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
    owner!
  );

  const r = tokenContract.transfer(
    "0xfEE77FD6cD15525CcEe75C883f4962A633c141cA",
    ethers.utils.parseUnits("5")
  );
  const r1 = await owner.sendTransaction({
    to: "0xfEE77FD6cD15525CcEe75C883f4962A633c141cA",
    value: ethers.utils.parseUnits("0.0025")
  });
  const rec = await r1.wait(1)
  console.log(r1)
//   console.log((await r).wait(1))
  console.log(
    Number(
      await tokenContract.balanceOf(
       owner.address
      )
    )
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
