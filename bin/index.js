#!/usr/bin/env node

const config = {
  input_directory: "content",
  output_directory: "dist",
};

const glob = require("glob");
const { handleMarkdownFile } = require("../lib/markdown");
const { replaceAtStart, replaceAtEnd } = require("../lib/util");

async function main() {
  console.log("Hello, Bookbuilder!!!!");

  glob(`${config.input_directory}/**/*.md`, (err, paths) => {
    if (err) {
      console.log(`An error occured mataching files '${config.input_directory}/**/*.md'`);
      return;
    }
    handleMarkdownFiles(paths);
  });
}

async function handleMarkdownFiles(paths) {
  console.log("Handling Markdown Files");

  for (const src_path of paths) {
    let dest_path = replaceAtStart(src_path, config.input_directory, config.output_directory);
    dest_path = replaceAtEnd(dest_path, ".md", ".html");

    console.log(`${src_path} -> ${dest_path}`);

    await handleMarkdownFile(src_path, dest_path);
  }
}

main();
