const core = require("@actions/core");
const artifact = require('@actions/artifact');

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

module.exports = { saveArtifacts };