const yaml = require("js-yaml");

// slides counter used to provide unique id to each carousel
let slidesCounter = 0;

function init() {
  slidesCounter = 0;
}

function slidesBuilder(classes, ids, content) {
  slidesCounter++;

  // parse data
  const data = yaml.safeLoad(content);

  // console.log("Data", data);

  // build slides markup
  let slides = "";
  data.forEach((slide, i) => {
    slide.artist = slide.artist || "";
    slide.title = slide.title || "";
    slide.comments = slide.comments || "";

    let links = "";
    if (slide.links && slide.links.length) {
      slide.links.forEach((link, i) => {
        links += `<a href="${link.href}">${link.label}</a>`;
      });
    }

    slides += trimLines(`
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <div class="slide">
              <div class="slide-image">
                <img class="d-block" src="${slide.image}" alt="${slide.title}">
              </div>
              <div class="slide-info">
                <div class="slide-info-middle">
                  
                  <div class="artist">${slide.artist}</div>
                  <div class="title">${slide.title}</div>
                  <div class="comments">${slide.comments}</div>

                </div>
                <div class="slide-info-bottom">
                  ${links}
                </div>
              </div>
            </div>
          </div>`);
  });

  content = trimLines(`
      <div id="carousel-${slidesCounter}" class="carousel slide" data-ride="carousel">

        <div class="carousel-inner slides" role="listbox">
              ${slides}
        </div>

        <div class="slide-info-top">
          <a class="carousel-control-prev" href="#carousel-${slidesCounter}" role="button" data-slide="prev">
            <span class="carousel-prev-icon">
                <svg width="15px" height="18px" viewBox="0 0 15 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <defs></defs>
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <polygon id="Page-1-Copy" fill="#3B7CF4" transform="translate(7.500000, 8.659834) rotate(-180.000000) translate(-7.500000, -8.659834) " points="0 17.3196679 15 8.65334717 0 5.68434189e-14"></polygon>
                  </g>
                </svg>
            </span>
            <span class="sr-only">Previous</span>
          </a>

          <a class="carousel-control-next" href="#carousel-${slidesCounter}" role="button" data-slide="next">

            <span class="carousel-next-icon-tc">
              <svg width="15px" height="18px" viewBox="0 0 15 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <polygon fill="#3B7CF4" points="0 17.3196679 15 8.65334717 0 5.68434189e-14"></polygon>
                </g>
              </svg>
            </span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>`);

  classes.push("slides-wrap");
  classes.push("slideInfos");
  return [classes, ids, content];
}

module.exports = {
  builder: slidesBuilder,
  init: init,
};

function trimLines(text) {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].trim();
  }
  text = lines.join("\n");
  return text;
}
