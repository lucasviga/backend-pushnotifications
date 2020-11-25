const axios = require('axios');

const apiURL = "http://monitor.clickip.com.br/api_jsonrpc.php";

var statusDowndetector = [];

async function loadApplications() {

  /**
   * Every minute it is make a new request for
   * check if some applications in status 3
   */

  setInterval(async () => {
    var date = new Date();
    if ( date.getSeconds() === 0 ) {
      const response = await axios.post(apiURL, {
        jsonrpc: "2.0",
        method: "item.get",
        params: {
            "output": "extend",
            "hostids": "10084",
            "sortfield": "name"
        },
        auth: `${process.env.ZABBIX_AUTHORIZATION}`,
        id: 1
      });

      statusDowndetector.push(response.data.result);

      const filter = statusDowndetector[0].filter(item => item.lastvalue === '3' && item.type !== '5');

      console.log('uma nova requisicao', filter.length);
    }
  }, 1000);

  if(filter) {
    for(x in filter) {
      const getAppName = filter[x].name;
      const fullAppName = getAppName.split(' ');
      var appName = fullAppName[1] ? getAppName.substr(getAppName.indexOf(' ') + 1) : '';

      async function sendNotification(data) {
        const response = await axios.post(
          'https://onesignal.com/api/v1/notifications',
          data, {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Authorization': `Basic ${process.env.ONESIGNAL_AUTHORIZATION}`,
            },
          },
        );
      }

      var message = {
        app_id: process.env.ONESIGNAL_APP_ID,
        contents: {'en': `Hmmm... Possíveis problemas estão ocorrendo em ${appName}. Saiba mais em: downdetector.com.br`},
        included_segments: ['All'],
      };

      sendNotification(message);
    }
  }

  if (filter.length <= 0) {
    return console.log('nenhuma aplicacao no nivel de atencao 3');
  }
}

loadApplications();

