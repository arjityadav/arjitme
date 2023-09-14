let serialNumber = 1; // Initialize a serial number counter
const serialNumbers = {}; // Object to store serial numbers for variables
let variableMap = {}; // Object to store variables

const jsonOutput = document.getElementById('jsonOutput');
const variableListContainer = document.getElementById('variableList');
const variableNameInput = document.getElementById('variable_name');
const variableValueInput = document.getElementById('variable_value');
const addVariableBtn = document.getElementById('addVariableBtn');
const downloadButton = document.getElementById('downloadButton');
const copyButton = document.getElementById('copyButton');
const jsonFileInput = document.getElementById('jsonFileInput');
const uploadLink = document.getElementById('uploadLink');

addVariableBtn.addEventListener('click', addVariable);
downloadButton.addEventListener('click', downloadJSON);
copyButton.addEventListener('click', copyJSON);

function generateJSON() {
  const jsonData = JSON.stringify(variableMap, null, 2);
  jsonOutput.textContent = jsonData;
  const variableTableHeader = document.querySelector('.variable-table');
  const searchContainer = document.querySelector('.search-container');
  const numberOfVariables = Object.keys(variableMap).length;
  
  if (numberOfVariables >= 3) {
    searchContainer.style.display = ''; 
  } else {
    searchContainer.style.display = 'none'; 
  }
  
  if(numberOfVariables==0){
    variableTableHeader.style.display = 'none'; 
  }else{
    variableTableHeader.style.display = '';
  }


}

function addVariable() {
  const variableName = variableNameInput.value.trim();
  const variableValue = variableValueInput.value.trim();

  if (variableName === '' || variableValue === '') {
    alert('Please enter both Variable Name and Variable Value.');
    return;
  }

  variableMap[variableName] = variableValue;
  updateVariableList();
  generateJSON();
  clearInputFields();
}

function editVariable(key) {
  const currentValue = variableMap[key];
  const newValue = prompt(`Edit value for ${key}:`, currentValue);
  if (newValue !== null) {
    variableMap[key] = newValue;
    updateVariableList();
    generateJSON();
  }
}

function deleteVariable(key) {
  if (confirm(`Are you sure you want to delete the variable "${key}"?`)) {
    delete variableMap[key];
    updateVariableList();
    generateJSON();
  }
}

function updateVariableList() {
  // Clear the table body before updating
  variableListContainer.innerHTML = '';

  // Create an array of variables to sort
  const variablesArray = Object.keys(variableMap).map((key) => ({
    key,
    serialNumber: serialNumbers[key], // Retrieve serial number
    value: variableMap[key],
  }));

  // Sort the variables by serialNumber in ascending order
  variablesArray.sort((a, b) => a.serialNumber - b.serialNumber);

  // Initialize a variable to keep track of the serial number
  let currentSerialNumber = 1;

  // Iterate through the sorted array and add rows to the table
  variablesArray.forEach(({ key, serialNumber, value }) => {
    const row = variableListContainer.insertRow();
    row.className = 'td';

    // Serial Number Cell
    const serialNumberCell = row.insertCell();
    serialNumberCell.textContent = currentSerialNumber++; // Display and increment serial number

    // Variable Name Cell
    const nameCell = row.insertCell();
    nameCell.textContent = key;

    // Variable Value Cell
    const valueCell = row.insertCell();
    valueCell.textContent = value;

    // Edit Button Cell
    const editCell = row.insertCell();
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editVariable(key));
    editCell.appendChild(editButton);

    // Delete Button Cell
    const deleteCell = row.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteVariable(key));
    deleteCell.appendChild(deleteButton);
  });
}

function clearInputFields() {
  variableNameInput.value = '';
  variableValueInput.value = '';
}

function downloadJSON() {
  const jsonData = JSON.stringify(variableMap, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'variableMap.json';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

function copyJSON() {
  const jsonData = JSON.stringify(variableMap, null, 2);

  // Create a textarea element to temporarily hold the JSON data
  const textArea = document.createElement('textarea');
  textArea.value = jsonData;
  document.body.appendChild(textArea);

  // Select and copy the text from the textarea
  textArea.select();
  document.execCommand('copy');

  // Remove the textarea
  document.body.removeChild(textArea);

  // Provide feedback to the user
  alert('JSON data copied to clipboard');
}

uploadLink.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the link from navigating

  // Create a file input element dynamically and trigger a click event
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';

  fileInput.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          variableMap = jsonData;
          updateVariableList();
          generateJSON();
          alert('JSON file successfully uploaded and loaded.');
        } catch (error) {
          alert('Invalid JSON file. Please choose a valid JSON file.');
        }
      };

      reader.readAsText(file);
    }
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
});

function searchVariables() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.trim().toLowerCase();
  const rows = variableListContainer.querySelectorAll('tr');

  rows.forEach((row) => {
    const variableNameCell = row.querySelector('td:nth-child(2)'); // Variable Name column
    const variableValueCell = row.querySelector('td:nth-child(3)'); // Variable Value column

    if (variableNameCell && variableValueCell) {
      const variableName = variableNameCell.textContent.toLowerCase();
      const variableValue = variableValueCell.textContent.toLowerCase();
      if (variableName.includes(searchTerm) || variableValue.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
}

// Initial update and JSON generation
updateVariableList();
generateJSON();
