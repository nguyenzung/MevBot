const mev = require("./filterhandler");
const en = require('./encoder')
const acc = require('./account')

const Web3 = require('web3');
const cron = require('node-cron');

require('dotenv').config()
// console.log(process.env)

// Connect to a blockchain node
const THRESHOLD_AMOUNT = 1000000000000
const INJECT_AMOUNT = 1000000
const TOKEN_ADDRESS = "aecbf32347d8d107ff516051242550bde5dc9225"
const PRIVATE_KEY = process.env.PRIVATE_KEY
const SWAP_CONTRACT_ADDRESS = "0x9a489505a00cE272eAa5e07Dba6491314CaE3796"
const WS_RPC = process.env.WS_RPC

const web3 = new Web3(WS_RPC);

let sysAccount = new acc.SysAccount(PRIVATE_KEY, web3);

let filter = new mev.FilterHandler(SWAP_CONTRACT_ADDRESS, TOKEN_ADDRESS, THRESHOLD_AMOUNT);
filter.addFunc("5ae401dc");

let amountIn = web3.utils.toHex(INJECT_AMOUNT)
amountIn = amountIn.replace('x', '0')
let receiver = sysAccount.address()
receiver = receiver.replace('x', '0')

let subscription = web3.eth.subscribe('pendingTransactions', function(error, result) {})

subscription.on("data", function(tx) {
    web3.eth.getTransaction(tx, function(err, transaction) {
        if (err == null && transaction["to"] == SWAP_CONTRACT_ADDRESS) {
            console.log(" ------> New tx for buying token")
            let gasPrice = filter.isRelatedTx(transaction)
            if (gasPrice > 0) {
                console.log(" Doing injecting", gasPrice)
                
                let input = en.encodeBuyTokenABIData(amountIn, 6, TOKEN_ADDRESS, receiver)
                console.log("Input: ", input)
                sysAccount.sendTx(SWAP_CONTRACT_ADDRESS, INJECT_AMOUNT, input, gasPrice + 1).then((result, err) =>{
                    console.log(" Tx status ", result["status"], err)
                })
            }
            console.log(" ------ Done ------")
        }
    });
});
