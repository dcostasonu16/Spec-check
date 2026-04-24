# PromptArmor: AI Privacy Guardian
A browser extension that uses NLP to scan a user’s prompt before it’s sent to an LLM. It flags names, addresses, or sensitive school IDs.

---

### High-Level Overview
In an era where Generative AI is a daily tool for education and work, we often forget that our prompts are not inherently private. **PromptArmor** is a browser-integrated security shield that acts as a real-time "firewall" for your thoughts. 

Before your data ever reaches the servers of ChatGPT, Gemini, or Claude, PromptArmor scans your input for sensitive information—like emails, IDs, phone numbers, and API keys. It gives you a "one-click" option to redact that data, ensuring you get the benefits of AI without the risk of a permanent data leak.

---

### Why we built this
AI is a transformative tool, but it has a significant "privacy gap." Many users accidentally paste sensitive information—school IDs, personal contact info, or private code keys—into AI prompts without realizing that this data may be stored or used for model training. 

This project was born out of a desire to build a zero-knowledge solution. Instead of relying on expensive enterprise software, PromptArmor is a lightweight, accessible tool that empowers individuals to be "Privacy-First" by stopping leaks right at the keyboard level.

---

### Visuals & Interface
The PromptArmor UI utilizes a dark slate palette with indigo and violet accents to provide a professional, trustworthy environment.

**Features included:**
**Detection Badge:** A floating alert that appears in the corner of AI textboxes when a privacy risk is detected.
**One-Click Redact:** A prominent button that instantly replaces sensitive strings with secure placeholders.
**Privacy Dashboard:** A clean, static popup tracking real-time stats of secured data points.
**Security Audit:** A professional HTML report generated locally to summarize your session's protection.

---

### Setup & Installation
PromptArmor is built on **Chrome Manifest V3**, the latest and most secure standard for browser extensions. No external dependencies are required.

1. **Download the Project:** Clone this repository or download the `.zip file` and extract it.
2. **Open Chrome Extensions:** In your browser, go to `chrome://extensions/`.
3. **Enable Developer Mode:** Toggle the switch in the top-right corner to ON.
4. **Load the Extension:** Click the "Load unpacked" button in the top-left.
5. **Select Folder:** Choose the folder containing the manifest.json and the project files.
6. **Pin for Safety:** Click the puzzle icon in your toolbar and pin PromptArmor for easy access.

---

### How to Test
Navigate to [ChatGPT](https://chatgpt.com), [Gemini](https://gemini.google.com), or [Claude](https://claude.ai) to verify the shield:

* **Identity Check:** Type a sample email (e.g., `user@example.com`) or a sample phone number. The alert badge will appear instantly.
* **Redaction:** Click the redact button to see the text instantly change to secure placeholders like `[PROTECTED_EMAIL]`.
* **Settings Control:** Open the extension popup to toggle specific categories (Identity, API, Network) on or off.
* **Audit Report:** Click "Generate Security Report" to view a summary of your local protection stats in a new tab.

---

### Known Issues & Roadmap
* **Performance:** Processing extremely large blocks of text (5,000+ words) may experience a minor delay during the initial scan.
* **Roadmap:** Integration of a local NLP model to identify sensitive context beyond simple string matching.
* **Roadmap:** Support for specific regional education portal ID formats.

---

### Technical Stack
* **Core Engine:** JavaScript (ES6) utilizing the MutationObserver API for real-time DOM monitoring.
* **UI/UX:** HTML5 and CSS3.
* **Security Architecture:** Manifest V3 with Shadow DOM encapsulation to ensure UI stability and prevent website interference.
* **Privacy:** 100% local processing; no data is ever transmitted to external servers.

---

### Ethical AI & SDGs
PromptArmor is designed with the **UN Sustainable Development Goals** in mind, specifically:
* **SDG 4 (Quality Education):** Enabling students to use AI tools safely without compromising their digital privacy.
* **SDG 9 (Industry, Innovation, and Infrastructure):** Building secure and resilient digital infrastructure for the AI era.
