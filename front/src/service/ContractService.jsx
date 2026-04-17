import Web3 from "web3";

export default class ContractService {

    constructor(abi, address) {
        this.web3 = new Web3(window.ethereum);
        this.contract = new this.web3.eth.Contract(abi, address);
    }

    async depositMarket(amount, wallet) {
        return await this.contract.methods.depositMarket(amount).send({ from: wallet });
    }

    async withdrawMarket(amount, wallet) {
        return await this.contract.methods.withdrawMarket(amount).send({ from: wallet });
    }

    async borrow(amount, wallet) {
        return await this.contract.methods.borrow(amount).send({ from: wallet });
    }

    async repay(amount, wallet) {
        return await this.contract.methods.repay(amount).send({ from: wallet });
    }

    async getMarket() {
        return await this.contract.methods.getMarket().call();
    }

    async getUserInfo(user) {
        return await this.contract.methods.getUserInfo(user).call();
    }

    async depositVault(amount, wallet) {
        return await this.contract.methods.depositVault(amount).send({ from: wallet });
    }

    async withdrawVault(amount, wallet) {
        return await this.contract.methods.withdrawVault(amount).send({ from: wallet });
    }

    async getVault() {
        return await this.contract.methods.getVault().call();
    }
}