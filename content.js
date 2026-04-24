console.log("Spec-Check: Technical Shield Active...");

// 1. The Pattern Library
const privacyPatterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    studentID: /S\d{4,}/g,
    phone: /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    apiKey: /(?:sk-|AIza|ghp_|sq0csp-)[a-zA-Z0-9]{16,}/g,
    ipv4: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
};

// 2. Create the Badge/Pill UI
const badge = document.createElement('div');
badge.id = 'spec-check-badge';
badge.style = `
    position: fixed !important; 
    bottom: 30px !important; 
    right: 30px !important; 
    z-index: 2147483647 !important; /* Maximum possible z-index */
    padding: 12px 18px; 
    background: #ef4444; 
    color: white;
    border-radius: 12px; 
    font-family: sans-serif; 
    font-weight: bold;
    display: none; 
    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    border: 2px solid rgba(255,255,255,0.3); 
    cursor: pointer;
    pointer-events: auto !important;
`;
// Ensure the badge is always the last child of the body
if (!document.getElementById('spec-check-badge')) {
    document.body.appendChild(badge);
}

// 3. The Scrubber (Action)
function scrubData(target) {
    chrome.storage.local.get(['toggle-identity', 'toggle-secrets', 'toggle-network', 'blockedCount'], (result) => {
        let text = target.value || target.innerText || "";
        let cleanText = text;
        let foundThisTime = 0;

        // 1. Identify and count occurrences before replacing
        const checkAndCount = (pattern, toggleKey) => {
            if (result[toggleKey] !== false) {
                const matches = text.match(pattern);
                if (matches) {
                    foundThisTime += matches.length;
                    return true;
                }
            }
            return false;
        };

        // Run checks for counting
        checkAndCount(privacyPatterns.email, 'toggle-identity');
        checkAndCount(privacyPatterns.studentID, 'toggle-identity');
        checkAndCount(privacyPatterns.phone, 'toggle-identity');
        checkAndCount(privacyPatterns.apiKey, 'toggle-secrets');
        checkAndCount(privacyPatterns.ipv4, 'toggle-network');

        // 2. Perform the actual replacement
        if (result['toggle-identity'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.email, "[PROTECTED_EMAIL]");
            cleanText = cleanText.replace(privacyPatterns.studentID, "[PROTECTED_ID]");
            cleanText = cleanText.replace(privacyPatterns.phone, "[PROTECTED_PHONE]");
        }
        if (result['toggle-secrets'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.apiKey, "[SECRET_API_KEY]");
        }
        if (settings['toggle-network'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.ipv4, "[INTERNAL_IP]");
        }

        // 3. Update the UI and the permanent "Blocked" counter
        if (target.value !== undefined) target.value = cleanText;
        else target.innerText = cleanText;

        const newTotal = (result.blockedCount || 0) + foundThisTime;
        chrome.storage.local.set({ 'blockedCount': newTotal });

        badge.style.background = "#22c55e";
        badge.innerText = `${foundThisTime} Items Secured!`;
        setTimeout(() => { badge.style.display = "none"; }, 2000);
    });
}

// 4. Fixed Detection Logic
// 1. Add Sticky CSS to the page header
const style = document.createElement('style');
style.innerHTML = `
    .spec-check-danger {
        border: 2px solid #ef4444 !important;
        background-color: #fff5f5 !important;
    }
    #spec-check-badge {
        position: fixed; bottom: 20px; right: 20px; z-index: 10000;
        padding: 12px 18px; background: #ef4444; color: white;
        border-radius: 12px; font-family: sans-serif; font-weight: bold;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4); cursor: pointer;
    }
`;
document.head.appendChild(style);

function checkElement(el) {
    const text = el.value || el.innerText || "";
    
    chrome.storage.local.get(['toggle-identity', 'toggle-secrets', 'toggle-network'], (settings) => {
        let activeRisks = [];

        if (settings['toggle-identity'] !== false) {
            if (text.match(privacyPatterns.email)) activeRisks.push("email");
            if (text.match(privacyPatterns.studentID)) activeRisks.push("studentID");
            if (text.match(privacyPatterns.phone)) activeRisks.push("phone");
        }
        if (settings['toggle-secrets'] !== false) {
            if (text.match(privacyPatterns.apiKey)) activeRisks.push("apiKey");
        }
        if (settings['toggle-network'] !== false) {
            if (text.match(privacyPatterns.ipv4)) activeRisks.push("ipv4");
        }

        if (activeRisks.length > 0) {
            // Apply the sticky CSS class instead of manual styles
            el.classList.add('spec-check-danger');
            badge.innerText = `⚠️ Risk Found: ${activeRisks.join(", ")}`;
            badge.style.display = "block";
            badge.onclick = () => scrubData(el);
        } else {
            // Remove the sticky class
            el.classList.remove('spec-check-danger');
            badge.style.display = "none";
        }
    });
}

// 5. The Observer (With a "Glitch Filter")
let timeout = null;
const observer = new MutationObserver(() => {
    const inputs = document.querySelectorAll('textarea, input, [contenteditable="true"], #prompt-textarea, .ProseMirror');
    
    inputs.forEach(input => {
        // Prevent the "glitch" by waiting for the user to stop typing for 100ms
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            checkElement(input);
        }, 100);

        if (!input.dataset.specCheckAttached) {
            input.addEventListener('input', () => checkElement(input));
            input.dataset.specCheckAttached = "true";
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
