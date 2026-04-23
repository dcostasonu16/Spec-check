console.log("Spec-Check: Advanced Cyber-Shield Active...");

const privacyPatterns = {
    // Basic PII
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    studentID: /S\d{4,}/g,
    phone: /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,

    // High-Value Cybersecurity Targets
    apiKey: /(?:sk-|AIza|ghp_|sq0csp-)[a-zA-Z0-9]{16,}/g,
    ipv4: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g 
};

// 1. Create the UI Badge
const badge = document.createElement('div');
badge.id = 'spec-check-badge';
badge.style = `
    position: fixed; bottom: 20px; right: 20px; z-index: 9999;
    padding: 12px 18px; background: #38bdf8; color: #0f172a;
    border-radius: 12px; font-family: sans-serif; font-weight: bold;
    display: none; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
`;
document.body.appendChild(badge);

// 2. The "Scrubber" Function (The Fixer)
function scrubData(target) {
    let text = target.value || target.innerText || "";
    
    let cleanText = text
        .replace(privacyPatterns.email, "[PROTECTED_EMAIL]")
        .replace(privacyPatterns.studentID, "[PROTECTED_ID]")
        .replace(privacyPatterns.phone, "[PROTECTED_PHONE]")
        .replace(privacyPatterns.apiKey, "[SECRET_API_KEY]")
        .replace(privacyPatterns.ipv4, "[INTERNAL_IP]")
        .replace(privacyPatterns.creditCard, "[FINANCIAL_DATA]");

    if (target.value !== undefined) target.value = cleanText;
    else target.innerText = cleanText;

    // Visual Feedback
    badge.style.background = "#22c55e";
    badge.innerText = "🛡️ Data Secured!";
    setTimeout(() => { badge.style.display = "none"; }, 2000);
}

// 3. The "Detection" Function (The Monitor)
function checkElement(el) {
    const text = el.value || el.innerText || "";
    
    // Check all patterns to see if ANY match
    const risksFound = Object.keys(privacyPatterns).filter(key => 
        text.match(privacyPatterns[key])
    );

    if (risksFound.length > 0) {
        el.style.border = "2px solid #38bdf8";
        
        // Show what we found
        badge.innerText = `⚠️ Risk Found: ${risksFound.join(", ")}`;
        badge.style.display = "block";
        badge.style.background = "#38bdf8"; // Reset color to blue
        badge.onclick = () => scrubData(el);
    } else {
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
