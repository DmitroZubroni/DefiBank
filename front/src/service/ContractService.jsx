// service/ContractService.js
import Web3 from 'web3';

export class ContractService {
    constructor(abi, address) {
        this.web3 = new Web3(window.ethereum);
        this.contract = new this.web3.eth.Contract(abi, address);
    }

    async depositMarket(amount, wallet) {
        return this.contract.methods.depositMarket(amount).send({ from: wallet });
    }

    async withdrawMarket(amount, wallet) {
        return this.contract.methods.withdrawMarket(amount).send({ from: wallet });
    }

    async borrow(amount, wallet) {
        return this.contract.methods.borrow(amount).send({ from: wallet });
    }

    async repay(amount, wallet) {
        return this.contract.methods.repay(amount).send({ from: wallet });
    }

    async getMarket() {
        const raw = await this.contract.methods.getMarket().call();
        return {
            title:              raw[0],
            lltv:               raw[1],
            interestRate:       raw[2],
            currentBorrowIndex: raw[3],
            collateralPrice:    raw[4],
            borrowPrice:        raw[5],
            borrowToken:        raw[6],
            asset:              raw[7],
            borrowShare:        raw[8],
        };
    }

    async getUserInfo(wallet) {
        const raw = await this.contract.methods.getUserInfo(wallet).call();
        return {
            borrowShares:     raw[0],
            collateralShares: raw[1],
            userBorrowIdx:    raw[2],
            currentDebt_:     raw[3],
            currentLtv:       raw[4],
        };
    }

    async getVault() {
        const raw = await this.contract.methods.getVault().call();
        return {
            title:         raw[0],
            shareName:     raw[1],
            managedAssets: raw[2],
            totalShares:   raw[3],
            sharePrice:    raw[4],
            asset:         raw[5],
        };
    }

    // Vault методы
    async deposit(amount, wallet) {
        return this.contract.methods.deposit(amount).send({ from: wallet });
    }

    async withdraw(amount, wallet) {
        return this.contract.methods.withdraw(amount).send({ from: wallet });
    }
}