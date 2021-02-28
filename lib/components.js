const slides = require("./slides_builder");
const components = {
  slides: slides.builder,
  //   "js-lab": require("./jslab_builder"),
  //   "js-show": require("./jsshow_builder"),
};

/**
 * buildComponents finds our custom ::: tags and converts them into appropriate div tags
 * with class and ids
 *
 * There cannot be errors and any stray spaces in the markup will cause faulty html to be
 * produced in the final result.
 *
 * Finds lines that look like
 * ::: .warning #e1
 * lorem
 * :::
 *
 * Turns them into
 * <div id="e1" class="warning">
 * lorem
 * </div>
 */
exports.buildComponents = (input) => {
  // (\r\n|\r|\n) is a cross platform friendly way of capturing all of the line endings.
  // /\n:::(.*?)\n(((?!\n:::)[\s\S])*?)\n\/::/g is the pattern without the cross platform capture
  const component_regex = /[\r\n|\r|\n]:::(.*?)[\r\n|\r|\n](((?![\r\n|\r|\n]:::)[\s\S])*?)[\r\n|\r|\n]\/::/g;

  const result = input.replace(component_regex, exports.buildComponent);

  return result;
};
// b((?!f).)*i

/*
 * buildComponent() does the actual replacement of the internal ::: parts
 * by searching for substrings (found with regex) that start with .[class] and #[id].
 *
 * Future change:
 * -handle malformed identifiers or at least notice and error out.
 * -handle multiple classes or ids
 * -nested components?
 */
exports.buildComponent = (match, selector, content) => {
  console.log("build component!");

  // trim and split on spaces (collapse multiple spaces)
  const selector_parts = selector.trim().split(/ +/);

  // extract classes, ids, requested components
  let classes = [];
  let ids = [];
  const requested_components = [];

  // uses simple character matching to find the content.
  selector_parts.forEach((part) => {
    // find classes
    if (part.startsWith(".")) {
      classes.push(part.substr(1));
    }
    // find ids
    else if (part.startsWith("#")) {
      ids.push(part.substr(1));
    }
    // find the content in the remainder
    else {
      requested_components.push(part);
    }
  }, this);

  // process requested components
  requested_components.forEach((request) => {
    const f = components[request];

    if (f) {
      [classes, ids, content] = f(classes, ids, content);
    }
  });

  // export
  classes = classes.join(" ");
  ids = ids.join(" ");

  return `
<div id="${ids}" class="${classes}">\n\n${content}\n\n</div>`;

  // the div tag will look like this:
  // return t.dedent(`
  // <div id="${ids}" class="${classes}">\n
  // ${content}\n
  // </div>`);
};
