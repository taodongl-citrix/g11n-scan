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

async function raiseComment(token, comment) {
  try {
    const number = github.context.payload.pull_request.number;
    /** @type {import('@octokit/core').Octokit} */
    const octokit = new github.getOctokit(token);
    const {viewer} = await octokit.graphql("query { viewer { login } }");
    // console.log(viewer);
    // console.log('======');
    const {data: comments} = await octokit.rest.issues.listComments({
      ...github.context.repo,
      issue_number: number,
    });
    console.log(comments);
    if (comments.length > 0) {
      const ct = comments.find(c => c.user?.login === viewer.login)
      console.log('updateComment');
      await octokit.rest.issues.updateComment({
        ...github.context.repo,
        comment_id: ct.id,
        body: comment,
      });
    } else {
      console.log('createComment');
      await octokit.rest.issues.createComment({
        ...github.context.repo,
        issue_number: number,
        body: comment,
      });
    }
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

module.exports = { uploadFile, raiseComment, saveArtifacts };
