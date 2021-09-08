const https = require("https");
const fs = require("fs");
const FormData = require("form-data");

const getOptions = (token, path) => {
  return {
    hostname: "slack.com",
    port: 443,
    path: path,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
};

const post = (token, path, payload) => {
  return new Promise((resolve, reject) => {
    const options = getOptions(token, path);
    const req = https.request(options, (res) => {
      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const result = Buffer.concat(chunks).toString();
        const response = JSON.parse(result);

        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          ok: res.statusCode >= 200 && res.statusCode <= 299,
          result: result,
          response: response,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });
    req.write(payload);
    req.end();
  });
};

const uploadFile = async (token, channel, filename) => {
  const path = "/api/files.upload";
  const form = new FormData();
  form.append('channels', channel);
  form.append('file', fs.createReadStream(filename));
  form.append('filename', 'report.html');
  form.append('filetype', 'html');
  form.append('initial_comment', 'Please see the attachment');
  const result = await post(token, path, form.getBuffer());

  if (!result || !result.ok) {
    throw `Error! ${JSON.stringify(response)}`;
  }

  return result;
}
module.exports = { uploadFile };
