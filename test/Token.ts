// There is a fixed total supply of tokens that can't be changed.
// The entire supply is assigned to the address that deploys the contract.
// Anyone can receive tokens.
// Anyone with at least one token can transfer tokens.
// The token is non-divisible. You can transfer 1, 2, 3 or 37 tokens but not 2.5.

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Token } from "../typechain";


describe("Token Contract", function() {
	let Token;
	let hardhatToken: Token;
	let owner: SignerWithAddress;
	let addr1: SignerWithAddress;
	let addr2: SignerWithAddress;
	let addrs: SignerWithAddress[];

	this.beforeEach(async function () {
		Token = await ethers.getContractFactory("Token");
		[owner, addr1, addr2, ...addrs]	= await ethers.getSigners();
		hardhatToken = (await Token.deploy()) as Token;
	});

	describe("Deployment", function() {

		it("Should set the right owner", async function() {
			expect(await hardhatToken.owner()).to.equal(owner.address);
		});

		it("Should assign the total supply of tokens to the owner", async function() {
			const ownerBalance = await hardhatToken.balanceOf(owner.address);

			expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
		});
	});

	describe("Transactions", function() {

		it("Should transfer tokens between accounts", async function() {
			const amountToTransfer = 50;
			await hardhatToken.transfer(addr1.address, amountToTransfer);
			const addr1Balance = await hardhatToken.balanceOf(addr1.address);

			expect(addr1Balance).to.equal(amountToTransfer);
		});

		it("Should fail if sender doesn't have enough tokens", async function() {
			const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

			await expect(
				hardhatToken.connect(addr1).transfer(owner.address, 1)
			).to.be.revertedWith("Not enough tokens");

			expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
		});

		it("Should update balances after transfers", async function() {
			const firstAmountToTransfer = 100;
			const secondAmountToTransfer = 50;
			const initialOwnerBalance = await hardhatToken.balanceOf(owner.address) as any;
			await hardhatToken.transfer(addr1.address, firstAmountToTransfer);
			await hardhatToken.transfer(addr2.address, secondAmountToTransfer);
			const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);

			expect(finalOwnerBalance)
				.to.equal(initialOwnerBalance - (firstAmountToTransfer + secondAmountToTransfer));
			expect(await hardhatToken.balanceOf(addr1.address)).to.equal(firstAmountToTransfer);
			expect(await hardhatToken.balanceOf(addr2.address)).to.equal(secondAmountToTransfer);
		});
	});
});
