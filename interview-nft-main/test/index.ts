import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Arcade Galaxy Interview NFT", function () {
  async function nftContract() : Promise<[Contract, Iterable<SignerWithAddress>]> {
    const NFT = await ethers.getContractFactory("ArcadeGalaxyInterviewNFT");
    const nft = await NFT.deploy("ipfs://arcade-galaxy-interview/", ethers.utils.parseEther("0"));

    return [await nft.deployed(), await ethers.getSigners()];
  }

  it("check minting", async function () {
    const [nft, signers] = await nftContract();
    let [admin, joe] = signers;
    let tokenID: BigNumber = BigNumber.from(0);
    let tokenOwner = joe.address;

    let message = ethers.utils.solidityPack(["uint256", "address"], [tokenID, tokenOwner]);
    let hashedMessage= ethers.utils.keccak256(message);
    let binary = ethers.utils.arrayify(hashedMessage);
    let signature = await admin.signMessage(binary);

    let tx;
    tx = await nft.connect(joe).mint(tokenID, tokenOwner, signature);
    await tx;

    console.log(await nft.connect(joe).tokenURI(tokenID));
  });
});
