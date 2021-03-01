const fs = require("fs");
const path = require("path");

const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");
const pug = require("pug");

const { async_readFile, async_writeFile, readFileWithIncludes } = require("./util");
const { buildComponents } = require("./components");

const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true, // Autoconvert URL-like text to links
  typographer: true, // beautify type
  quotes: "“”‘’", // quotes for typographer
  // highlight: highlightSyntax,
});

md.use(require("markdown-it-anchor"), {
  permalink: false,
});
md.use(require("markdown-it-attrs"));
md.use(require("markdown-it-classy"));
md.use(require("markdown-it-deflist"));
md.use(require("markdown-it-mark"));
md.use(require("markdown-it-include"), {
  root: "content", // overridden by getRootDir
  // getRootDir: (options, state, startLine, endLine) => state.env.getIncludeRootDir(options, state, startLine, endLine), // parent relative
  // bracesAreOptional: true, // overridden by includeRe
  includeRe: /^@@include(.+?)$/m,
});

const convertMarkdown = function (source) {
  source = source || "";
  const result = md.render(source);
  return result;
};

/*
 * handleMarkdownFile performs the conversion from md to html.
 * It first translates all @@include() into the string data from the include
 * Then converts all ::: components (our specific ones) into html
 * Finally it sends that converted file through markdown-it to produce the final HTML
 *
 * Note that we convert our custom ::: components first so that markdown-it does not
 * cover them in html tags.
 */
exports.handleMarkdownFile = async (src_path, dest_path) => {
  // read source and convert all @@includes into path/*.md
  const src_source = readFileWithIncludes(src_path);

  if (!src_source) return;

  // parse frontmatter
  const parsed = matter(src_source);
  const markdown = parsed.content;
  const frontmatter = parsed.data;

  // read layout
  const layout_path = frontmatter.layout ? `layouts/${frontmatter.layout}` : "layouts/index.pug";
  console.log(`Using layout: ${layout_path}`);
  const layout = await async_readFile(layout_path);

  console.log("building components");
  // process components
  const expanded_markdown = buildComponents(markdown);

  console.log("converting to markdown");
  // convert to html
  const expanded_html = convertMarkdown(expanded_markdown);

  // populate layout
  const output = pug.render(layout, {
    pretty: true,
    filename: layout_path,
    contents: expanded_html,
    ...frontmatter,
  });

  // ensure directory exists
  fs.mkdirSync(path.dirname(dest_path), { recursive: true });

  // write converted html
  console.log("writing html", dest_path);
  await async_writeFile(dest_path, output);
};
