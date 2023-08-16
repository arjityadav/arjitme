var currentObjectId = 1; // Initialize object ID counter
function addObject() {
    var container = document.getElementById("object-container");

    var entryDiv = document.createElement("div");
    entryDiv.className = "object-entry";
    entryDiv.style.border = "1px solid #ccc";
    entryDiv.style.padding = "10px";

    var objectIdHeading = document.createElement("h5");
    objectIdHeading.className = "object-id";
    objectIdHeading.textContent = "Object " + currentObjectId;
    objectIdHeading.style.fontWeight = "bold";
    entryDiv.insertBefore(objectIdHeading, nameInput);

    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Object name";
    entryDiv.appendChild(nameInput);

    var locatorDropdown = document.createElement("select");
    locatorDropdown.name = "locator";
    var options = ["select locator", "id", "class name", "tag name", "name", "link text", "partial link text", "css selector", "xpath"];
    options.forEach(function (optionText) {
        var option = document.createElement("option");
        if (option == "select locator") {
            option.text = optionText;
        } else {
            option.value = optionText;
            option.text = optionText;
        }
        locatorDropdown.appendChild(option);
    });
    entryDiv.appendChild(locatorDropdown);

    var xpathTypeDropdown = document.createElement("select");
    xpathTypeDropdown.name = "xpathType";
    xpathTypeDropdown.className = "xpath-type";
    var selectOption = document.createElement("option");
    selectOption.text = "select xpath type";
    xpathTypeDropdown.appendChild(selectOption);
    var attributeOption = document.createElement("option");
    attributeOption.value = "attribute";
    attributeOption.text = "attribute";
    xpathTypeDropdown.appendChild(attributeOption);
    var containsOption = document.createElement("option");
    containsOption.value = "contains";
    containsOption.text = "contains";
    xpathTypeDropdown.appendChild(containsOption);
    var startsWithOption = document.createElement("option");
    startsWithOption.value = "starts-with";
    startsWithOption.text = "starts-with";
    xpathTypeDropdown.appendChild(startsWithOption);
    var textOption = document.createElement("option");
    textOption.value = "text";
    textOption.text = "text";
    xpathTypeDropdown.appendChild(textOption);
    var customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.text = "custom";
    xpathTypeDropdown.appendChild(customOption);
    entryDiv.appendChild(xpathTypeDropdown);

    var valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.placeholder = "Locator value";
    entryDiv.appendChild(valueInput);

    var descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.placeholder = "Description (optional)";
    entryDiv.appendChild(descriptionInput);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "button-74-delete";
    deleteButton.onclick = function () {
        container.removeChild(entryDiv);
        var remainingObjects = document.getElementsByClassName("object-entry");
        for (var i = 0; i < remainingObjects.length; i++) {
            var objectIdHeading = remainingObjects[i].querySelector("h4");
            if (objectIdHeading) {
                objectIdHeading.textContent = "Object " + (i + 1);
            }
        }
        currentObjectId = container.getElementsByClassName("object-id").length + 1;
    };
    entryDiv.appendChild(deleteButton);

    container.appendChild(entryDiv);

    currentObjectId++;

    // Show/hide the XPath type dropdown based on the locator selection
    locatorDropdown.onchange = function () {
        if (locatorDropdown.value === "xpath") {
            xpathTypeDropdown.style.display = "inline-block";
        } else {
            xpathTypeDropdown.style.display = "none";
        }
    };

    // Generate the pre-generated text for the locator value based on the selected XPath type
    xpathTypeDropdown.onchange = function () {
        var selectedOption = xpathTypeDropdown.value;
        if (selectedOption === "select xpath type") {
            valueInput.value = null;
        } else if (selectedOption === "attribute") {
            valueInput.value = "//tagname[@attribute='value']";
        } else if (selectedOption === "contains") {
            valueInput.value = "//tagname[contains(@attribute, 'constantvalue')]";
        } else if (selectedOption === "starts-with") {
            valueInput.value = "//tagname[starts-with(@attribute, 'value')]";
        } else if (selectedOption === "text") {
            valueInput.value = "//tagname[text()='Text of the Web Element']";
        } else if (selectedOption === "custom") {
            valueInput.value = "//";
        }
    };
}

