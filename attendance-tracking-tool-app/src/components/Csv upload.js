//This is the JavaScript code that allows users to upload a CSV file
document.getElementById("file-upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById("file-name").textContent = `Selected File: ${file.name}`;
    }
});