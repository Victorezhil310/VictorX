/* ==========================================================================
   Victor Platform 2 — Emergent.sh & OpenArt.ai Unified Controller
   ========================================================================== */

let state = {
  activeView: "builder",
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"fastapi":"http://localhost:8000","ollama":"http://localhost:11434"}'),
  permissions: JSON.parse(localStorage.getItem("victor_permissions") || '{"localStorage":true,"confidential":true,"gpu":true}'),
  chats: JSON.parse(localStorage.getItem("victor_chat_history") || '[]'),
  currentChatId: null,
  dailyTokens: parseInt(localStorage.getItem("victor_daily_tokens") || "0"),
  maxDailyTokens: 50000,
  userStrikes: parseInt(localStorage.getItem("victor_user_strikes") || "0"),
  isBanned: localStorage.getItem("victor_is_banned") === "true",
  violationLogs: JSON.parse(localStorage.getItem("victor_violations") || '[]')
};

const PROHIBITED_KEYWORDS = ["bomb", "kill", "blood", "murder", "weapon", "terror", "explode", "poison", "violence", "harm"];

document.addEventListener("DOMContentLoaded", () => {
  purgeStaleBoilerplate();
  checkBanStatus();
  updateTokenDisplay();
  initParticleCanvas();
  initNavigation();
  initAppBuilderStudio();
  initOpenArtStudio();
  initModals();
  initChatStudio();
});

function saveState() {
  localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
  localStorage.setItem("victor_permissions", JSON.stringify(state.permissions));
  localStorage.setItem("victor_chat_history", JSON.stringify(state.chats));
  localStorage.setItem("victor_daily_tokens", state.dailyTokens.toString());
  localStorage.setItem("victor_user_strikes", state.userStrikes.toString());
  localStorage.setItem("victor_is_banned", state.isBanned.toString());
  localStorage.setItem("victor_violations", JSON.stringify(state.violationLogs));
}

function toast(msg, type = "info") {
  const container = document.getElementById("toast");
  if (!container) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerText = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

function checkBanStatus() {
  const modal = document.getElementById("bannedModal");
  if (!modal) return;
  if (state.isBanned) modal.classList.remove("hidden");
  else modal.classList.add("hidden");
}

function updateTokenDisplay() {
  const el = document.getElementById("tokenCountText");
  if (!el) return;
  const remaining = Math.max(0, state.maxDailyTokens - state.dailyTokens);
  el.innerText = `${remaining.toLocaleString()} / ${state.maxDailyTokens.toLocaleString()}`;
}

function purgeStaleBoilerplate() {
  if (state.chats && state.chats.length > 0) {
    state.chats.forEach(chat => {
      if (chat.messages) {
        chat.messages = chat.messages.filter(m => 
          !m.content.includes("I have processed your request for") &&
          !m.content.includes("Key Takeaway")
        );
      }
    });
    saveState();
  }
}

/* ==========================================================================
   1. PARTICLE CANVAS ANIMATION
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. TOP & SIDEBAR NAVIGATION
   ========================================================================== */
function initNavigation() {
  const navBtns = document.querySelectorAll(".nav-mode-btn");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      switchView(view);
    });
  });

  const toggleBtn = document.getElementById("toggleSidebarBtn");
  const sidebar = document.getElementById("mainSidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.style.display = sidebar.style.display === "none" ? "flex" : "none";
    });
  }
}

function switchView(viewName) {
  state.activeView = viewName;
  document.querySelectorAll(".nav-mode-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".platform-view").forEach(v => v.classList.remove("active"));

  const targetBtn = document.querySelector(`.nav-mode-btn[data-view="${viewName}"]`);
  const targetView = document.getElementById(`view-${viewName}`);

  if (targetBtn) targetBtn.classList.add("active");
  if (targetView) targetView.classList.add("active");
}

/* ==========================================================================
   3. EMERGENT.SH STYLE AI APP BUILDER & CODE EXPORT ENGINE
   ========================================================================== */
function initAppBuilderStudio() {
  const generateBtn = document.getElementById("generateAppBtn");
  const promptInput = document.getElementById("builderPromptInput");
  const typeTabs = document.querySelectorAll(".type-tab");

  typeTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      typeTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  if (generateBtn && promptInput) {
    generateBtn.addEventListener("click", () => {
      const prompt = promptInput.value.trim() || "Build me an e-commerce platform with WebRTC live stream...";
      synthesizeFullAppProject(prompt);
    });
  }

  document.querySelectorAll(".sug-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const prompt = pill.getAttribute("data-prompt");
      if (promptInput) promptInput.value = prompt;
      synthesizeFullAppProject(prompt);
    });
  });

  document.querySelectorAll(".download-code-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const appName = btn.getAttribute("data-app") || "victor-platform-2";
      downloadSourceCodePackage(appName);
    });
  });
}

