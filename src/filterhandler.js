class FilterHandler {

    constructor(contractAddress, tokenAddress, threshold) {
        this.contractAddress = contractAddress
        this.tokenAddress = tokenAddress
        this.threshold = threshold
        this.monitorList = new Set()
    }

    addFunc(funcId) {
        this.monitorList.add(funcId)
    }

    parseFuncId(input) {
        if (input.length >= 10)
            return input.slice(2,10)
    }

    isValidContractAddress(transaction) {
        return this.contractAddress == transaction["to"]
    }

    isValidTokenAddress(transaction) {
        let input = transaction["input"]
        let tokenAddress = input.slice(746, 786)
        console.log("Is valid token ", this.tokenAddress, tokenAddress)
        return this.tokenAddress === tokenAddress
    }

    isValidFuncId(transaction) {
        let funcId = this.parseFuncId(transaction["input"])
        return this.monitorList.has(funcId)
    }

    isSatifiedAmount(transaction) {
        console.log("Amount and threshold", this.threshold, transaction["value"], parseInt(transaction["value"]) >= this.threshold)
        return parseInt(transaction["value"]) >= this.threshold
    }

    isRelatedTx(transaction) {
        if (this.isValidContractAddress(transaction) && this.isValidFuncId(transaction) && this.isSatifiedAmount(transaction) && this.isValidTokenAddress(transaction))
            return transaction["gasPrice"]
        else 
            return -1
    }
}

module.exports = { FilterHandler };