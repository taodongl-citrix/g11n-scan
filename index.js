import {uploadFile} from './slack';
import {scan} from './radar';
const core = require("@actions/core");

async function run() {
  const skipList = core.getInput('skip') || '';
  const channel = core.getInput('slack-channel');
  const accessToken = core.getInput('slack-access-token');
  console.log("channel is: " + channel);
  console.log("token is: " + accessToken);
  const resp = await scan(skipList);
  // if (!resp.ok) {
  //   await uploadFile(accessToken, channel, resp.reportFile);
  //   console.log('Contact Globalization team in https://citrix.slack.com/archives/CJKDCKS4B for more information');
  //   core.setFailed('g11n issues exist');
  // }
}

run();
