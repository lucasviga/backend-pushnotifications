const axios = require('axios');

const apiURL = "http://monitor.clickip.com.br/api_jsonrpc.php";

var statusDowndetector = [];

async function loadApplications() {
  const response = await axios.post(apiURL, {
    jsonrpc: "2.0",
    method: "item.get",
    params: {
        "output": "extend",
        "hostids": "10084",
        "sortfield": "name"
    },
    auth: "ea698574a0ecfc0fc7917744e2cdca22",
    id: 1
  });

  statusDowndetector.push(response.data.result);

  const filter = statusDowndetector[0].filter(item => item.lastvalue === '3' && item.type !== '5');
  console.log(filter);

  if(filter) {
    console.log('enviar notificacao para:', filter[0].name);
  }

  if (filter.length <= 0) {
    return console.log('nenhuma aplicacao no nivel de atencao 3');
  }
}

loadApplications();

