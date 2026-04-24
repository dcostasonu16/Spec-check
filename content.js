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
    position: fixed; bottom: 20px; right: 20px; z-index: 9999;
    padding: 12px 18px; background: #38bdf8; color: #0f172a;
    border-radius: 12px; font-family: sans-serif; font-weight: bold;
    display: none; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
`;
document.body.appendChild(badge);

// 3. The Scrubber (Action)
function scrubData(target) {
    chrome.storage.local.get(['toggle-identity', 'toggle-secrets', 'toggle-network'], (settings) => {
        let text = target.value || target.innerText || "";
        let cleanText = text;

        if (settings['toggle-identity'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.email, "[PROTECTED_EMAIL]");
            cleanText = cleanText.replace(privacyPatterns.studentID, "[PROTECTED_ID]");
            cleanText = cleanText.replace(privacyPatterns.phone, "[PROTECTED_PHONE]");
        }
        if (settings['toggle-secrets'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.apiKey, "[SECRET_API_KEY]");
        }
        if (settings['toggle-network'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.ipv4, "[INTERNAL_IP]");
        }

        if (target.value !== undefined) target.value = cleanText;
        else target.innerText = cleanText;

        badge.style.background = "#22c55e";
        badge.innerText = "Data Secured!";
        setTimeout(() => { badge.style.display = "none"; }, 2000);
    });
}

// 4. The Detection Logic (Where you add your code)
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
            el.style.border = "2px solid #38bdf8";
            // Optional: add a light tint so the user sees the box change
            el.style.backgroundColor = "#f0f9ff"; 
            
            badge.innerText = `Risk Found: ${activeRisks.join(", ")}`;
            badge.style.display = "block";
            badge.style.background = "#38bdf8"; 
            badge.onclick = () => scrubData(el);
        } else {
            el.style.border = "";
            el.style.backgroundColor = "";
            badge.style.display = "none";
        }
    });
}

// 5. The Observer (Watching for typing)
const observer = new MutationObserver(() => {
    const inputs = document.querySelectorAll('textarea, input, [contenteditable="true"], #prompt-textarea, .ProseMirror');
    inputs.forEach(input => {
        checkElement(input);
        if (!input.dataset.specCheckAttached) {
            input.addEventListener('input', () => checkElement(input));
            input.dataset.specCheckAttached = "true";
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true, characterData: true });
