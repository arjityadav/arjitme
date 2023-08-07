let objectsData = [];
let editedIndex = -1;
// Predefined locator names and xpath types
const locatorNames = ['Select Locator Type','ID', 'Name', 'ClassName', 'LinkText', 'Partial LinkText', 'TagName', 'CssSelector', 'XPath'];
const xpathTypes = ['Select XPath Type','using attribute', 'using text', 'using contains', 'using starts-with','using multiple attributes','using index','custom'];

let uploadedFileName = '';

function addObject() {
    const objectName = document.getElementById('objectName').value.trim();
    const locatorName = document.getElementById('locatorName').value.trim();
    const locatorValue = document.getElementById('locatorValue').value.trim();

    if (objectName && locatorName && locatorValue) {
        if (editedIndex >= 0) {
            // Update the existing object if an index is marked as editedIndex
            objectsData[editedIndex] = {
                objectName,
                locatorName,
                locatorValue,
            };
            editedIndex = -1; // Reset editedIndex after saving the changes
        } else {
            // Add a new object if editedIndex is not set
            objectsData.push({
                objectName,
                locatorName,
                locatorValue,
            });
        }
        updateLocatorName();
        updateObjectContainer();
        updateJSONOutput();
        clearInputs();
    } else {
        alert('Please fill in all fields to add an object.');
    }
}

function updateLocatorName() {
    const locatorNameSelect = document.getElementById('locatorName');
    locatorNameSelect.innerHTML = '';

    locatorNames.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        locatorNameSelect.appendChild(option);
    });
}

function updateXpathType() {
    const locatorName = document.getElementById('locatorName').value;
    const xpathTypeContainer = document.getElementById('xpathTypeContainer');
    const xpathTypeSelect = document.getElementById('xpathType');

    if (locatorName === 'XPath') {
        xpathTypeContainer.style.display = 'block';
        xpathTypeSelect.innerHTML = '';

        xpathTypes.forEach((type) => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            xpathTypeSelect.appendChild(option);
        });
    } else {
        xpathTypeContainer.style.display = 'none';
    }
}


function updateObjectContainer() {
    const objectContainer = document.getElementById('objectContainer');
    objectContainer.innerHTML = '';

    objectsData.forEach((object, index) => {
        const objectDiv = document.createElement('div');
        objectDiv.classList.add('object-container');

        const objectInfo = `
        <div>
          <strong>Object ${index + 1}:</strong>
          <span>${object.objectName}</span>
        </div>
        <div>
          <strong>Locator Name:</strong>
          <span>${object.locatorName}</span>
        </div>
        <div>
          <strong>Locator Value:</strong>
          <span>${object.locatorValue}</span>
        </div>
        <button onclick="editObject(${index})">Edit</button>
        <button onclick="deleteObject(${index})">Delete</button>
      `;

        objectDiv.innerHTML = objectInfo;
        objectContainer.appendChild(objectDiv);
    });
}

function deleteObject(index) {
    objectsData.splice(index, 1);
    updateObjectContainer();
    updateJSONOutput();
}

function updateJSONOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonScript = JSON.stringify(
        objectsData.reduce((result, object) => {
            result[object.objectName] = {
                locator_name: object.locatorName,
                locator_value: object.locatorValue,
            };
            return result;
        }, {}),
        null,
        2
    );
    jsonOutput.textContent = jsonScript;
}

function clearInputs() {
    document.getElementById('objectName').value = '';
    document.getElementById('locatorName').value = '';
    document.getElementById('locatorValue').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    updateLocatorName();
    updateXpathType();
    updateObjectContainer();
    updateJSONOutput();
});

// New event listeners for dynamic behavior
document.getElementById('locatorName').addEventListener('change', updateXpathType);
document.getElementById('xpathType').addEventListener('change', populateLocatorValue);

