// Function to load JSON data using AJAX
function loadJSON(callback) {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", "methods.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const suggestionList = document.getElementById('suggestionList');

let methodsData = null;

// Function to filter methods based on search query

function filterMethods(searchQuery) {
  searchQuery = searchQuery.toLowerCase();
  const matchingMethods = Object.keys(methodsData).filter(methodName => {
    const methodInfo = methodsData[methodName];
    const nameMatch = methodName.toLowerCase().includes(searchQuery);
    const descriptionMatch = methodInfo.description.toLowerCase().includes(searchQuery);
    return nameMatch || descriptionMatch;
  });

  return matchingMethods;
}


// Function to display the dropdown suggestions
function displaySuggestions(suggestions) {
  let suggestionHTML = '';
  suggestions.forEach(suggestion => {
    suggestionHTML += `<li>${suggestion}</li>`;
  });
  suggestionList.innerHTML = suggestionHTML;
  suggestionList.style.display = 'block';
}

// Function to hide the dropdown suggestions
function hideSuggestions() {
  suggestionList.style.display = 'block';
}

// Function to display the results in a box
function displayResults(results) {
  let resultHTML = '';
  results.forEach(methodName => {
    const methodInfo = methodsData[methodName];
    resultHTML += `<div class="result-box">
                      <h3>${methodName}</h3>
                      <p>Description: ${methodInfo.description}</p>
                      <p>Parameters: ${methodInfo.parameters}</p>
                      <p>Format: ${methodInfo.format}</p>
                      <p>Return Type: ${methodInfo.type}</p>
                  </div><hr>`;
  });

  resultsDiv.innerHTML = resultHTML;
}

// Function to handle the search query and display results and suggestions
function handleSearchQuery(searchQuery) {
  const matchingMethods = filterMethods(searchQuery);
  if (searchQuery.trim() === '' || matchingMethods.length === 0) {
    resultsDiv.style.display = 'none';
    hideSuggestions();
    return;
  }

  resultsDiv.style.display = 'block';
  displayResults(matchingMethods);
  displaySuggestions(matchingMethods);

}

// Debounce function to delay API call and avoid excessive requests
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Event listener to handle form submission
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const searchQuery = searchInput.value;
  handleSearchQuery(searchQuery);
});

// Event listener to handle input changes for autocomplete
const debouncedHandleSearchQuery = debounce(handleSearchQuery, 300);
searchInput.addEventListener('input', function () {
  const searchQuery = searchInput.value;
  if (!methodsData) {
    loadJSON(function (data) {
      methodsData = data;
      debouncedHandleSearchQuery(searchQuery);
    });
  } else {
    debouncedHandleSearchQuery(searchQuery);
  }
});

// Event listener to handle click on a suggestion
document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.tagName === 'LI') {
    searchInput.value = target.innerText;
    hideSuggestions();
    handleSearchQuery(searchInput.value);
  }
});

resultsDiv.style.display = 'none';