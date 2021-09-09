const { WebClient, LogLevel } = require("@slack/web-api");
const { createReadStream } = require ("fs");
const core = require("@actions/core");
const github = require("@actions/github");
const artifact = require('@actions/artifact');

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
    return result;
  }
  catch (error) {
    core.setFailed(error);
  }
}

async function createComment(token, comment) {
  try {
    const number = github.context.payload.pull_request.number;
    const octokit = new github.getOctokit(token);
    const result = await octokit.issues.createComment({
      ...github.context.repo,
      issue_number: number,
      body: comment,
    });
    console.log(result);
  } catch (error) {
    core.setFailed(error.message);
    return false;
  }
  return true;
}

async function saveArtifacts(baseDir, reportFile) {
  const artifactClient = artifact.create();
  const resp = await artifactClient.uploadArtifact("g11n-report", [reportFile], baseDir);
  if (resp.failedItems.length > 0) {
    core.setFailed(
      `An error was encountered when uploading ${resp.artifactName}. There were ${resp.failedItems.length} items that failed to upload.`
    )
    return false;
  } else {
    core.info(
      `Artifact ${resp.artifactName} has been successfully uploaded!`
    )
  }
  return true;
}

module.exports = { uploadFile, createComment, saveArtifacts };
