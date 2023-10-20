function updateConfigFields() {
    const actionType = document.getElementById('action_type').value;
    const actionName = document.getElementById('action_name').value;
    const configFields = document.getElementById('configFields');
    configFields.innerHTML = ''; // Clear previous fields

    if (actionType === "ui" && actionName === "ui_appian_action") {
        configFields.innerHTML = `
            <div>
                <label>Method Name:</label>
                <select id="method_name" onchange="updateMethodConfig()">
                    <option value="loginWithUsernameAndPassword">loginWithUsernameAndPassword</option>
                    <option value="clickOnButton">clickOnButton</option>
                    <option value="populateFieldWithValue">populateFieldWithValue</option>
                    <option value="populateFieldWith">populateFieldWith</option>
                    <option value="waitForProgressBar">waitForProgressBar</option>
                    <option value="waitForSeconds">waitForSeconds</option>
                    <option value="populateRecordTypeUserFilterWith">populateRecordTypeUserFilterWith</option>
                    <option value="logout">logout</option>
                    <option value="tearDown">tearDown</option>
                    <option value="refresh">refresh</option>
                    <option value="clickOnCheckboxOption">clickOnCheckboxOption</option>
                    <option value="clickOnRadioOption">clickOnRadioOption</option>
                    <option value="clickOnRecordGridNavigation">clickOnRecordGridNavigation</option>
                    <option value="openUserProfile">openUserProfile</option>
                </select>
            </div>
            <div>
                <label>Method Argument:</label>
                <input type="text" id="method_argument">
            </div>
            <div>
                <label>Method Type:</label>
                <input type="text" id="method_type" value="void" readonly>
            </div>
        `;

        updateMethodConfig(); // Initial setup

    } else if (actionType === "ui" && actionName === "ui_appian_open_browser") {
        configFields.innerHTML = `
            <div>
                <label>Browser Name</label>
                <select id="browser_name">
                    <option value="chrome">Chrome</option>
                    <option value="edge">Edge</option>
                </select>
            </div>
            <div>
                <label>SSO Login</label>
                <select id="sso_login">
                    <option value="Yes">Yes</option>
                    <option value="No" selected>No</option>
                </select>
            </div>
            <div>
                <label>Browser Zoom</label>
                <input type="text" id="browser_zoom" value="1.0"></input>
            </div>
        `;
    }
}

function updateMethodConfig() {
    const methodName = document.getElementById('method_name').value;
    const methodArg = document.getElementById('method_argument');

    switch (methodName) {
        case 'loginWithUsernameAndPassword':
            methodArg.disabled = false;
            methodArg.placeholder = 'url|username|password';
            break;
        case 'clickOnButton':
            methodArg.disabled = false;
            methodArg.placeholder = 'buttonName';
            break;
        case 'populateFieldWithValue':
            methodArg.disabled = false;
            methodArg.placeholder = 'fieldName|Value';
            break;
        case 'populateFieldWith':
            methodArg.disabled = false;
            methodArg.placeholder = 'fieldName|Value1,Value2,Value3';
            break;
        case 'waitForProgressBar':
            methodArg.disabled = true;
            methodArg.placeholder = '';
            methodArg.value = '';
            break;
        case 'waitForSeconds':
            methodArg.disabled = false;
            methodArg.placeholder = '5 (in seconds)';
            break;
        case 'populateRecordTypeUserFilterWith':
            methodArg.disabled = false;
            methodArg.placeholder = 'filterName|Value';
            break;
        case 'logout':
            methodArg.disabled = true;
            methodArg.placeholder = '';
            methodArg.value = '';
            break;
        case 'tearDown':
            methodArg.disabled = true;
            methodArg.placeholder = '';
            methodArg.value = '';
            break;
        case 'refresh':
            methodArg.disabled = true;
            methodArg.placeholder = '';
            methodArg.value = '';
            break;
        case 'clickOnCheckboxOption':
            methodArg.disabled = false;
            methodArg.placeholder = 'optionName';
            break;
        case 'clickOnRadioOption':
            methodArg.disabled = false;
            methodArg.placeholder = 'optionName';
            break;
        case 'clickOnRecordGridNavigation':
            methodArg.disabled = false;
            methodArg.placeholder = 'navOption (Navigation option can only be "First", "Previous", "Next", or "Last")';
            break;
        case 'openUserProfile':
            methodArg.disabled = true;
            methodArg.placeholder = '';
            methodArg.value = '';
            break;
    }
}

function generateJson() {
    const actionType = document.getElementById('action_type').value;
    const actionName = document.getElementById('action_name').value;
    let actionConfig = {};

    if (actionType === "ui" && actionName === "ui_appian_action") {
        actionConfig.method_name = document.getElementById('method_name').value;
        actionConfig.method_argument = document.getElementById('method_argument').value;
        actionConfig.method_type = document.getElementById('method_type').value;
    } else if (actionType === "ui" && actionName === "ui_appian_open_browser") {
        actionConfig.browser_name = document.getElementById('browser_name').value;
        actionConfig.sso_login = document.getElementById('sso_login').value;
        actionConfig.browser_zoom = document.getElementById('browser_zoom').value;
    }

    const output = {
        action_type: actionType,
        action_name: actionName,
        action_config: actionConfig
    };

    document.getElementById('jsonOutput').textContent = JSON.stringify(output, null, 4);
}

updateConfigFields(); // Call on page load

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