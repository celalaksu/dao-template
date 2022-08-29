import * as fs from "fs";
import {
  developmentChains,
  proposalsFile,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import { network } from "hardhat";
//@ts-ignore
import { ethers } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";
const index = 0;

async function main(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];
  // 0 = Against, 1 = for, 2 = abstain-this cost gas
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "I like a do flan filan";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait();
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voted! Ready to go!...");
}
main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
