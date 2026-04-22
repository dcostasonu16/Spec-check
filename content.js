console.log("Spec-Check: Active and scanning...");

const privacyPatterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    studentID: /S\d{4,}/g 
};

// This function checks the text and applies the "Red Alert" style
function checkElement(el) {
    // We check both .value (for inputs) and .innerText (for fancy divs)
    const text = el.value || el.innerText || "";
    
    const hasEmail = privacyPatterns.email.test(text);
    const hasID = privacyPatterns.studentID.test(text);

    if (hasEmail || hasID) {
        el.style.backgroundColor = "#ffebee"; // Light red
        el.style.border = "2px solid #f44336"; // Red border
        console.warn("⚠️ Spec-Check: Sensitive data detected!");
    } else {
        // Only reset if we previously flagged it
        if (el.style.backgroundColor === "rgb(255, 235, 238)") {
            el.style.backgroundColor = "";
            el.style.border = "";
        }
    }
}

// THE MOTION SENSOR: This watches for ANY typing or changes in the DOM
const observer = new MutationObserver((mutations) => {
    // Find all possible text areas on the page
    const inputs = document.querySelectorAll('textarea, input, [contenteditable="true"], #prompt-textarea, .ql-editor');
    inputs.forEach(input => {
        checkElement(input);
        
        // Also attach a direct listener just in case
        if (!input.dataset.specCheckAttached) {
            input.addEventListener('input', () => checkElement(input));
            input.dataset.specCheckAttached = "true";
        }
    });
});

// Start watching the whole page
observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});
