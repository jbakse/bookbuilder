#!/usr/bin/env node

const bookbuilder = require("../lib/index");
console.log("Hello, Bookbuilder!");

let fs = require("fs");

fs.readFile("../compformnet/src/index.md", function (err, data) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  let markdown_source = data.toString("utf8");

  console.log(markdown_source);

  let html = bookbuilder.convert(markdown_source);
  console.log(html);

  fs.writeFile("../compformnet/dist/index.html", html, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
});
