#!/usr/bin/env node

// var glob = require("glob");

const fs = require("fs");
const { promisify } = require("util");

const bookbuilder = require("../lib/index");

async function readFile(path) {
  const fs_readFile = promisify(fs.readFile);
  const buffer = await fs_readFile(path);
  return buffer.toString("utf8");
}

async function writeFile(path, data) {
  const fs_writeFile = promisify(fs.writeFile);
  await fs_writeFile(path, data);
}

async function main() {
  console.log("Hello, Bookbuilder!!");

  const source_path = "./content/index.md";
  const dest_path = "./dist/index.html";
  let source_markdown;

  try {
    source_markdown = await readFile(source_path);
  } catch (err) {
    console.log(`An error occurred reading file '${source_path}'`);
    console.log(err);
    return;
  }

  const html = bookbuilder.convert(source_markdown);

  try {
    await writeFile(dest_path, html);
  } catch (err) {
    console.log(`An error occured writing file '${dest_path}'`);
    console.log(err);
  }
}

main();
