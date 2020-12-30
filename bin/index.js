#!/usr/bin/env node

var x;

let fs = require("fs");
const { promisify } = require("util");

const bookbuilder = require("../lib/index");

async function readFile(path) {
  let fs_readFile = promisify(fs.readFile);
  let buffer = await fs_readFile(path);
  return buffer.toString("utf8");
}

async function writeFile(path, data) {
  let fs_writeFile = promisify(fs.writeFile);
  await fs_writeFile(path, data);
}

async function main() {
  console.log("Hello, Bookbuilder!!");

  let source_path = "./src/index.md";
  let dest_path = "./dist/index.html";
  let source_markdown;

  try {
    source_markdown = await readFile(source_path);
  } catch (err) {
    console.log(`An error occurred reading file '${source_path}'`);
    console.log(err);
    return;
  }

  let html = bookbuilder.convert(source_markdown);

  try {
    await writeFile(dest_path, html);
  } catch (err) {
    console.log(`An error occured writing file '${dest_path}'`);
    console.log(err);
    return;
  }
}

main();
