document.addEventListener('DOMContentLoaded', () => {
    // Update the counter on the popup
    chrome.storage.local.get(['blockedCount'], (result) => {
        document.getElementById('leaks-blocked').innerText = result.blockedCount || 0;
    });
});

document.getElementById('reportBtn').addEventListener('click', () => {
    chrome.storage.local.get(['blockedCount'], (result) => {
        const count = result.blockedCount || 0;
        const timestamp = new Date().toLocaleString();
        
        // Create the report content
        const reportHtml = `
            <html>
            <head>
                <title>Spec-Check Security Report</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
                    .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
                    h1 { color: #0f172a; border-bottom: 2px solid #38bdf8; padding-bottom: 10px; }
                    .stat { font-size: 24px; font-weight: bold; color: #38bdf8; }
                    .footer { margin-top: 20px; font-size: 12px; color: #64748b; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Spec-Check Privacy Audit</h1>
                    <p><strong>Report Generated:</strong> ${timestamp}</p>
                    <p>This document summarizes the sensitive data intercepted by your local Spec-Check instance.</p>
                    <hr>
                    <p>Total Data Leaks Prevented: <span class="stat">${count}</span></p>
                    <ul>
                        <li>Email & Identity: Protected</li>
                        <li>API & Cloud Credentials: Protected</li>
                        <li>Financial Data Patterns: Protected</li>
                    </ul>
                    <p><em>Note: No data was sent to external servers. All scrubbing was performed locally on your device.</em></p>
                    <div class="footer">Spec-Check v1.0 | AI Privacy Guardian</div>
                </div>
            </body>
            </html>
        `;

        // Open the report in a new tab
        const blob = new Blob([reportHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const toggles = ['toggle-identity', 'toggle-secrets', 'toggle-network'];
    
    // 1. Load saved settings when popup opens
    chrome.storage.local.get(toggles, (result) => {
        toggles.forEach(id => {
            // Default to 'true' (ON) if no setting exists yet
            document.getElementById(id).checked = result[id] !== false;
        });
    });

    // 2. Save settings when a user flips a switch
    toggles.forEach(id => {
        document.getElementById(id).addEventListener('change', (e) => {
            chrome.storage.local.set({ [id]: e.target.checked });
        });
    });
});