function addTestCase() {
    const testItemTemplate = document.querySelector('#test-item-template');
    const testItemClone = testItemTemplate.content.cloneNode(true);
    const testItemsContainer = document.querySelector('#test-items-container');
    const testItemIndex = testItemsContainer.children.length + 1;
    testItemClone.querySelector('.test-item-index').textContent = testItemIndex;
    testItemsContainer.appendChild(testItemClone);
}

// Function to delete a test item
function deleteTestCase(deleteBtn) {
    const testItem = deleteBtn.parentNode;
    testItem.parentNode.removeChild(testItem);
}

// Function to add a new test action within a test item
function addTestAction(addBtn) {
    const testActionTemplate = document.querySelector('#test-action-template');
    const testActionClone = testActionTemplate.content.cloneNode(true);
    const testActionsContainer = addBtn.previousElementSibling;
    const testActionIndex = testActionsContainer.children.length + 1;
    testActionClone.querySelector('.test-action-index').textContent = testActionIndex;
    testActionsContainer.appendChild(testActionClone);
}

// Function to delete a test action within a test item
function deleteTestAction(deleteBtn) {
    const testAction = deleteBtn.parentNode;
    testAction.parentNode.removeChild(testAction);
}

// Function to add a new configuration parameter within a test action
function addConfigParam(addBtn) {
    const configParamTemplate = document.querySelector('#config-param-template');
    const configParamClone = configParamTemplate.content.cloneNode(true);
    const configParamsContainer = addBtn.previousElementSibling;
    configParamsContainer.appendChild(configParamClone);
}

// Function to delete a configuration parameter within a test action
function deleteConfigParam(deleteBtn) {
    const configParam = deleteBtn.parentNode.parentNode;
    const configParamsContainer = configParam.parentNode;
    configParamsContainer.removeChild(configParam);
}

// Function to configure the action parameters based on selected action name and type
function configureActionParams(actionNameSelect) {
    const testAction = actionNameSelect.parentNode.parentNode.parentNode;
    const actionTypeSelect = testAction.querySelector('.action-type-input');
    const configParamsContainer = testAction.querySelector('.config-params-container');
    configParamsContainer.innerHTML = '';

    // Get the selected action name and type
    const actionName = actionNameSelect.value;
    const actionType = actionTypeSelect.value;

    // Define the configuration parameters based on the selected action name and type
    let configParams = [];
    if (actionType === 'select_action_type') {
        if (actionName === 'select_action_name') {
        }
    }
    else if (actionType === 'ui') {
        if (actionName === 'ui_open_browser') {
            configParams = [
                { name: 'browser_name', label: 'Browser Name' },
                { name: 'sso_login', label: 'Enable SSO Login' }
            ];
        } else if (actionName === 'ui_navigate') {
            configParams = [
                { name: 'url', label: 'URL' }
            ];
        } else if (actionName === 'ui_input') {
            configParams = [
                { name: 'object_name', label: 'Object Name' },
                { name: 'input_value', label: 'Input Value' }
            ];
        } else if (actionName === 'ui_click') {
            configParams = [
                { name: 'object_name', label: 'Object Name' }
            ];
        } else if (actionName === 'ui_verify_css_property') {
            configParams = [
                { name: 'object_name', label: 'Object Name' },
                { name: 'css_property', label: 'CSS Property' },
                { name: 'expected_value', label: 'Expected Value' }
            ];
        } else if (actionName === 'ui_verify_text') {
            configParams = [
                { name: 'object_name', label: 'Object Name' },
                { name: 'expected_text', label: 'Expected Text' }
            ];
        } else if (actionName === 'ui_close_browser') {
            // No additional configuration parameters needed
        }
        else if (actionName === 'ui_appian_open_browser') {
            configParams = [
                { name: 'browser_name', label: 'Browser Name' },
                { name: 'sso_login', label: 'Enable SSO Login' }
            ];
        } else if (actionName === 'ui_appian_action') {
            configParams = [
                { name: 'method_name', label: 'Method Name', dropdown: ['open', 'loginWithUsername', 'waitForProgressBar'] },
                { name: 'method_argument', label: 'Method Argument' },
                { name: 'method_type', label: 'Method Type' }
            ];
        }
    }

    else if (actionType === 'api') {
        // Configuration parameters for API actions
    } else if (actionType === 'file_system') {
        // Configuration parameters for file system actions
    }

    // Create the configuration parameter inputs
    for (const param of configParams) {
        const paramTemplate = document.querySelector('#config-param-template');
        const paramClone = paramTemplate.content.cloneNode(true);
        const paramNameInput = paramClone.querySelector('.config-param-name-input');
        const paramValueInput = paramClone.querySelector('.config-param-value-input');
        paramNameInput.value = param.name;
        paramNameInput.setAttribute('placeholder', param.label);
        configParamsContainer.appendChild(paramClone);
    }

}

