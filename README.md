# 🔒 AutoSecure GitHub App

> Automatically fixes vulnerable dependencies by listening to GitHub Dependabot alerts, updating the affected package to the first patched version, and creating a Pull Request for review.

## 📖 Overview

AutoSecure is a GitHub App built with **Node.js** and **Express.js** that automates dependency security updates.

When GitHub Dependabot detects a vulnerable dependency, AutoSecure:

- Receives the `dependabot_alert` webhook
- Verifies the webhook signature for security
- Authenticates as a GitHub App
- Retrieves vulnerability details
- Finds the first patched version
- Creates a new branch
- Updates the dependency in `package.json`
- Commits the changes
- Opens a Pull Request automatically

This removes the manual effort of preparing security update PRs and speeds up vulnerability remediation.

---

# ✨ Features

- 🔒 Secure GitHub Webhook verification
- 🤖 GitHub App authentication
- 📦 Automatic dependency upgrades
- 🌿 Automatic branch creation
- 💾 Automatic commit generation
- 🔁 Automatic Pull Request creation
- ⚡ Uses GitHub Installation Tokens (No Personal Access Token required)
- 🛡️ Works directly with GitHub Dependabot Alerts

---

# 🛠 Tech Stack

- Node.js
- Express.js
- GitHub Apps
- GitHub Webhooks
- GitHub REST API
- Octokit
- dotenv

---

# ⚙️ Workflow

```text
Dependabot detects vulnerability
            │
            ▼
 GitHub sends webhook event
            │
            ▼
    AutoSecure receives alert
            │
            ▼
    Verify webhook signature
            │
            ▼
 Authenticate as GitHub App
            │
            ▼
 Fetch vulnerability details
            │
            ▼
 Read package.json
            │
            ▼
 Update vulnerable dependency
            │
            ▼
 Create new branch
            │
            ▼
 Commit updated package.json
            │
            ▼
 Create Pull Request
            │
            ▼
 Developer reviews & merges
```

---

# 📁 Project Structure

```
auto-secure-github/
│
├── index.js
├── package.json
├── .env
├── README.md
└── private-key.pem (optional)
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/auto-secure-github.git
```

Go into the project

```bash
cd auto-secure-github
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
APP_ID=YOUR_APP_ID

WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

GITHUB_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY
-----END PRIVATE KEY-----"

PORT=3000
```

Start the server

```bash
npm start
```

or

```bash
node index.js
```

---

# 🔐 Required GitHub App Permissions

### Repository Permissions

| Permission | Access |
|------------|--------|
| Contents | Read & Write |
| Pull Requests | Read & Write |
| Dependabot Alerts | Read |
| Metadata | Read |

### Webhook Events

- Installation
- Dependabot Alert

---

# 📌 Example

### Dependabot Alert

```
Package:
express

Severity:
High

Patched Version:
4.21.2
```

↓

AutoSecure automatically creates

```
Branch:
auto-fix-express-17234982
```

↓

Updates

```json
{
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

↓

Creates commit

```
fix: auto-upgrade express to 4.21.2
```

↓

Creates Pull Request

```
🔒 Auto Security Fix: Upgrade express to 4.21.2
```

---

# 📷 How It Works

1. GitHub Dependabot detects a vulnerable package.
2. GitHub sends a `dependabot_alert` webhook.
3. AutoSecure verifies the webhook signature.
4. Authenticates as a GitHub App.
5. Retrieves vulnerability details.
6. Creates a new branch from the default branch.
7. Updates the vulnerable dependency.
8. Commits the updated `package.json`.
9. Opens a Pull Request containing the security fix.

---

# 🔮 Future Improvements

- AI-generated PR summaries
- Automatic lock file updates
- Support for Yarn, PNPM and Bun
- Python dependency support
- Maven and Gradle support
- Slack/Discord notifications
- Automatic merge after successful CI
- Dashboard for vulnerability tracking
- Risk scoring and prioritization

---

# 👨‍💻 Author

**Rajshekhar Prasad Saxena**

If you found this project useful, consider giving it a ⭐ on GitHub!
