const searchTerm = document.querySelector("#searchTerm");
const searchResultElem = document.querySelector("#searchResult");
searchTerm.focus();

searchTerm.addEventListener("input", (event) => {
  search(event.target.value);
});

const debounce = (fn, delay = 500) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};

const search = debounce(async (searchTerm) => {
  if (!searchTerm) {
    searchResultElem.innerHTML = "";
    return;
  }
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
    const response = await fetch(url);
    const searchResult = await response.json();
    const searchResultHtml = generateHtml(searchResult.query.search, searchTerm);
    searchResultElem.innerHTML = searchResultHtml;
  } catch (error) {
    console.log(error);
  }
});

const stripHtml = (html) => {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent;
};

const highlightTerm = (str, keyword, className = "highlight") => {
  const highlighted = `<span class="${className}">${keyword}</span>`;
  return str.replace(new RegExp(keyword, "gi"), highlighted);
};

const generateHtml = (results, searchTerm) => {
  return results
    .map((result) => {
      const title = highlightTerm(stripHtml(result.title), searchTerm);
      const snippet = highlightTerm(stripHtml(result.snippet), searchTerm);
      return `<article> 
      <a href="https://en.wikipedia.org/?curid=${result.pageid}">
        <h2>${title}</h2>
      </a>
      <div class="summary">${snippet}...</div>
      </article>`;
    })
    .join("");
};
