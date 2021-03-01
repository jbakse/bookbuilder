const fs = require("fs");
const { execSync } = require("child_process");
const { promisify } = require("util");

const startsWith = require("lodash/startsWith");
const endsWith = require("lodash/endsWith");

/*
 * readFileWithIncludes() returns file as string, with all includes replaced with path strings
 * @@include(path) becomes the data included in that path as a string.
 *
 * Uses fs.readFileSync() to get the file_string
 */
exports.readFileWithIncludes = (path) => {
  const path_parts = path.split("/");

  // This pop and push removes the directory (usually "content/") from the path
  // And recombines them into a single string that leads to the file's path.
  // The include.md will then follow from the inside of content/ as the root
  path_parts.pop();
  path_parts.push("");
  const path_dir = path_parts.join("/");

  let file_string = fs.readFileSync(path, { encoding: "utf8" });

  // Recursive replacement of all subsequently found @@include() lines with
  // the include paths, so @@include(include.md) -> include.md
  file_string = file_string.replace(/^@@include\((.+?)\)$/gm, (match, p1) => {
    const include_path = path_dir + p1;
    return exports.readFileWithIncludes(include_path);
  });
  return file_string;
};

/*
 * asyn_readFile returns the data in the path as a string.
 */
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
  const result = execSync(command).toString();
  if (result) console.log(result);
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
