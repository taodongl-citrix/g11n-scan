const core = require("@actions/core");
const github = require("@actions/github");
const global = require('./global');

async function removeComment(token) {
  await raiseComment(token, undefined);
}

async function raiseComment(token, comment) {
  try {
    const number = github.context.payload.pull_request.number;
    /** @type {import('@octokit/core').Octokit} */
    const octokit = new github.getOctokit(token);
    const {viewer} = await octokit.graphql("query { viewer { login } }");
    const {data: comments} = await octokit.rest.issues.listComments({
      ...github.context.repo,
      issue_number: number,
    });
    
    if (comments.length > 0) {
      const ct = comments.find(c => !!c.user && c.user.login === viewer.login && c.body.startsWith(global.ReportHead))
      await octokit.rest.issues.deleteComment({
        ...github.context.repo,
        comment_id: ct.id,
      });
    } 
    
    if (!!comment) {
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



module.exports = { raiseComment, removeComment };