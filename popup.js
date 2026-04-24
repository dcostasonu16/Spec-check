document.addEventListener('DOMContentLoaded', () => {
    // 1. Load the Stats (Blocked Counter)
    chrome.storage.local.get(['blockedCount'], (result) => {
        const countElement = document.getElementById('leaks-blocked');
        const total = result.blockedCount || 0;
        animateValue(countElement, 0, total, 1000);
    });

    // 2. Manage Toggles (Settings)
    const toggles = ['toggle-identity', 'toggle-secrets', 'toggle-network'];
    
    chrome.storage.local.get(toggles, (result) => {
        toggles.forEach(id => {
            const checkbox = document.getElementById(id);
            // Default to 'true' if no setting exists yet
            checkbox.checked = result[id] !== false;

            // Save setting when changed
            checkbox.addEventListener('change', (e) => {
                chrome.storage.local.set({ [id]: e.target.checked });
            });
        });
    });

    // 3. Generate Report
    document.getElementById('reportBtn').addEventListener('click', () => {
        chrome.storage.local.get(['blockedCount'], (result) => {
            const count = result.blockedCount || 0;
            const timestamp = new Date().toLocaleString();
            
            const reportHtml = `
                <html>
                <head>
                    <title>PromptArmor Security Audit</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #f8fafc; background: #0f172a; }
                        .card { 
                            background: rgba(30, 41, 59, 0.7); 
                            padding: 40px; 
                            border-radius: 20px; 
                            border: 1px solid rgba(255,255,255,0.1);
                            max-width: 600px; 
                            margin: auto; 
                            backdrop-filter: blur(10px);
                        }
                        h1 { 
                            background: linear-gradient(135deg, #4f46e5, #8b5cf6);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            border-bottom: 1px solid #334155; 
                            padding-bottom: 15px; 
                        }
                        .stat-box { background: #1e293b; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
                        .stat { font-size: 48px; font-weight: bold; color: #8b5cf6; }
                        ul { line-height: 1.8; color: #94a3b8; }
                        .footer { margin-top: 30px; font-size: 11px; color: #64748b; text-align: center; }
                        strong { color: #fff; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>PromptArmor Privacy Audit</h1>
                        <p><strong>Report Generated:</strong> ${timestamp}</p>
                        <p>This document verifies the sensitive data points intercepted locally by the PromptArmor engine.</p>
                        
                        <div class="stat-box">
                            <div class="stat">${count}</div>
                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Leaks Prevented</div>
                        </div>

                        <ul>
                            <li><strong>Identity:</strong> Emails, Student IDs, and <strong>Phone Numbers</strong> secured.</li>
                            <li><strong>Credentials:</strong> API Keys and Cloud Tokens redacted.</li>
                            <li><strong>Network:</strong> Infrastructure IP addresses masked.</li>
                        </ul>
                        
                        <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #334155; pt-15px;">
                            <em>Compliance Note: No data was sent to external servers. All scrubbing was performed locally via Manifest V3 architecture.</em>
                        </p>
                        <div class="footer">PromptArmor v1.0 | AI Privacy Guardian</div>
                    </div>
                </body>
                </html>
            `;

            const blob = new Blob([reportHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url);
        });
    });
});

// Counter Animation
function animateValue(obj, start, end, duration) {
    if (start === end) {
        obj.innerHTML = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
