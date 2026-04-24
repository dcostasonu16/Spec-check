console.log("Spec-Check: Technical Shield Active...");

// 1. The Pattern Library
const privacyPatterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    studentID: /S\d{4,}/g,
    phone: /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    apiKey: /(?:sk-|AIza|ghp_|sq0csp-)[a-zA-Z0-9]{16,}/g,
    ipv4: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
};

// 2. The "Invincible" Shadow DOM Setup
let container = document.getElementById('spec-check-container');
if (!container) {
    container = document.createElement('div');
    container.id = 'spec-check-container';
    document.documentElement.appendChild(container);
}

const shadow = container.attachShadow({mode: 'open'});
const badge = document.createElement('div');
badge.id = 'spec-check-badge';

// Modern UI Styling for the Badge Container
badge.style = `
    position: fixed !important; 
    bottom: 30px !important; 
    right: 30px !important; 
    z-index: 2147483647 !important; 
    padding: 16px; 
    background: #ef4444; 
    color: white; 
    border-radius: 14px; 
    font-family: 'Inter', -apple-system, sans-serif; 
    display: none; 
    box-shadow: 0 10px 40px rgba(0,0,0,0.5); 
    flex-direction: column;
    gap: 12px;
    align-items: center;
    border: 1px solid rgba(255,255,255,0.2);
    min-width: 200px;
`;
shadow.appendChild(badge);

// Sticky CSS for Red Box highlights
const style = document.createElement('style');
style.innerHTML = `
    .spec-check-danger {
        border: 2px solid #ef4444 !important;
        background-color: #fff5f5 !important;
    }
`;
document.head.appendChild(style);

// 3. The Scrubber (Action)
function scrubData(target) {
    chrome.storage.local.get(['toggle-identity', 'toggle-secrets', 'toggle-network', 'blockedCount'], (result) => {
        let text = target.value || target.innerText || "";
        let cleanText = text;
        let foundThisTime = 0;

        const checkAndCount = (pattern, toggleKey) => {
            if (result[toggleKey] !== false) {
                const matches = text.match(pattern);
                if (matches) foundThisTime += matches.length;
            }
        };

        checkAndCount(privacyPatterns.email, 'toggle-identity');
        checkAndCount(privacyPatterns.studentID, 'toggle-identity');
        checkAndCount(privacyPatterns.phone, 'toggle-identity');
        checkAndCount(privacyPatterns.apiKey, 'toggle-secrets');
        checkAndCount(privacyPatterns.ipv4, 'toggle-network');

        if (result['toggle-identity'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.email, "[PROTECTED_EMAIL]");
            cleanText = cleanText.replace(privacyPatterns.studentID, "[PROTECTED_ID]");
            cleanText = cleanText.replace(privacyPatterns.phone, "[PROTECTED_PHONE]");
        }
        if (result['toggle-secrets'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.apiKey, "[SECRET_API_KEY]");
        }
        if (result['toggle-network'] !== false) {
            cleanText = cleanText.replace(privacyPatterns.ipv4, "[INTERNAL_IP]");
        }

        if (target.value !== undefined) target.value = cleanText;
        else target.innerText = cleanText;

        const newTotal = (result.blockedCount || 0) + foundThisTime;
        chrome.storage.local.set({ 'blockedCount': newTotal });

        // Success UI Feedback
        badge.style.background = "#22c55e";
        badge.innerHTML = `<div style="font-weight: bold;">🛡️ ${foundThisTime} Items Secured!</div>`;
        setTimeout(() => { badge.style.display = "none"; }, 2000);
    });
}

// 4. Fixed Detection Logic
function checkElement(el) {
    const text = el.value || el.innerText || "";
    
    chrome.storage.local.get(['toggle-identity', 'toggle-secrets', 'toggle-network'], (settings) => {
        let activeRisks = [];

        if (settings['toggle-identity'] !== false) {
            if (text.match(privacyPatterns.email)) activeRisks.push("Email");
            if (text.match(privacyPatterns.studentID)) activeRisks.push("ID");
            if (text.match(privacyPatterns.phone)) activeRisks.push("Phone");
        }
        if (settings['toggle-secrets'] !== false) {
            if (text.match(privacyPatterns.apiKey)) activeRisks.push("API Key");
        }
        if (settings['toggle-network'] !== false) {
            if (text.match(privacyPatterns.ipv4)) activeRisks.push("IP");
        }

        if (activeRisks.length > 0) {
            el.classList.add('spec-check-danger');
            
            // Generate content with the Green Redact Button
            badge.style.background = "#ef4444";
            badge.innerHTML = `
                <div style="font-weight: 600; font-size: 13px; text-align: center; line-height: 1.4;">
                    ⚠️ Risk: ${activeRisks.join(", ")} Detected
                </div>
                <button id="redact-now-btn" style="
                    background: #22c55e; 
                    color: white; 
                    border: none; 
                    padding: 10px 16px; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    cursor: pointer;
                    width: 100%;
                    font-family: sans-serif;
                    font-size: 13px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    transition: transform 0.1s;
                ">Redact Private Info Now 🛡️</button>
            `;
            
            badge.style.display = "flex";

            // Attach click to the button
            const btn = shadow.getElementById('redact-now-btn');
            if (btn) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    scrubData(el);
                };
                // Adding a tiny click effect
                btn.onmousedown = () => btn.style.transform = "scale(0.95)";
                btn.onmouseup = () => btn.style.transform = "scale(1)";
            }

        } else {
            el.classList.remove('spec-check-danger');
            badge.style.display = "none";
        }
    });
}

// 5. The "High-Response" Observer
const observer = new MutationObserver(() => {
    const inputs = document.querySelectorAll('textarea, input, [contenteditable="true"], #prompt-textarea, .ProseMirror');
    
    inputs.forEach(input => {
        checkElement(input);
        if (!input.dataset.specCheckAttached) {
            input.addEventListener('input', () => checkElement(input));
            input.addEventListener('click', () => checkElement(input));
            input.dataset.specCheckAttached = "true";
        }
    });

    if (!document.getElementById('spec-check-container')) {
        document.documentElement.appendChild(container);
    }
});

observer.observe(document.documentElement, { 
    childList: true, 
    subtree: true, 
    characterData: true 
});
