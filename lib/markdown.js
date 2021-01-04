const MarkdownIt = require("markdown-it");

const { async_readFile, async_writeFile } = require("./util");

const convert = function (source) {
  source = source || "# Test headline";
  const md = new MarkdownIt();
  const result = md.render(source);
  return result;
};

exports.handleMarkdownFile = async (src_path, dest_path) => {
  // read markdown
  const markdown = await async_readFile(src_path);
  if (!markdown) return;

  // convert to html
  const html = convert(markdown);

  // write html
  await async_writeFile(dest_path, html);
};
