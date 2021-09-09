const { WebClient, LogLevel } = require("@slack/web-api");
const { createReadStream } = require ("fs");
const core = require("@actions/core");
const github = require("@actions/github");

async function uploadFile(token, channel, report) {
  const client = new WebClient(token, {
    logLevel: LogLevel.INFO
  });
  const number = github.context.payload.pull_request.number;
  const projectUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/pull/${number}`
  try {
    const result = await client.files.upload({
        channels: channel,
        initial_comment: `PR: ${projectUrl} check failure, \nPlease see attachment`,
        filetype: 'html',
        filename: 'report.html',
        file: createReadStream(report)
    });
    console.log(result);
  }
  catch (error) {
    core.setFailed(error);
  }
}

module.exports = { uploadFile };
