const slides = require("./slides_builder");
const components = {
  slides: slides.builder,
  //   "js-lab": require("./jslab_builder"),
  //   "js-show": require("./jsshow_builder"),
};

/**
 * convertContainer(string)
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
  //    let component_regex = /\n:::(.*?)\n([\s\S]*?)\n:::/g;

  const component_regex = /\n:::(.*?)\n(((?!\n:::)[\s\S])*?)\n\/::/g;

  const result = input.replace(component_regex, exports.buildComponent);
  return result;
};
// b((?!f).)*i

exports.buildComponent = (match, selector, content) => {
  console.log("build component!");

  // trim and split on spaces (collapse multiple spaces)
  const selector_parts = selector.trim().split(/ +/);

  // extract classes, ids, requested components
  let classes = [];
  let ids = [];
  const requested_components = [];

  selector_parts.forEach((part) => {
    if (part.startsWith(".")) {
      classes.push(part.substr(1));
    } else if (part.startsWith("#")) {
      ids.push(part.substr(1));
    } else {
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

  //     return t.dedent(`
  // <div id="${ids}" class="${classes}">\n
  // ${content}\n
  // </div>`);
};