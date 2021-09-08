import {uploadFile} from './slack';
import {scan} from './radar';
const core = require("@actions/core");
const path = require("path");

async function run() {
  const skipList = core.getInput('skip') || '';
  const channel = core.getInput('slack-channel');
  const accessToken = core.getInput('slack-access-token');
  const baseDir = path.join(__dirname, '..')
  console.log("channel is: " + channel);
  const resp = await scan(baseDir, skipList);
  if (!resp.ok) {
    await uploadFile(accessToken, channel, resp.reportFile);
    console.log('Contact Globalization team in https://citrix.slack.com/archives/CJKDCKS4B for more information');
    core.setFailed('g11n issues exist');
  }
}

run();
