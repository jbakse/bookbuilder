#!/usr/bin/env node

var startsWith = require("lodash/startsWith");
var endsWith = require("lodash/endsWith");

var glob = require("glob");

const fs = require("fs");
const { promisify } = require("util");

const bookbuilder = require("../lib/index");

async function readFile(path) {
  const fs_readFile = promisify(fs.readFile);
  try {
    const buffer = await fs_readFile(path);
    return buffer.toString("utf8");
  } catch (err) {
    console.log(`An error occurred reading file '${src}'`);
    console.log(err);
    return false;
  }
}

async function writeFile(path, data) {
  const fs_writeFile = promisify(fs.writeFile);
  try {
    await fs_writeFile(path, data);
    return true;
  } catch (err) {
    console.log(`An error occured writing file '${dest}'`);
    console.log(err);
    return false;
  }
}

async function handleMarkdownFile(src_name, dest_name) {
  let markdown;

  // read markdown
  markdown = await readFile(src_name);
  if (!markdown) return;

  // convert to html
  const html = bookbuilder.convert(markdown);

  // write html
  await writeFile(dest_name, html);
}

// function changeBaseDirectory(file, old_base, new_base) {
//   let file_parts;
// }

async function handleMarkdownFiles(files) {
  console.log("Handling Markdown Files");

  for (const src_name of files) {
    let dest_name = replaceAtStart(
      src_name,
      config.input_directory,
      config.output_directory
    );
    dest_name = replaceAtEnd(dest_name, ".md", ".html");

    console.log(`${src_name} -> ${dest_name}`);

    // // change directory
    // let dest_parts = src.split("/");
    // dest_parts[0] = "dist";
    // let dest = dest_parts.join("/");
    // // change extension
    // dest = dest.substr(0, dest.lastIndexOf(".")) + ".html";

    // console.log(`Handling Markdown: ${src} -> ${dest}`);
    await handleMarkdownFile(src_name, dest_name);
  }
}

function replaceAtStart(s, a, b) {
  if (startsWith(s, a)) return s.replace(a, b);
  return s;
}

function replaceAtEnd(s, a, b) {
  if (endsWith(s, a)) {
    return s.slice(0, -a.length) + b;
  }
  return s;
}

async function main() {
  console.log("Hello, Bookbuilder!!!");

  glob(`${config.input_directory}/**/*.md`, (err, files) => {
    if (err) {
      console.log(
        `An error occured mataching files '${input_directory}/**/*.md'`
      );
      return;
    }
    handleMarkdownFiles(files);
  });
}

const config = {
  input_directory: "content",
  output_directory: "dist",
};

main();
