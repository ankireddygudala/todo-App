var {SHA256} = require('crypto-js');

var pwd = "gudala772" ;

var hash = SHA256(pwd).toString();
console.log('Password  :',pwd);
console.log('Hash code :',hash);

var data = {
    id:1,
    name:'anki'
}
token = {
    data,
    hash: SHA256(JSON.stringify(data)).toString()
}


var resHash = SHA256(JSON.stringify(token.data)).toString();

console.log('Result hash: ',resHash);
console.log('hash: ',token.hash);

if(resHash === token.hash){
    console.log("Data changed!");
}
else {
    console.log('Not changed!');
}