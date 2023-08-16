function encrypt() {
    var text = document.getElementById("text").value;
    if (!text) {
        alert("Text field cannot be empty");
        return;
    }
    var secretKey = "ThisIsASecretKey";
    var key = CryptoJS.enc.Utf8.parse(secretKey);

    var cipher = CryptoJS.AES.encrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    // Display the encrypted string
    document.getElementById("result").value = cipher.ciphertext.toString(CryptoJS.enc.Base64);

    var copyButton = document.getElementById("copyButton");
    copyButton.style.display = "inline-block";
}

function copyToClipboard() {
    var copyText = document.getElementById("result");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    alert("Encrypted text copied to clipboard!");
}