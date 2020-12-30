let MarkdownIt = require("markdown-it");

exports.convert = function (source) {
  source = source || "# Test headline";
  let md = new MarkdownIt();
  let result = md.render(source);
  return result;
};
