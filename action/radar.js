const fs = require("fs");
const global = require('./global');
const path = require('path');
const exec = require('@actions/exec');
const core = require("@actions/core");

function getReason(id) {
  switch (id) {
    case 2001:
      return 'Key Missing';
    case 2002:
      return 'Redundant Key';
    case 2005:
      return 'Extra Key';
    case 2006:
      return 'Missing File';
    case 2007:
      return 'Redundant File';
    case 2008:
      return 'Placeholder Mismatch';
    case 2009:
      return 'Format Error';
    case 2010:
      return 'File Encoding Error';
    case 2011:
      return 'Spell Error';
    case 2015:
      return 'Json Format Error';
    case 2016:
      return 'No Translation';
  }
  return id;
}

function getComments(data) {
  if (data.errors == 0) {
    return '';
  }
  const head = global.ReportHead;
  const sep  = "| ----- | ----------- | ---- | ---- |";
  var table = head + "\n" + sep;
  data.issues.forEach(issue => {
    const reason = getReason(issue.code);
    const line = `|${issue.file}|${issue.context}|${reason}|${issue.position.startLine}|`;
    table += "\n" + line;
  });
  return table;
}

async function scan(baseDir, skipList) {
  try {
    const radar = path.join(baseDir, 'tool', 'bin', 'g11n-radar')
    const project =  process.cwd();
    const report = path.resolve(baseDir, 'report.json');
    const html_report = path.resolve(baseDir, 'report.html');
    core.debug("project: " + project);
    const skips = skipList.split(',');
    await exec.exec(radar, ['-p', project, '-d', report, 'rule', '--skip', 'bundlegen/', ...skips]);
    const data = await fs.promises.readFile(report);
    var json = JSON.parse(data);
    return {
        ok: json.errors == 0,
        reportFile: html_report,
        comments: getComments(json),
    };
  } catch (error) {
    core.setFailed(error.message);
  }
  return {
    ok: true,
  }
}

module.exports = { scan };
