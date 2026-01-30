/**
 * E2E Test Suite - RaylsToken
 * Run against Rayls Devnet: npx hardhat test test/RaylsToken.e2e.js --network rayls_devnet
 *
 * Covers: Deployment & Ownership, Access Control (Minting), Allowance Flow, Token Burn.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");

describe("RaylsToken E2E", function () {
  let raylsToken;
  let owner;
  let userA;
  let userB;

  const MINT_AMOUNT = ethers.utils.parseEther("1000");
  const APPROVE_AMOUNT = ethers.utils.parseEther("100");
  const BURN_AMOUNT = ethers.utils.parseEther("50");
  const GAS_FUND = ethers.utils.parseEther("0.01");

  function getAddress(s) {
    return s.address;
  }

  async function setupSigners() {
    const signers = await ethers.getSigners();
    if (signers.length >= 3) {
      return [signers[0], signers[1], signers[2]];
    }
    const ownerSigner = signers[0];
    const userAWallet = ethers.Wallet.createRandom().connect(ethers.provider);
    const userBWallet = ethers.Wallet.createRandom().connect(ethers.provider);
    await ownerSigner.sendTransaction({ to: userAWallet.address, value: GAS_FUND });
    await ownerSigner.sendTransaction({ to: userBWallet.address, value: GAS_FUND });
    return [ownerSigner, userAWallet, userBWallet];
  }

  before(async function () {
    [owner, userA, userB] = await setupSigners();
    const RaylsToken = await ethers.getContractFactory("RaylsToken");
    raylsToken = await RaylsToken.connect(owner).deploy();
    await raylsToken.deployed();
  });

  describe("1. Deployment & Ownership", function () {
    it("should deploy successfully", async function () {
      expect(raylsToken.address).to.properAddress;
    });

    it("owner() should match deployer address", async function () {
      expect(await raylsToken.owner()).to.equal(getAddress(owner));
    });
  });

  describe("2. Access Control (Minting)", function () {
    it("Owner can mint tokens to User A", async function () {
      await expect(raylsToken.connect(owner).mint(getAddress(userA), MINT_AMOUNT))
        .to.emit(raylsToken, "Transfer")
        .withArgs(ethers.constants.AddressZero, getAddress(userA), MINT_AMOUNT);
      expect(await raylsToken.balanceOf(getAddress(userA))).to.equal(MINT_AMOUNT);
    });

    it("non-owner (User B) cannot mint - transaction must revert", async function () {
      await expect(
        raylsToken.connect(userB).mint(getAddress(userB), MINT_AMOUNT)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("3. Allowance Flow (ERC20)", function () {
    it("User A approves User B to spend tokens", async function () {
      await raylsToken.connect(userA).approve(getAddress(userB), APPROVE_AMOUNT);
      expect(await raylsToken.allowance(getAddress(userA), getAddress(userB))).to.equal(
        APPROVE_AMOUNT
      );
    });

    it("User B calls transferFrom to move tokens from User A to User B", async function () {
      const balanceABefore = await raylsToken.balanceOf(getAddress(userA));
      const balanceBBefore = await raylsToken.balanceOf(getAddress(userB));
      await expect(
        raylsToken
          .connect(userB)
          .transferFrom(getAddress(userA), getAddress(userB), APPROVE_AMOUNT)
      )
        .to.emit(raylsToken, "Transfer")
        .withArgs(getAddress(userA), getAddress(userB), APPROVE_AMOUNT);
      expect(await raylsToken.balanceOf(getAddress(userA))).to.equal(
        balanceABefore.sub(APPROVE_AMOUNT)
      );
      expect(await raylsToken.balanceOf(getAddress(userB))).to.equal(
        balanceBBefore.add(APPROVE_AMOUNT)
      );
      expect(await raylsToken.allowance(getAddress(userA), getAddress(userB))).to.equal(0);
    });
  });

  describe("4. Token Destruction (Burn)", function () {
    it("User B burns tokens and totalSupply decreases by burned amount", async function () {
      const totalSupplyBefore = await raylsToken.totalSupply();
      await expect(raylsToken.connect(userB).burn(BURN_AMOUNT))
        .to.emit(raylsToken, "Transfer")
        .withArgs(getAddress(userB), ethers.constants.AddressZero, BURN_AMOUNT);
      expect(await raylsToken.totalSupply()).to.equal(totalSupplyBefore.sub(BURN_AMOUNT));
    });
  });
});
