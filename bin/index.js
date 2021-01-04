#!/usr/bin/env node

const settings = {
  input_directory: "content",
  output_directory: "../compformnet/dist",
  public_directory: "public",
};

const path = require("path");

const glob = require("glob");

const { handleMarkdownFile } = require("../lib/markdown");
const { replaceAtStart, replaceAtEnd, execute_command } = require("../lib/util");

function clean() {
  console.log(`Cleaning output directory: ${settings.output_directory}`);

  // Safety check: confirm output directory is in working directory
  const full_output_directory = path.resolve(settings.output_directory);
  const full_working_directory = path.resolve(".");
  if (path.dirname(full_output_directory) !== full_working_directory) {
    console.log(`Error: output_directory not in working directory: ${settings.output_directory}`);
    process.exit();
  }

  execute_command(`rm -r ${settings.output_directory}; mkdir ${settings.output_directory};`);
}

function copy_public() {
  console.log(`Copying public directory: ${settings.public_directory}`);
  execute_command(`cp -a ${settings.public_directory}/. ${settings.output_directory}`);
  // about the trailing dot:
  // `cp -a path/to/a path/to/b` would create a path/to/b/a directory and fill it
  // `cp -a path/to/a/. path/to/b` prevents cp from creating b/a directory, fills b
}

function convert_markdown() {
  // Convert Markdown
  console.log("Converting Markdown Files");
  glob(`${settings.input_directory}/**/*.md`, (err, paths) => {
    if (err) {
      console.log(`An error occured mataching files '${settings.input_directory}/**/*.md'`);
      return;
    }
    handleMarkdownFiles(paths);
  });
}

async function handleMarkdownFiles(paths) {
  for (const src_path of paths) {
    let dest_path = replaceAtStart(src_path, settings.input_directory, settings.output_directory);
    dest_path = replaceAtEnd(dest_path, ".md", ".html");

    console.log(`${src_path} -> ${dest_path}`);

    await handleMarkdownFile(src_path, dest_path);
  }
}

async function main() {
  console.log("Hello, Bookbuilder!!!!");

  clean();
  copy_public();
  convert_markdown();
}

main();
