console.log("Spec-Check is now active and protecting your data.");

// These are "Regex" patterns. They tell the computer what an email or ID looks like.
const privacyPatterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    // Change the pattern below to match your school's ID format! 
    // This one looks for a capital S followed by 4 or more numbers (e.g., S12345)
    studentID: /S\d{4,}/g 
};

// This function scans the text area
function scanForPrivacy(element) {
    const text = element.value || element.innerText;
    
    let foundRisk = false;
    if (privacyPatterns.email.test(text) || privacyPatterns.studentID.test(text)) {
        foundRisk = true;
    }

    if (foundRisk) {
        // Change the border to red to warn the student
        element.style.border = "3px solid #ff4d4d";
        element.style.backgroundColor = "#fff2f2";
    } else {
        // Reset to normal if no risk is found
        element.style.border = "";
        element.style.backgroundColor = "";
    }
}

// This "Event Listener" triggers every time you type a character
document.addEventListener('input', (event) => {
    // Only scan if we are typing in a text box or input field
    if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT' || event.target.isContentEditable) {
        scanForPrivacy(event.target);
    }
});
