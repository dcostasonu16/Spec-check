console.log("Spec-Check: Intelligent Scanning Active...");

const privacyPatterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    studentID: /S\d{4,}/g 
};

// 1. Create a "Warning Badge" that sits on the screen
const badge = document.createElement('div');
badge.id = 'spec-check-badge';
badge.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 15px;
    background: #f44336;
    color: white;
    border-radius: 8px;
    font-family: sans-serif;
    font-weight: bold;
    display: none;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;
document.body.appendChild(badge);

function checkElement(el) {
    const text = el.value || el.innerText || "";
    
    // Check for specific risks
    const foundEmail = text.match(privacyPatterns.email);
    const foundID = text.match(privacyPatterns.studentID);

    if (foundEmail || foundID) {
        el.style.backgroundColor = "#ffebee";
        el.style.border = "2px solid #f44336";
        
        // Update the badge text
        let message = "⚠️ Privacy Risk: ";
        if (foundEmail) message += "Email detected. ";
        if (foundID) message += "Student ID detected. ";
        
        badge.innerText = message;
        badge.style.display = "block";
    } else {
        el.style.backgroundColor = "";
        el.style.border = "";
        badge.style.display = "none";
    }
}

// THE MOTION SENSOR: Watching for changes
const observer = new MutationObserver(() => {
    const inputs = document.querySelectorAll('textarea, input, [contenteditable="true"], #prompt-textarea');
    inputs.forEach(input => {
        checkElement(input);
        if (!input.dataset.specCheckAttached) {
            input.addEventListener('input', () => checkElement(input));
            input.dataset.specCheckAttached = "true";
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true, characterData: true });
