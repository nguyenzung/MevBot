const utils = require('./utils')

function encodeBuyTokenABIData(amount, expire, tokenAddress, receiveAddress) {
    let methodId = "5ae401dc" // kaccek256(multicall(uint256,bytes[]))
    let expireTime = utils.padData((utils.getTimestampInSeconds() + expire).toString(16))
    let firstBuffer = "0000000000000000000000000000000000000000000000000000000000000040"
    let secondBuffer = "0000000000000000000000000000000000000000000000000000000000000001"
    let thirdBuffer = "0000000000000000000000000000000000000000000000000000000000000020"
    let fourthBuffer = "00000000000000000000000000000000000000000000000000000000000000"
    let funcId = "e4472b43f3";  // swapExacTokenForToken
    let amountIn = utils.padData(amount);
    let amountOutMin = utils.padData("1");
    let path = utils.padData("80")
    recieveAddress = utils.padData(receiveAddress)
    let fifthBuffer = "0000000000000000000000000000000000000000000000000000000000000002"

    let wbnb = utils.padData("ae13d989dac2f0debff460ac112a837c89baa7cd")
    tokenAddress = utils.padData(tokenAddress)
    let finalBuffer = "00000000000000000000000000000000000000000000000000000000"

    let input = `0x${methodId}${expireTime}${firstBuffer}${secondBuffer}${thirdBuffer}${fourthBuffer}${funcId}${amountIn}${amountOutMin}${path}${recieveAddress}${fifthBuffer}${wbnb}${tokenAddress}${finalBuffer}`

    // console.log("encodeBuyTokenABIData expireTime", expireTime)
    // console.log("encodeBuyTokenABIData amountIn", amountIn)
    // console.log("encodeBuyTokenABIData amountOutMin", amountOutMin)
    // console.log("encodeBuyTokenABIData recieveAddress", recieveAddress)
    // console.log("Input:", input)
    return input
}

module.exports = { encodeBuyTokenABIData }

