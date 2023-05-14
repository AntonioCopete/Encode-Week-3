import { ethers } from "hardhat";
import { MyERC20Votes__factory } from "../typechain-types/factories/contracts/MyERC20Votes.sol/MyERC20Votes__factory";

const MINT_VALUE = ethers.utils.parseUnits("10");

async function main() {
  const [deployer, acc1, acc2] = await ethers.getSigners();
  const contractFactory = new MyERC20Votes__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployTxReceipt = await contract.deployTransaction.wait();
  console.log(
    `The contract was deployed at address ${contract.address} at the block ${deployTxReceipt.blockNumber} \n`
  );

  const mintTx = await contract.mint(acc1.address, MINT_VALUE);
  const mintTxReceipt = await mintTx.wait();

  console.log(
    `Minted ${ethers.utils.formatUnits(MINT_VALUE)} token to the address ${
      acc1.address
    } at block ${mintTxReceipt.blockNumber}`
  );

  const balanceBN = await contract.balanceOf(acc1.address);

  console.log(
    `Account ${acc1.address} has ${ethers.utils.formatUnits(
      balanceBN
    )} My Tokens \n`
  );
  const votes = await contract.getVotes(acc1.address);
  console.log(
    `Account ${acc1.address} has ${ethers.utils.formatUnits(
      votes
    )} voting powers before delegate \n`
  );

  const delegateTx = await contract.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();

  const votesAfter = await contract.getVotes(acc1.address);
  console.log(
    `Account ${acc1.address} has ${ethers.utils.formatUnits(
      votesAfter
    )} voting powers after delegate \n`
  );
  const lastBlock = await ethers.provider.getBlock("latest");
  console.log(`Current block is ${lastBlock.number} \n`);

  let pastVotes = await contract.getPastVotes(
    acc1.address,
    lastBlock.number - 1
  );

  console.log(
    `Account ${acc2.address} has ${ethers.utils.formatUnits(
      pastVotes
    )} units of voting power at block ${lastBlock.number - 1} \n`
  );

  pastVotes = await contract.getPastVotes(acc1.address, lastBlock.number - 2);
  console.log(
    `Account ${acc2.address} has ${ethers.utils.formatUnits(
      pastVotes
    )} units of voting power at block ${lastBlock.number - 2} \n`
  );

  pastVotes = await contract.getPastVotes(acc1.address, lastBlock.number - 3);
  console.log(
    `Account ${acc2.address} has ${ethers.utils.formatUnits(
      pastVotes
    )} units of voting power at block ${lastBlock.number - 3} \n`
  );
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
