const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");

const { async_readFile, async_writeFile } = require("./util");

const convert = function (source) {
  source = source || "# Test headline";
  const md = new MarkdownIt();
  const result = md.render(source);
  return result;
};

exports.handleMarkdownFile = async (src_path, dest_path) => {
  // read source
  const src_source = await async_readFile(src_path);
  if (!src_source) return;

  // parse frontmatter
  const parsed = matter(src_source);
  const markdown = parsed.content;
  const frontmatter = parsed.data;

  // read template
  const template_path = frontmatter.template ? `templates/${frontmatter.template}` : "templates/index.html";
  const template = await async_readFile(template_path);

  console.log(`Template: ${template_path}`);

  // convert to html
  const html = convert(markdown);

  // populate template
  const output = template.replace(/\$\{body\}/g, html);

  // write html
  await async_writeFile(dest_path, output);
};