// Function to move a test action up within a test item
function moveTestActionUp(moveUpBtn) {
    const testAction = moveUpBtn.parentNode.parentNode;
    const previousTestAction = testAction.previousElementSibling;
    if (previousTestAction) {
        testAction.parentNode.insertBefore(testAction, previousTestAction);
    }
}

// Function to move a test action down within a test item
function moveTestActionDown(moveDownBtn) {
    const testAction = moveDownBtn.parentNode.parentNode;
    const nextTestAction = testAction.nextElementSibling;
    if (nextTestAction) {
        testAction.parentNode.insertBefore(nextTestAction, testAction);
    }
}


function generateJSON() {
    var entries = document.getElementsByClassName("object-entry");
    var data = {};

    var testsuiteName = document.getElementById("testsuite-name").value;
    var testsuiteOwner = document.getElementById("testsuite-owner").value;

    if (!testsuiteName || !testsuiteOwner) {
        alert("Test suite name and owner are mandatory fields. Please fill them.");
        return;
    }
    var objectMap = {};

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var name = entry.getElementsByTagName("input")[0].value;
        var locator = entry.getElementsByTagName("select")[0].value;
        var locatorValue = entry.getElementsByTagName("input")[1].value;
        var description = entry.getElementsByTagName("input")[2].value;

        var objectEntry = {
            locator_name: locator,
            locator_value: locatorValue
        }


        if (description) {
            objectEntry.description = description;
        }

        objectMap[name] = objectEntry;
    }

    var testifactInfo = {
        testsuite_name: testsuiteName,
        testsuite_owner: testsuiteOwner,
        object_map_internal: objectMap
    };

    const testItemsContainer = document.querySelector('#test-items-container');
    const testItems = [];

    // Iterate over each test item
    for (const testItem of testItemsContainer.children) {
        const testNameInput = testItem.querySelector('.test-name-input');
        const descriptionInput = testItem.querySelector('.description-input');
        const executeInput = testItem.querySelector('.execute-input');
        const testActionsContainer = testItem.querySelector('.test-actions-container');
        const testActions = [];

        const testName = testNameInput.value;
        const description = descriptionInput.value;
        const execute = executeInput.value;

        // Iterate over each test action within the test item
        for (const testAction of testActionsContainer.children) {
            const actionNameSelect = testAction.querySelector('.action-name-input');
            const actionTypeSelect = testAction.querySelector('.action-type-input');
            const configParamsContainer = testAction.querySelector('.config-params-container');
            const actionConfig = {};

            const actionName = actionNameSelect.value;
            const actionType = actionTypeSelect.value;

            // Iterate over each configuration parameter within the test action
            for (const configParam of configParamsContainer.children) {
                const paramNameInput = configParam.querySelector('.config-param-name-input');
                const paramValueInput = configParam.querySelector('.config-param-value-input');
                const paramName = paramNameInput.value;
                const paramValue = paramValueInput.value;
                actionConfig[paramName] = paramValue;
            }

            // Create the test action object
            const testActionObj = {
                action_name: actionName,
                action_type: actionType,
                action_config: actionConfig
            };

            // Add the test action to the list of test actions
            testActions.push(testActionObj);
        }

        // Create the test item object
        const testItemObj = {
            test_name: testName,
            description: description,
            execute: execute,
            test_actions: testActions
        };

        // Add the test item to the list of test items
        testItems.push(testItemObj);
    }

    var data = {
        testifact_info: testifactInfo,
        testifact_items: testItems
    };

    var jsonContainer = document.getElementById("json-container");
    jsonContainer.textContent = JSON.stringify(data, null, 2);
    document.getElementById("copy-btn").style.display = "inline";
    document.getElementById("download-btn").style.display = "inline";
}