function synthesizeFullAppProject(prompt) {
  toast(`🚀 Synthesizing Full-Stack App: "${prompt.substring(0, 30)}..."`, "info");

  const appsGrid = document.getElementById("myAppsGrid");
  if (!appsGrid) return;

  const appTitle = prompt.substring(0, 24) + "...";
  const newAppId = "app_" + Date.now();

  const card = document.createElement("div");
  card.className = "app-project-card";
  card.innerHTML = `
    <div class="card-thumbnail-preview">
        <div class="thumb-glow"></div>
        <div class="thumb-title">${escapeHtml(appTitle)}</div>
    </div>
    <div class="card-info-row">
        <div>
            <h4>${escapeHtml(appTitle)}</h4>
            <span class="sub-text">Just now • Complete Full-Stack Code</span>
        </div>
        <button class="download-code-btn" data-app="${newAppId}" onclick="downloadSourceCodePackage('${newAppId}')">📥 Export Code</button>
    </div>
  `;

  appsGrid.prepend(card);
  toast(`✔ Full-Stack Project '${appTitle}' Synthesized!`, "success");
}

function downloadSourceCodePackage(appName) {
  toast(`📥 Packaging ${appName} source files (.html, .py, .dart)...`, "info");
  
  const codeContent = `<!-- Victor Platform 2 Synthesized Full-Stack Package: ${appName} -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${appName} - Victor Platform 2</title>
    <style>body { background: #0a0d16; color: white; font-family: system-ui; text-align: center; padding: 3rem; }</style>
</head>
<body>
    <h1>🚀 ${appName} Live Application</h1>
    <p>Synthesized by Victor Platform 2 AI Engine.</p>
</body>
</html>`;

  const blob = new Blob([codeContent], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${appName}_source.html`;
  a.click();
  toast(`✔ ${appName}_source.html Downloaded!`, "success");
}

/* ==========================================================================
   4. OPENART.AI MULTIMODAL MEDIA STUDIO
   ========================================================================== */
function initOpenArtStudio() {
  const createBtn = document.getElementById("openartCreateBtn");
  const promptInput = document.getElementById("openartPrompt");
  const gallery = document.getElementById("openartGalleryGrid");

  if (createBtn) {
    createBtn.addEventListener("click", () => {
      const prompt = promptInput.value.trim() || "Kling 3.0 Motion Scene";
      toast("🎬 Rendering 4K Kling 3.0 Video...", "info");

      setTimeout(() => {
        if (gallery) {
          const item = document.createElement("div");
          item.className = "media-card-item";
          item.innerHTML = `
            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60" alt="Generated Video">
            <div class="media-overlay">
                <span>Kling 3.0 4K</span>
                <button class="download-media-btn" onclick="toast('Downloading HD Video...', 'success')">📥 Download</button>
            </div>
          `;
          gallery.prepend(item);
        }
        toast("✨ Kling 3.0 4K Video Rendered!", "success");
      }, 1200);
    });
  }
}

/* ==========================================================================
   5. PRIVATE ADMIN MODAL
   ========================================================================== */
function initModals() {
  const adminBtn = document.getElementById("openAdminModalBtn");
  const adminModal = document.getElementById("adminModal");
  const verifyAdminBtn = document.getElementById("verifyAdminPinBtn");
  const pinInput = document.getElementById("adminPinInput");
  const pinGate = document.getElementById("adminPinGate");
  const controlsPanel = document.getElementById("adminControlsPanel");
  const saveAdminBtn = document.getElementById("adminSaveSettingsBtn");

  if (adminBtn && adminModal) {
    adminBtn.addEventListener("click", () => adminModal.classList.remove("hidden"));
    adminModal.querySelectorAll('[data-close="adminModal"]').forEach(b => {
      b.addEventListener("click", () => adminModal.classList.add("hidden"));
    });
  }

  if (verifyAdminBtn && pinInput) {
    verifyAdminBtn.addEventListener("click", () => {
      const entered = pinInput.value.trim();
      if (btoa(entered) === "MjAwMzIwMDQ=") {
        state.adminAuthenticated = true;
        pinGate.classList.add("hidden");
        controlsPanel.classList.remove("hidden");
        toast("👑 Private Admin Panel Unlocked!", "success");
      } else {
        toast("Invalid Security PIN", "error");
      }
    });
  }

  if (saveAdminBtn) {
    saveAdminBtn.addEventListener("click", () => {
      state.keys.fastapi = document.getElementById("adminFastApiUrl").value;
      saveState();
      adminModal.classList.add("hidden");
      toast("Admin Directives Saved!", "success");
    });
  }
}

/* ==========================================================================
   6. CHAT STUDIO
   ========================================================================== */
function initChatStudio() {
  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("chatInput");

  if (sendBtn && input) {
    sendBtn.addEventListener("click", () => handleSendMessage());
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }

  if (state.chats.length === 0) {
    createNewChatSession("Session 1");
  } else {
    state.currentChatId = state.chats[0].id;
    renderCurrentChatMessages();
  }
}

function createNewChatSession(title = "New Session") {
  const newChat = {
    id: "chat_" + Date.now(), title: title, timestamp: new Date().toISOString(), messages: []
  };
  state.chats.unshift(newChat);
  state.currentChatId = newChat.id;
  saveState();
  renderCurrentChatMessages();
}

function renderCurrentChatMessages() {
  const msgList = document.getElementById("chatMessagesList");
  if (!msgList) return;
  const currentChat = state.chats.find(c => c.id === state.currentChatId);

  if (!currentChat || currentChat.messages.length === 0) {
    msgList.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-muted);">Start a new session...</div>`;
    return;
  }

  msgList.innerHTML = "";
  currentChat.messages.forEach(msg => {
    const msgEl = document.createElement("div");
    msgEl.className = `chat-msg ${msg.role}`;
    msgEl.innerHTML = `<div class="msg-avatar">${msg.role === 'user' ? 'VE' : 'VX'}</div><div class="msg-content"><div>${formatMarkdown(msg.content)}</div></div>`;
    msgList.appendChild(msgEl);
  });
}

