#!/usr/bin/env node

var glob = require("glob");

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

async function handleMarkdownFile(src, dest) {
  let source_markdown;

  try {
    source_markdown = await readFile(src);
  } catch (err) {
    console.log(`An error occurred reading file '${src}'`);
    console.log(err);
    return;
  }

  const html = bookbuilder.convert(source_markdown);

  try {
    await writeFile(dest, html);
  } catch (err) {
    console.log(`An error occured writing file '${dest}'`);
    console.log(err);
  }
}

async function handleMarkdownFiles(err, srcs) {
  for (const src of srcs) {
    let dest = src;
    // change directory
    let dest_parts = dest.split("/");
    dest_parts[0] = "dist";
    dest = dest_parts.join("/");
    // change extension
    dest = dest.substr(0, dest.lastIndexOf(".")) + ".html";

    console.log(`Handling Markdown: ${src} -> ${dest}`);
    await handleMarkdownFile(src, dest);
  }
}

async function main() {
  console.log("Hello, Bookbuilder!!!");

  // const source_path = "./content/index.md";
  // const dest_path = "./dist/index.html";
  // let source_markdown;

  glob("content/**/*.md", false, handleMarkdownFiles);
}

main();
