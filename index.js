import {uploadFile} from './slack';
import {scan} from './radar';
const core = require("@actions/core");
const path = require("path");

async function run() {
  const skipList = core.getInput('skip') || '';
  const channel = core.getInput('slack-channel') || 'ccccchhhh';
  const accessToken = core.getInput('slack-access-token') || 'wwwwwxxxx';
  const tool = path.join(__dirname, '..', 'tool', 'bin', 'g11n-radar')
  console.log("channel is: " + channel);
  console.log("tool is: " + tool);
  const resp = await scan(tool, skipList);
  if (!resp.ok) {
    await uploadFile(accessToken, channel, resp.reportFile);
    console.log('Contact Globalization team in https://citrix.slack.com/archives/CJKDCKS4B for more information');
    core.setFailed('g11n issues exist');
  }
}

run();