async function handleSendMessage() {
  const input = document.getElementById("chatInput");
  if (!input) return;
  const prompt = input.value.trim();
  if (!prompt) return;

  const currentChat = state.chats.find(c => c.id === state.currentChatId);
  if (!currentChat) return;

  currentChat.messages.push({ role: "user", content: prompt, timestamp: new Date().toISOString() });
  input.value = "";
  renderCurrentChatMessages();

  const responseText = generateSmartAiResponse(prompt, currentChat.messages);
  currentChat.messages.push({ role: "assistant", content: responseText, timestamp: new Date().toISOString() });
  saveState();
  renderCurrentChatMessages();
}

function generateSmartAiResponse(prompt, history = []) {
  const raw = prompt.trim();
  const lower = raw.toLowerCase();

  if (lower.includes("yourname") || lower.includes("who are you")) {
    return `I am **Victor Platform 2**—India's premier AI App Builder & Multimodal Media Suite!`;
  }

  return `### ⚡ Victor Platform 2 Response\n\nI have processed your prompt **"${raw}"**.\n\nSynthesized project code and media ready!`;
}

function checkBackendHealth() { fetch(`${state.keys.fastapi}/health`).catch(() => {}); }

function escapeHtml(str) {
  return String(str || "").replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
}

let codeBlockCounter = 0;
window.codeBlockStorage = {};

document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("copy-code-inline")) {
    const blockId = e.target.getAttribute("data-blockid");
    const code = window.codeBlockStorage[blockId] || "";
    if (code) {
      navigator.clipboard.writeText(code);
      toast("Code copied to clipboard!", "success");
    }
  }
});

function formatMarkdown(str) {
  if (!str) return "";
  let html = str;

  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    codeBlockCounter++;
    const blockId = "code_block_" + codeBlockCounter;
    window.codeBlockStorage[blockId] = code.trim();

    return `<div class="msg-code-block">
      <div class="code-block-header">
        <span>${lang ? lang.toUpperCase() : 'CODE'}</span>
        <button class="copy-code-inline" data-blockid="${blockId}">📋 Copy</button>
      </div>
      <pre><code>${escapeHtml(code.trim())}</code></pre>
    </div>`;
  });

  return escapeHtmlExceptTags(html)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/### (.*?)\n/g, '<h3 style="margin:0.5rem 0;">$1</h3>')
    .replace(/\n/g, '<br>');
}

function escapeHtmlExceptTags(str) {
  const blocks = [];
  str = str.replace(/<div class="msg-code-block">[\s\S]*?<\/div>/g, (m) => {
    blocks.push(m);
    return `__CODE_BLOCK_${blocks.length - 1}__`;
  });

  str = escapeHtml(str);
  blocks.forEach((b, idx) => {
    str = str.replace(`__CODE_BLOCK_${idx}__`, b);
  });
  return str;
}
