const Web3 = require('web3');

class SysAccount {
    constructor(privateKey, web3) {
        this.web3 = web3;
        this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    address() {
        return this.account["address"]
    }

    async estimateGas(to, ether, input, price) {
        const from = this.account["address"];
        const value = ether; // Amount in wei
          
        const transactionObject = {
            from: from,
            to: to,
            value: value,
            data: input
        };

        console.log("Transaction object", transactionObject) 
        try {
            const gasEstimate = await this.web3.eth.estimateGas(transactionObject);
            // console.log("Gas estimation", gasEstimate)
            return gasEstimate
        } catch (error) {
            return -1
        }
    }

    async sendTx(to, value, input, price) {
        console.log("Send Tx", to, value, input, price)
        // let gasLimit = await this.estimateGas(to, value, input, price)
        const txObject = {
            from: this.account["address"],
            to,
            value: value,
            nonce: this.web3.eth.getTransactionCount(this.account["address"]),
            gasPrice: price,
            gas: 183705,
            data: input,
        };
        console.log("TxObject", txObject)
        

        const signedTransaction = await this.web3.eth.accounts.signTransaction(txObject, this.account["privateKey"]);
        const serializedTransaction = signedTransaction.rawTransaction;

        // console.log('Raw Transaction:', serializedTransaction);

        try {
            const receipt = await this.web3.eth.sendSignedTransaction(serializedTransaction);
            return receipt;
        } catch (error) {
            console.error('Transaction submission error:', error);
        }        
    }
}

module.exports = { SysAccount };
