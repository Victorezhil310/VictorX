# Victor — Every Model, One Dock ⚓

**Victor** is a modern, web-based model registry, execution dock, and interactive AI playground. It indexes artificial intelligence models across **Ollama**, **Hugging Face**, **Meta**, **Mistral AI**, **Google**, **Together AI**, and **OpenRouter**, letting developers search, compare, pull weights, configure API keys, and run live inference right from one unified interface.

![Victor Dock Preview](https://img.shields.io/badge/Victor-v1.0.0-F0A93D?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-4FD1C5?style=for-the-badge)

---

## ⚡ Key Features

- 👤 **Real User Session & Authentication**: Instant user sign in / sign up with persistent local profile storage and personal dock library (`localStorage`).
- 🔑 **API Key Integration & Settings**: Securely connect **OpenRouter**, **OpenAI**, **Google Gemini**, and local **Ollama** backends (`http://localhost:11434`).
- 📥 **Interactive Pull & Installer**: Pull model manifests, track real download layer progress, and save models directly to **My Dock**.
- 💬 **Live AI Playground**: Interactive chat playground with live API response streaming (OpenRouter / OpenAI / Ollama) or model-aware inference simulation.
- 💻 **Multi-Language Code Snippet Generator**: 1-Click code generation for **CLI**, **Python**, **JavaScript**, and **cURL**.
- 🎨 **Sleek Modern Glassmorphism UI**: High contrast dark theme built with Space Grotesk, JetBrains Mono, smooth animations, and typewriter interactive terminal.

---

## 🚀 Quick Start (Local Setup)

No server build required! Victor is built with vanilla HTML5, CSS3, and modern JavaScript.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/VictorX.git
   cd VictorX
   ```

2. **Run locally**:
   - Open `index.html` directly in your browser.
   - Or serve with any static server:
     ```bash
     npx serve .
     ```
     or Python:
     ```bash
     python -m http.server 8000
     ```

---

## ⚓ Usage Guide

### 1. Account & API Key Setup
- Click **"Sign In"** in the topbar to log in with your developer username.
- Click **"API Keys"** in the top bar to enter your OpenRouter or OpenAI API key.

### 2. Pulling Models to Your Dock
- Browse **The Manifest** on the main page.
- Click **"Pull to dock"** on any model card (e.g. *DeepSeek R1*, *Llama 3.3*, *Mistral 7B*).
- Click **"Pull to My Dock"** in the modal to watch the installer run and save it to your workspace.

### 3. Running Live Inference in AI Playground
- Click **"Playground"** in the top navigation bar or click **"⚡ Launch Playground"** on any docked model.
- Type prompts to chat with models in real-time!

---

## 🛠️ Project Structure

```
VictorX/
├── index.html     # Semantic HTML5 layout, auth modals, playground drawer, and registry structure
├── styles.css     # Glassmorphism dark mode styling, Space Grotesk fonts, animations
├── script.js     # User session auth, API key manager, installer simulation, and playground engine
├── .gitignore     # Git exclusion settings
└── README.md      # Comprehensive technical documentation
```

---

## 📄 License

MIT License. Designed and built with ❤️ for AI developers.
