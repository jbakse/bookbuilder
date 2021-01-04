#!/usr/bin/env node

const settings = {
  content_directory: "content",
  output_directory: "dist",
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

function copy_content() {
  console.log(`Copying content directory: ${settings.content_directory}`);
  execute_command(`cp -a ${settings.content_directory}/. ${settings.output_directory}`);
}

function copy_public() {
  console.log(`Copying public directory: ${settings.public_directory}`);
  execute_command(`cp -a ${settings.public_directory}/. ${settings.output_directory}`);
}

function convert_markdown() {
  // Convert Markdown
  console.log("Converting Markdown Files");
  glob(`${settings.content_directory}/**/*.md`, (err, paths) => {
    if (err) {
      console.log(`An error occured mataching files '${settings.content_directory}/**/*.md'`);
      return;
    }
    handleMarkdownFiles(paths);
  });
}

async function handleMarkdownFiles(paths) {
  for (const src_path of paths) {
    let dest_path = replaceAtStart(src_path, settings.content_directory, settings.output_directory);
    dest_path = replaceAtEnd(dest_path, ".md", ".html");

    console.log(`${src_path} -> ${dest_path}`);

    await handleMarkdownFile(src_path, dest_path);
  }
}

function compile_sass() {
  console.log("Compiling Sass");
  execute_command("sass style/index.scss dist/style.css");
}

async function main() {
  console.log("Hello, Bookbuilder!!!!");

  clean();
  copy_content();
  copy_public();
  compile_sass();
  convert_markdown();
}

main();