function populateLocatorValue() {
    const locatorName = document.getElementById('locatorName').value;
    const xpathType = document.getElementById('xpathType').value;
    const locatorValueInput = document.getElementById('locatorValue');

    if (locatorName === 'XPath') {
        if (xpathType === 'using attribute') {
            locatorValueInput.value = "//tagname[@attribute='value']";
        } else if (xpathType === 'using text') {
            locatorValueInput.value = "//tagname[text()='Text of the Web Element']";
        }  else if (xpathType === 'using starts-with') {
            locatorValueInput.value = "//tagname[starts-with(@attribute, 'value')]";
        } else if (xpathType === 'using contains') {
            locatorValueInput.value = "//tagname[contains(@attribute, 'constantvalue')]";
        } else if (xpathType === 'using multiple attributes') {
            locatorValueInput.value = "//tagname[@attribute1='value1'][@attribute2='value2']";
        } else if (xpathType === 'using index') {
            locatorValueInput.value = "(//tagname)[index]";
        } 
        else {
            locatorValueInput.value = '';
        }
    } else {
        locatorValueInput.value = '';
    }

}

function editObject(index) {
    const object = objectsData[index];
    document.getElementById('objectName').value = object.objectName;
    document.getElementById('locatorName').value = object.locatorName;
    document.getElementById('locatorValue').value = object.locatorValue;

    if (object.locatorName === 'XPath') {
        const xpathTypeContainer = document.getElementById('xpathTypeContainer');
        xpathTypeContainer.style.display = 'block';
        document.getElementById('xpathType').value = '';
        populateLocatorValue();
    }

    // Set the editedIndex to the current index being edited
    editedIndex = index;
}

function downloadJSON() {
    if (objectsData.length === 0) {
        alert('Please add objects before downloading the JSON.');
        return;
    }

    let fileName;
    if (uploadedFileName) {
        // If an existing file was uploaded, use its name for the download
        uploadedFileName = uploadedFileName.replace(".json","");
        fileName = prompt('Please enter a file name to save the JSON file:', uploadedFileName);
        if (fileName === null) {
            // User clicked "Cancel" in the prompt
            return; // Do not proceed with the download
        }
    } else {
        // If no file was uploaded, prompt for a file name
        fileName = prompt('Please enter a file name to save the JSON file:', '<Project/Module Name>_ObjectMapExternal');
        if (fileName === null) {
            // User clicked "Cancel" in the prompt
            return;
        }

        if (fileName.trim() === '') {
            alert('Please enter a valid file name.');
            return;
        }
    }

    const jsonOutput = document.getElementById('jsonOutput');
    const jsonScript = JSON.stringify(
        objectsData.reduce((result, object) => {
            result[object.objectName] = {
                locator_name: object.locatorName,
                locator_value: object.locatorValue,
            };
            return result;
        }, {}),
        null,
        2
    );

    const jsonString = jsonScript;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

function openFileInput() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', handleFileChange);
    fileInput.click();
}

function handleFileChange(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const uploadedData = JSON.parse(event.target.result);

            // Clear existing objectsData
            objectsData = [];
            editedIndex = -1;

            // Populate objectsData with uploadedData
            Object.keys(uploadedData).forEach((objectName) => {
                const { locator_name, locator_value } = uploadedData[objectName];
                objectsData.push({
                    objectName,
                    locatorName: locator_name,
                    locatorValue: locator_value,
                });
            });

            // Update the UI with the uploaded JSON data
            updateObjectContainer();
            updateJSONOutput();
        };

        reader.readAsText(file);
        uploadedFileName = file.name;
    }
}

function copyJSON() {
  const jsonOutput = document.getElementById('jsonOutput');
  const jsonString = jsonOutput.textContent;

  const tempElement = document.createElement('textarea');
  tempElement.value = jsonString;
  document.body.appendChild(tempElement);
  tempElement.select();
  document.execCommand('copy');
  document.body.removeChild(tempElement);

  alert('JSON data copied to clipboard!');
}