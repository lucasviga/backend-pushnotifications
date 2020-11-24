const fetch = require("node-fetch");

const apiURL = "http://monitor.clickip.com.br/api_jsonrpc.php";

const data = {
    "jsonrpc": "2.0",
    "method": "item.get",
    "params": {
        "output": "extend",
        "hostids": "10084",
        "sortfield": "name"
    },
    "auth": "ea698574a0ecfc0fc7917744e2cdca22",
    "id": 1
}

fetch(apiURL, {
    method: 'post',
    body: data,
    headers: { 'Content-type': 'application/json' }
  }).then(function(response){
    const result = response;
    console.log(result);
});