function downloadJSON() {
    var json = document.getElementById("json-container").textContent;
    var blob = new Blob([json], { type: "text/plain" }); // Change the content type to text/plain
    var url = URL.createObjectURL(blob);
    if (!document.getElementById("testsuite-name").value || !document.getElementById("testsuite-owner").value) {
        alert("Test suite name and owner are mandatory fields. Please fill them.");
        return;
    }
    var a = document.createElement("a");
    a.href = url; // Set the correct URL generated from the Blob object
    a.download = document.getElementById("testsuite-name").value + "_json.txt"; // Change the file extension to .txt
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function copyJSONToClipboard() {
    var json = document.getElementById("json-container").textContent;

    // Create a temporary textarea element
    var tempTextarea = document.createElement("textarea");
    tempTextarea.value = json;

    // Append the textarea element to the document
    document.body.appendChild(tempTextarea);

    // Select and copy the content of the textarea
    tempTextarea.select();
    document.execCommand("copy");

    // Remove the temporary textarea from the document
    document.body.removeChild(tempTextarea);

    // Provide visual feedback to the user (optional)
    alert("JSON copied to clipboard!");
}

// function toggleActionNameField(actionTypeSelect) {
//     var actionNameSelect = document.querySelector('.action-name-input');
//     var actionTypeSelect = document.querySelector('.action-type-input');
//     if (actionTypeSelect.value === 'select_action_type') {
//         actionNameSelect.disabled = true;
//     } else {
//         actionNameSelect.disabled = false;
//     }
// }

const openModalButton = document.getElementById('searchButton');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalButton = document.getElementById('closeModalButton');

openModalButton.addEventListener('click', function () {
    modalOverlay.style.display = 'block';
});

closeModalButton.addEventListener('click', function () {
    modalOverlay.style.display = 'none';
});

const loadJSONLink = document.getElementById('load-json-link');

loadJSONLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const jsonContent = e.target.result;
                const jsonData = JSON.parse(jsonContent);

                // Populate form fields with loaded JSON data
                populateFormFromJSON(jsonData);
            };
            reader.readAsText(file);
        }
    });

    fileInput.click(); // Trigger the file input dialog
});

function populateFormFromJSON(jsonData) {
    const testsuiteNameInput = document.getElementById('testsuite-name');
    const testsuiteOwnerInput = document.getElementById('testsuite-owner');
    const objectContainer = document.getElementById('object-container');
    const testItemsContainer = document.getElementById('test-items-container');

    testsuiteNameInput.value = jsonData.testifact_info.testsuite_name || '';
    testsuiteOwnerInput.value = jsonData.testifact_info.testsuite_owner || '';

    // Clear existing objects and test items
    objectContainer.innerHTML = '';
    testItemsContainer.innerHTML = '';

    // Populate object map
    for (const objectName in jsonData.testifact_info.object_map_internal) {
        const objectData = jsonData.testifact_info.object_map_internal[objectName];
        addObjectFromJSON(objectName, objectData);
    }

    // Populate test items
    for (const testItemData of jsonData.testifact_items) {
        addTestItemFromJSON(testItemData);
    }
}

