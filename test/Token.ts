// There is a fixed total supply of tokens that can't be changed.
// The entire supply is assigned to the address that deploys the contract.
// Anyone can receive tokens.
// Anyone with at least one token can transfer tokens.
// The token is non-divisible. You can transfer 1, 2, 3 or 37 tokens but not 2.5.

import { expect } from "chai";
import { ethers } from "hardhat";
import { Token } from "../typechain";


describe("Token contract", function() {
	it("Deployment should assign the total supply of tokens to the owner", async () => {
		const [owner] = await ethers.getSigners();
		const Token = await ethers.getContractFactory("Token");
		const hardhatToken = (await Token.deploy()) as Token;

		const ownerBalance = await hardhatToken.balanceOf(owner.address);

		expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
	});
});

describe("Transactions", () => {
	it("Should transfer tokens between accounts", async () => {
		const [_, addr1, addr2] = await ethers.getSigners();
		const Token = await ethers.getContractFactory("Token");
		const hardhatToken = await Token.deploy();

		await hardhatToken.transfer(addr1.address, 50);
		expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

		await hardhatToken.connect(addr1).transfer(addr2.address, 50);
		expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
	});
});
