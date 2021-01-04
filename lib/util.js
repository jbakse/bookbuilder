const fs = require("fs");
const { execSync } = require("child_process");
const { promisify } = require("util");

const startsWith = require("lodash/startsWith");
const endsWith = require("lodash/endsWith");

exports.async_readFile = async (path) => {
  const fs_readFile = promisify(fs.readFile);
  try {
    const buffer = await fs_readFile(path);
    return buffer.toString("utf8");
  } catch (err) {
    console.log(`An error occurred reading file '${path}'`);
    console.log(err);
    return false;
  }
};

exports.async_writeFile = async (path, data) => {
  const fs_writeFile = promisify(fs.writeFile);
  try {
    await fs_writeFile(path, data);
    return true;
  } catch (err) {
    console.log(`An error occured writing file '${path}'`);
    console.log(err);
    return false;
  }
};

exports.execute_command = (command) => {
  execSync(command, (error, stdout, stderr) => {
    if (error) console.log(`error executing command: ${command} \n ${error.message}`);
    if (stderr) console.error(stderr);
    console.log(stdout);
  });
};

exports.replaceAtStart = (s, a, b) => {
  if (startsWith(s, a)) return s.replace(a, b);
  return s;
};

exports.replaceAtEnd = (s, a, b) => {
  if (endsWith(s, a)) {
    return s.slice(0, -a.length) + b;
  }
  return s;
};
