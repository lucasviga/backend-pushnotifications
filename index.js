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
    const getAppName = filter[0].name;
    const fullAppName = getAppName.split(' ');
    var appName = fullAppName[1] ? getAppName.substr(getAppName.indexOf(' ') + 1) : '';

    async function sendNotification(data) {
      const response = await axios.post(
        'https://onesignal.com/api/v1/notifications',
        data, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Basic OWQ0NDM3N2MtOWJjMS00NzAxLTliZDItMDE5M2MwMWE4YjEz',
          },
        },
      );

      console.log('** >> **', response.data);
    }

    var message = {
      app_id: '0760b424-f6cd-4a7b-acc1-5ac06a997b9c',
      contents: {'en': `Hmmm... No mmomento aplicacao ${appName} está passando por instabilidades. Saiba mais em: downdetector.com.br`},
      included_segments: ['All'],
    };

    sendNotification(message);

    console.log('enviar notificacao para:', appName);
  }

  if (filter.length <= 0) {
    return console.log('nenhuma aplicacao no nivel de atencao 3');
  }
}

loadApplications();

