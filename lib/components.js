const slides = require("./slides_builder");
const components = {
  slides: slides.builder,
  //   "js-lab": require("./jslab_builder"),
  //   "js-show": require("./jsshow_builder"),
};

/**
 * buildComponents converts custom ::: /:: blocks using component plugins and
 * marking them with provided ids and classes
 *
 * Finds lines that look like
 * ::: .warning #e1
 * lorem
 * /::
 *
 * Turns them into
 * <div id="e1" class="warning">
 * lorem
 * </div>
 */
exports.buildComponents = (input) => {
  // match component blocks
  const component_regex = /[\r\n|\r|\n]:::(.*?)[\r\n|\r|\n](((?![\r\n|\r|\n]:::)[\s\S])*?)[\r\n|\r|\n]\/::/g;

  /*
 [\r\n|\r|\n] // cross platform line ending
 :::          // ::: starts a component block
 (.*?)        // grab the rest of the characters on the line
 [\r\n|\r|\n] // cross platform line ending
 (
   (
     (?!
      [\r\n|\r|\n]
      :::
     )
     [\s\S]
   )*?
 )
 [\r\n|\r|\n] // cross platform line ending
 \/::         // /:: ends a component block
 /g           // globally
 
  */

  // [\r\n|\r|\n] is a cross platform friendly way of capturing all of the line endings.
  // /\n:::(.*?)\n(((?!\n:::)[\s\S])*?)\n\/::/g // pattern for unix style line endings only

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