function addObjectFromJSON(name, data) {
    const container = document.getElementById('object-container');

    const entryDiv = document.createElement('div');
    entryDiv.className = 'object-entry';
    entryDiv.style.border = '1px solid #ccc';
    entryDiv.style.padding = '10px';

    // Create and populate object ID heading
    const objectIdHeading = document.createElement('h5');
    objectIdHeading.className = 'object-id';
    objectIdHeading.textContent = 'Object ' + currentObjectId;
    objectIdHeading.style.fontWeight = 'bold';
    entryDiv.appendChild(objectIdHeading);

    // Create and populate object name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Object name';
    nameInput.value = name || '';
    entryDiv.appendChild(nameInput);

    // Create and populate locator dropdown
    const locatorDropdown = document.createElement('select');
    locatorDropdown.name = 'locator';
    const options = ["select locator", "id", "class name", "tag name", "name", "link text", "partial link text", "css selector", "xpath"];
    options.forEach(function (optionText) {
        const option = document.createElement('option');
        if (optionText === data.locator_name) {
            option.value = optionText;
            option.text = optionText;
            option.selected = true;
        } else if (optionText === 'select locator') {
            option.text = optionText;
        } else {
            option.value = optionText;
            option.text = optionText;
        }
        locatorDropdown.appendChild(option);
    });
    entryDiv.appendChild(locatorDropdown);

    // Create and populate locator value input
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Locator value';
    valueInput.value = data.locator_value || '';
    entryDiv.appendChild(valueInput);

    // Create and populate description input
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.placeholder = 'Description (optional)';
    descriptionInput.value = data.description || '';
    entryDiv.appendChild(descriptionInput);

    // ... Continue adding code to populate other fields ...

    container.appendChild(entryDiv);

    currentObjectId++;
}

function addTestItemFromJSON(testItemData) {
    const testItemTemplate = document.querySelector('#test-item-template');
    const testItemClone = testItemTemplate.content.cloneNode(true);
    const testItemsContainer = document.querySelector('#test-items-container');
    const testItemIndex = testItemsContainer.children.length + 1;
    testItemClone.querySelector('.test-item-index').textContent = testItemIndex;

    // Populate test item fields from JSON data
    testItemClone.querySelector('.test-name-input').value = testItemData.test_name || '';
    testItemClone.querySelector('.description-input').value = testItemData.description || '';
    testItemClone.querySelector('.execute-input').value = testItemData.execute || '';

    // ... Populate other test item fields ...

    // Populate test actions
    const testActionsContainer = testItemClone.querySelector('.test-actions-container');
    const testActionsData = testItemData.test_actions || [];
    for (const testActionData of testActionsData) {
        addTestActionFromJSON(testActionData, testActionsContainer);
    }

    testItemsContainer.appendChild(testItemClone);
}

function addTestActionFromJSON(testActionData, parentContainer) {
    const testActionTemplate = document.querySelector('#test-action-template');
    const testActionClone = testActionTemplate.content.cloneNode(true);
    const testActionIndex = parentContainer.children.length + 1;
    testActionClone.querySelector('.test-action-index').textContent = testActionIndex;

     // Populate test action fields from JSON data
     const actionTypeSelect = testActionClone.querySelector('.action-type-input');
     actionTypeSelect.value = testActionData.action_type || 'select_action_type'; // Set default value if not provided
 
     // Trigger the 'change' event to populate the Action Name dropdown based on the selected Action Type
     actionTypeSelect.dispatchEvent(new Event('change'));
 
     const actionNameSelect = testActionClone.querySelector('.action-name-input');
     actionNameSelect.value = testActionData.action_name || 'select_action_name'; // Set default value if not provided

    // Populate configuration parameters
    const configParamsContainer = testActionClone.querySelector('.config-params-container');
    const configParamsData = testActionData.action_config || {};
    for (const paramName in configParamsData) {
        const paramValue = configParamsData[paramName];
        addConfigParamFromJSON(paramName, paramValue, configParamsContainer);
    }

    parentContainer.appendChild(testActionClone);
}

function addConfigParamFromJSON(paramName, paramValue, parentContainer) {
    const configParamTemplate = document.querySelector('#config-param-template');
    const configParamClone = configParamTemplate.content.cloneNode(true);

    // Populate configuration parameter fields from JSON data
    const paramNameInput = configParamClone.querySelector('.config-param-name-input');
    paramNameInput.value = paramName || '';

    const paramValueInput = configParamClone.querySelector('.config-param-value-input');
    paramValueInput.value = paramValue || '';

    parentContainer.appendChild(configParamClone);
}