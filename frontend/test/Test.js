const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Renting5006 Tokens", function () {

  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const currentSigner = (await ethers.getSigner());
    const raw = await ethers.getContractFactory("SampleERC5006");
    const contract = await raw.deploy();

    await contract.deployed();

    // console.log(
    //   `Contract deployed at ${contract.address}`
    //   );

    return [currentSigner, contract];

  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      expect(currentSigner.address).to.equal(await contract.owner());
    });
  });

  describe("Minting", function () {

    let beforeTokenID;
    const uri = '123';
    const copies = 5;

    it("Should increment token Id", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);

      beforeTokenID = Number(await contract._tokenId());

      await contract.connect(currentSigner).mintToken(uri, copies);
      const currentTokenID = Number(await contract._tokenId());

      expect(beforeTokenID + 1).to.equal(currentTokenID);
    });

    it("Should set correct token URI and token copies", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);

      await contract.connect(currentSigner).mintToken(uri, copies);
      const _uri = await contract._uri(`${beforeTokenID}`);
      expect(_uri).to.equal(uri);
      expect(copies).to.equal(Number(await contract.connect(currentSigner).balanceOf(currentSigner.address, beforeTokenID)));
    });
  });

  describe("Marking For Rent", function () {
    let tokenId, copies, price, startTime, endTime;
    tokenId = copies = price = startTime = endTime = 0;

    it("Should reject request if renting price is not greater than zero", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies,price,startTime, endTime)).to.be.revertedWith(
        "Sample5006: Renting price should be be geater than zero"
      );
    });

    it("Should reject request if start and end time is not greater than zero", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      price=1;
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies,price,startTime, endTime)).to.be.revertedWith(
        "Sample5006: Timestamps cannot be zero"
      );
    });

    it("Should reject request if start time is greater than end time", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      startTime = 5; endTime = 2;
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies,price,startTime, endTime)).to.be.revertedWith(
        "Sample5006: Start time should be less than end time"
      );
    });

    it("Should reject request if end time is lesser than current time", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      endTime = 100;
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies,price,startTime, endTime)).to.be.revertedWith(
        "Sample5006: End time should be greater than current time"
      );
    });

    it("Should not allow lender to mark a token for rent which he/she dont have enough copies", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 1238291083120120; copies = 6;
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies,price,startTime, endTime)).to.be.revertedWith(
        "Sample5006: Lender dont have enough token copies"
      );
    });

    it("Should allow token to be marked as rent if all the arguments are valid", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60;
      
      await contract.connect(currentSigner).mintToken('my URI', '100');
      await contract.connect(currentSigner).markForRent(tokenId, copies,price,startTime, endTime);
      
      const recId = await contract.connect(currentSigner)._recId();
      const record = await contract.connect(currentSigner)._tokenRecords(recId -1);
      
      expect(Number(record.tokenId)).to.equal(tokenId);
      expect(Number(record.price)).to.equal(price);
      expect(Number(record.copies)).to.equal(copies);
      expect(Number(record.startTime)).to.equal(startTime);
      expect(Number(record.endTime)).to.equal(endTime);
      expect(record.lender).to.equal(currentSigner.address);
      expect(record.rentedTo).to.equal('0x0000000000000000000000000000000000000000');
    });

    // it("Should not allow lender to mark a token for rent which he/she dont have enough copies", async function () {
    //   const [currentSigner, contract] = await loadFixture(deployContract);
    //   await expect(lock.withdraw()).to.be.revertedWith(
    //     "You can't withdraw yet"
    //   );
    // });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
