const { raiseComment, removeComment } = require('./comment');
const { saveArtifacts } = require('./artifacts');
const { scan }  = require('./radar');
const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");

async function run() {
  const skipList = core.getInput('skip') || '';
//   const channel = core.getInput('slack-channel');
//   const slackAccessToken = core.getInput('slack-access-token');
  const githubAccessToken = core.getInput('repoToken');
  const baseDir = path.join(__dirname, '..')
  // start to scan project
  console.log(JSON.stringify(github.context))
  // test begin

  // test end
  const resp = await scan(baseDir, skipList);
  // report the result
  if (!resp.ok) {
    var result = undefined;
    // result = await sendFile(slackAccessToken, channel, resp.reportFile);
    // if (!result) {
    //   return;
    // } 
    result = await raiseComment(githubAccessToken, resp.comments);
    if (!result) {
      return;
    }
    result = await saveArtifacts(baseDir, resp.reportFile);
    if (result) {
      console.log('Contact Globalization team in https://citrix.slack.com/archives/CJKDCKS4B for more information');
      core.setFailed('g11n issues exist');
    }
  } else {
    await removeComment(githubAccessToken);
  }
}

module.exports = run;