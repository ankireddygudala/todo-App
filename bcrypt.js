// 'use-strict';

var Web3 = require('web3');
var web3 = new Web3();

web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/NAUugrNXeVhCS0ClcwmA"));
console.log(web3.currentProvider);
web3.personal.listAccounts(function (err, res) {
    console.log(err);
});