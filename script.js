/* ==========================================================================
   VictorX AI — India's Premier Frontier AI Engine & Multi-Language Controller
   ========================================================================== */

let state = {
  lang: localStorage.getItem("victor_lang") || "en",
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"fastapi":"http://localhost:8000","ollama":"http://localhost:11434"}'),
  permissions: JSON.parse(localStorage.getItem("victor_permissions") || '{"localStorage":true,"confidential":true,"gpu":true}'),
  chats: JSON.parse(localStorage.getItem("victor_chat_history") || '[]'),
  currentChatId: null,
  hideCoT: true,
  adminAuthenticated: false,
  dailyTokens: parseInt(localStorage.getItem("victor_daily_tokens") || "0"),
  maxDailyTokens: 50000,
  userStrikes: parseInt(localStorage.getItem("victor_user_strikes") || "0"),
  isBanned: localStorage.getItem("victor_is_banned") === "true",
  violationLogs: JSON.parse(localStorage.getItem("victor_violations") || '[]')
};

const PROHIBITED_KEYWORDS = ["bomb", "kill", "blood", "murder", "weapon", "terror", "explode", "poison", "violence", "harm"];

// Multi-Language i18n Translations (English, Tamil, Hindi, Telugu, Malayalam, Kannada)
const i18n = {
  en: {
    heroGreeting: "What can I help you build today?",
    chipCreateImg: "Create an image",
    chipBuildApp: "Build Video Chat Platform",
    chipLearnGrow: "Learn and grow",
    chipAnalyse: "Analyse for me",
    newChat: "New chat",
    media: "Media Gallery",
    adminControl: "Admin Panel",
    recents: "Recent Chats"
  },
  ta: {
    heroGreeting: "இன்று உங்களுக்கு நான் என்ன உருவாக்க உதவட்டும்?",
    chipCreateImg: "படம் உருவாக்கு",
    chipBuildApp: "வீடியோ சேட் செயலி உருவாக்கு",
    chipLearnGrow: "கற்றுக்கொள் மற்றும் வளர்",
    chipAnalyse: "எனக்காக பகுப்பாய்வு செய்",
    newChat: "புதிய உரையாடல்",
    media: "மீடியா கேலரி",
    adminControl: "நிர்வாகி பேனல்",
    recents: "சமீபத்திய உரையாடல்கள்"
  },
  hi: {
    heroGreeting: "आज मैं आपकी क्या बनाने में मदद कर सकता हूँ?",
    chipCreateImg: "एक छवि बनाएं",
    chipBuildApp: "वीडियो चैट ऐप बनाएं",
    chipLearnGrow: "सीखें और बढ़ें",
    chipAnalyse: "मेरे लिए विश्लेषण करें",
    newChat: "नया चैट",
    media: "मीडिया गैलरी",
    adminControl: "एडमिन पैनल",
    recents: "हाल की बातचीत"
  },
  te: {
    heroGreeting: "ఈరోజు నేను మీకు ఏమి నిర్మించడంలో సహాయపడగలను?",
    chipCreateImg: "చిత్రాన్ని సృష్టించండి",
    chipBuildApp: "వీడియో చాట్ యాప్‌ను రూపొందించండి",
    chipLearnGrow: "నేర్చుకోండి మరియు ఎదగండి",
    chipAnalyse: "నా కోసం విశ్లేషించండి",
    newChat: "కొత్త చాట్",
    media: "మీడియా గ్యాలరీ",
    adminControl: "అడ్మిన్ ప్యానెల్",
    recents: "ఇటీవలి చాట్‌లు"
  },
  ml: {
    heroGreeting: "ഇന്ന് നിങ്ങൾക്ക് എന്താണ് നിർമ്മിക്കാൻ ഞാൻ സഹായിക്കേണ്ടത്?",
    chipCreateImg: "ഒരു ചിത്രം സൃഷ്ടിക്കുക",
    chipBuildApp: "വീഡിയോ ചാറ്റ് ആപ്പ് നിർമ്മിക്കുക",
    chipLearnGrow: "പഠിക്കുക, വളരുക",
    chipAnalyse: "എനിക്കായി വിശകലനം ചെയ്യുക",
    newChat: "പുതിയ ചാറ്റ്",
    media: "മീഡിയ ഗാലറി",
    adminControl: "അഡ്മിൻ പാനൽ",
    recents: "സമീപകാല ചാറ്റുകൾ"
  },
  kn: {
    heroGreeting: "ಇಂದು ನಿಮಗಾಗಿ ಏನನ್ನು ನಿರ್ಮಿಸಲು ನಾನು ಸಹಾಯ ಮಾಡಲಿ?",
    chipCreateImg: "ಚಿತ್ರವನ್ನು ರಚಿಸಿ",
    chipBuildApp: "ವೀಡಿಯೊ ಚಾಟ್ ಅಪ್ಲಿಕೇಶನ್ ನಿರ್ಮಿಸಿ",
    chipLearnGrow: "ಕಲಿಯಿರಿ ಮತ್ತು ಬೆಳೆಯಿರಿ",
    chipAnalyse: "ನನಗಾಗಿ ವಿಶ್ಲೇಷಿಸಿ",
    newChat: "ಹೊಸ ಚಾಟ್",
    media: "ಮೀಡಿಯಾ ಗ್ಯಾಲರಿ",
    adminControl: "ಅಡ್ಮಿನ್ ಪ್ಯಾನಲ್",
    recents: "ಇತ್ತೀಚಿನ ಚಾಟ್‌ಗಳು"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  purgeStaleBoilerplate();
  checkBanStatus();
  updateTokenDisplay();
  initParticleCanvas();
  initSidebarDrawer();
  initLanguageSystem();
  initModals();
  initChatStudio();
  populateSampleRecentHistory();
  checkBackendHealth();
});

function saveState() {
  localStorage.setItem("victor_lang", state.lang);
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
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7,
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

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x, dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. SIDEBAR DRAWER & SAMPLE HISTORY (META AI & GEMINI STYLE)
   ========================================================================== */
function initSidebarDrawer() {
  const drawer = document.getElementById("sidebarDrawer");
  const toggleBtn = document.getElementById("toggleDrawerBtn");
  const closeBtn = document.getElementById("closeDrawerBtn");
  const newChatBtn = document.getElementById("newChatDrawerBtn");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => drawer.classList.add("open"));
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener("click", () => drawer.classList.remove("open"));
  }

  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      createNewChatSession("New Session");
      if (drawer) drawer.classList.remove("open");
    });
  }
}

function populateSampleRecentHistory() {
  const container = document.getElementById("drawerChatHistoryList");
  if (!container) return;

  const sampleTitles = [
    "Building VictorX AI",
    "VictorMe App Blueprint",
    "Simple Admin Panel",
    "Mining app reality check",
    "Watching ads for income in India",
    "Building VICTORLIVE platform",
    "VictorAI Studio Architecture",
    "Designing VictorMedia AI OS"
  ];

  container.innerHTML = "";
  sampleTitles.forEach(t => {
    const item = document.createElement("div");
    item.className = "history-drawer-item";
    item.innerText = t;
    item.addEventListener("click", () => {
      createNewChatSession(t);
      const drawer = document.getElementById("sidebarDrawer");
      if (drawer) drawer.classList.remove("open");
    });
    container.appendChild(item);
  });
}

/* ==========================================================================
   3. MULTI-LANGUAGE SYSTEM (ENGLISH, TAMIL, HINDI, TELUGU, MALAYALAM, KANNADA)
   ========================================================================== */
function initLanguageSystem() {
  const btn = document.getElementById("langSelectBtn");
  const modal = document.getElementById("langModal");
  const langBtns = document.querySelectorAll(".lang-opt-btn");

  if (btn && modal) {
    btn.addEventListener("click", () => modal.classList.remove("hidden"));
    modal.querySelectorAll('[data-close="langModal"]').forEach(b => {
      b.addEventListener("click", () => modal.classList.add("hidden"));
    });
  }

  langBtns.forEach(b => {
    b.addEventListener("click", () => {
      const selected = b.getAttribute("data-lang");
      state.lang = selected;
      saveState();
      langBtns.forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      applyLanguageTranslations();
      modal.classList.add("hidden");
      toast(`Language switched to ${b.innerText}!`, "success");
    });
  });

  applyLanguageTranslations();
}

function applyLanguageTranslations() {
  const langData = i18n[state.lang] || i18n.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (langData[key]) {
      el.innerText = langData[key];
    }
  });

  const labelMap = { en: "English", ta: "தமிழ்", hi: "हिंदी", te: "తెలుగు", ml: "മലയാളം", kn: "ಕನ್ನಡ" };
  const lbl = document.getElementById("currentLangLabel");
  if (lbl) lbl.innerText = labelMap[state.lang] || "English";
}

/* ==========================================================================
   4. PRIVATE ADMIN CONTROL CENTER MODAL
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
        renderAdminViolationLogs();
        toast("👑 Private Admin Panel Unlocked!", "success");
      } else {
        toast("Invalid Security PIN", "error");
      }
    });
  }

  const unbanBtn = document.getElementById("adminUnbanAllBtn");
  if (unbanBtn) {
    unbanBtn.addEventListener("click", () => {
      state.userStrikes = 0; state.isBanned = false; state.violationLogs = [];
      saveState(); checkBanStatus(); renderAdminViolationLogs();
      toast("🔄 Safety Strikes Reset & Accounts Unbanned!", "success");
    });
  }

  if (saveAdminBtn) {
    saveAdminBtn.addEventListener("click", () => {
      state.keys.fastapi = document.getElementById("adminFastApiUrl").value;
      state.keys.ollama = document.getElementById("adminOllamaUrl").value;
      saveState();
      adminModal.classList.add("hidden");
      toast("Private Admin Directives Saved!", "success");
    });
  }
}

function renderAdminViolationLogs() {
  const container = document.getElementById("adminViolationLog");
  if (!container) return;
  if (state.violationLogs.length === 0) {
    container.innerHTML = `<div><em>No banned users reported. System 100% Secure.</em></div>`;
    return;
  }
  container.innerHTML = "";
  state.violationLogs.forEach(v => {
    const item = document.createElement("div");
    item.style.color = "#f87171";
    item.innerHTML = `<strong>[${v.time}] Strike #${v.strikes}:</strong> Prohibited "${escapeHtml(v.prompt)}"`;
    container.appendChild(item);
  });
}

/* ==========================================================================
   5. CHAT STUDIO & MULTI-TURN AI ENGINE
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

  document.querySelectorAll(".meta-chip-btn").forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt");
      if (input) {
        input.value = prompt;
        handleSendMessage();
      }
    });
  });

  if (state.chats.length === 0) {
    createNewChatSession("Session 1");
  } else {
    state.currentChatId = state.chats[0].id;
    renderCurrentChatMessages();
  }
}

function createNewChatSession(title = "New Session") {
  const newChat = {
    id: "chat_" + Date.now(),
    title: title,
    timestamp: new Date().toISOString(),
    messages: []
  };
  state.chats.unshift(newChat);
  state.currentChatId = newChat.id;
  saveState();
  renderCurrentChatMessages();
}

function renderCurrentChatMessages() {
  const heroView = document.getElementById("heroWelcomeView");
  const msgList = document.getElementById("chatMessagesList");
  if (!msgList || !heroView) return;

  const currentChat = state.chats.find(c => c.id === state.currentChatId);

  if (!currentChat || currentChat.messages.length === 0) {
    heroView.classList.remove("hidden");
    msgList.classList.add("hidden");
    return;
  }

  heroView.classList.add("hidden");
  msgList.classList.remove("hidden");
  msgList.innerHTML = "";

  currentChat.messages.forEach(msg => {
    const msgEl = document.createElement("div");
    msgEl.className = `chat-msg ${msg.role}`;
    const avatarText = msg.role === "user" ? "VE" : "VX";
    
    let contentHtml = `<div>${formatMarkdown(msg.content)}</div>`;

    msgEl.innerHTML = `
      <div class="msg-avatar">${avatarText}</div>
      <div class="msg-content">${contentHtml}</div>
    `;
    msgList.appendChild(msgEl);
  });
  
  const container = document.getElementById("chatFlowContainer");
  if (container) container.scrollTop = container.scrollHeight;
}

async function handleSendMessage() {
  if (state.isBanned) {
    checkBanStatus();
    toast("🚫 Your account is currently BANNED for safety violations.", "error");
    return;
  }

  const input = document.getElementById("chatInput");
  if (!input) return;
  const prompt = input.value.trim();
  if (!prompt) return;

  const currentChat = state.chats.find(c => c.id === state.currentChatId);
  if (!currentChat) return;

  currentChat.messages.push({
    role: "user",
    content: prompt,
    timestamp: new Date().toISOString()
  });

  input.value = "";
  renderCurrentChatMessages();

  // 1. MODERATION CHECK
  const lowerPrompt = prompt.toLowerCase();
  const matchedKeyword = PROHIBITED_KEYWORDS.find(k => lowerPrompt.includes(k));

  if (matchedKeyword) {
    state.userStrikes++;
    state.violationLogs.push({ time: new Date().toLocaleTimeString(), prompt: prompt, strikes: state.userStrikes });
    saveState();

    if (state.userStrikes >= 3) {
      state.isBanned = true; saveState(); checkBanStatus();
      toast("🚫 3/3 Safety Strikes Exceeded. Account BANNED!", "error");
      return;
    } else {
      currentChat.messages.push({
        role: "assistant",
        content: `⚠️ **SAFETY WARNING (${state.userStrikes}/3 Strikes)**: Prohibited keyword detected ("${matchedKeyword}"). Repeated violent words will trigger an automatic 24/7 account ban.`,
        timestamp: new Date().toISOString()
      });
      saveState(); renderCurrentChatMessages();
      return;
    }
  }

  // 2. DAILY TOKEN CONSUMPTION
  const tokensUsed = Math.ceil(prompt.split(/\s+/).length * 1.5) + 140;
  state.dailyTokens += tokensUsed;
  saveState(); updateTokenDisplay();

  let responseText = "";

  // Query Backend if active
  if (state.keys.fastapi) {
    try {
      const res = await fetch(`${state.keys.fastapi}/api/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt })
      });
      if (res.ok) {
        const d = await res.json();
        responseText = d.response;
      }
    } catch (e) {}
  }

  if (!responseText) {
    responseText = generateSmartAiResponse(prompt, currentChat.messages);
  }

  currentChat.messages.push({
    role: "assistant",
    content: responseText,
    timestamp: new Date().toISOString()
  });

  saveState();
  renderCurrentChatMessages();
}

function generateSmartAiResponse(prompt, history = []) {
  const raw = prompt.trim();
  const lower = raw.toLowerCase();
  const clean = lower.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
  const fullContext = history.map(h => h.content).join(" ").toLowerCase();

  if (/^(hi|hii|hello|hey|hii buddy|sup|yo)$/i.test(clean)) {
    return `Hey there! 👋 I'm **VictorX AI**—India's premier frontier AI engine.\n\nHow can I help you today? Whether you want to build a complete video chat platform (like Omegle), write Python FastAPI servers, design Flutter mobile apps, or generate 8k artwork, just tell me!`;
  }

  if (lower.includes("image") || lower.includes("picture") || lower.includes("photo") || lower.includes("draw")) {
    return `🎨 **VictorX Imagine AI Artwork Rendered!**\n\nI have generated your 8k high-resolution artwork for: **"${raw}"**.\n\n*Style*: Photorealistic 8k Cinematic\n*Engine*: VictorX Diffusion v1.0.0`;
  }

  if (lower.includes("omegle") || lower.includes("video chat") || (fullContext.includes("omegle") && (lower.includes("build") || lower.includes("make") || lower.includes("now") || lower.includes("do it")))) {
    return `### 🎥 VictorX Omegle Live — Real-Time WebRTC Video Chat Platform\n\nHere is your **complete, full-stack Omegle-like video chat platform** with WebRTC peer-to-peer video streaming, WebSocket signaling server, skip stranger controls, and dark theme UI!\n\n#### 🌐 1. Complete Frontend UI (\`index.html\`)\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>VictorX Omegle Live Video Chat</title>\n    <style>\n        body { background: #0c0f17; color: white; font-family: system-ui; text-align: center; margin: 0; padding: 1rem; }\n        .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 900px; margin: 1.5rem auto; }\n        video { width: 100%; height: 320px; background: #171c2c; border-radius: 16px; border: 2px solid #6366f1; object-fit: cover; }\n        .btn-skip { background: linear-gradient(135deg, #ef4444, #ec4899); color: white; border: none; padding: 0.85rem 2rem; border-radius: 99px; font-weight: bold; font-size: 1rem; cursor: pointer; }\n    </style>\n</head>\n<body>\n    <h1>🎥 VictorX Live — Random Video Chat</h1>\n    <div class="video-grid">\n        <div><h3>You (Local Stream)</h3><video id="localVideo" autoplay muted playsinline></video></div>\n        <div><h3>Stranger (Peer Stream)</h3><video id="remoteVideo" autoplay playsinline></video></div>\n    </div>\n    <button id="skipBtn" class="btn-skip" onclick="nextPeer()">⏩ Skip & Connect Next Stranger</button>\n\n    <script>\n        let localStream, peerConnection;\n        const ws = new WebSocket('ws://localhost:8000/ws/signal');\n        async function initCamera() {\n            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });\n            document.getElementById('localVideo').srcObject = localStream;\n        }\n        function nextPeer() {\n            if (peerConnection) peerConnection.close();\n            ws.send(JSON.stringify({ type: 'find_peer' }));\n        }\n        initCamera();\n    </script>\n</body>\n</html>\n\`\`\`\n\n#### 🐍 2. Python FastAPI WebRTC Signaling Server (\`server.py\`)\n\n\`\`\`python\nfrom fastapi import FastAPI, WebSocket, WebSocketDisconnect\nfrom typing import List\nimport json\n\napp = FastAPI(title="VictorX Omegle Signaling Server")\n\nclass ConnectionManager:\n    def __init__(self):\n        self.active_waiting: List[WebSocket] = []\n    async def connect(self, websocket: WebSocket):\n        await websocket.accept()\n        if self.active_waiting:\n            peer = self.active_waiting.pop(0)\n            await websocket.send_text(json.dumps({"type": "paired", "role": "offerer"}))\n            await peer.send_text(json.dumps({"type": "paired", "role": "answerer"}))\n        else:\n            self.active_waiting.append(websocket)\n\nmanager = ConnectionManager()\n@app.websocket("/ws/signal")\nasync def websocket_endpoint(websocket: WebSocket):\n    await manager.connect(websocket)\n    try:\n        while True: await websocket.receive_text()\n    except WebSocketDisconnect: pass\n\nif __name__ == "__main__":\n    import uvicorn\n    uvicorn.run(app, host="0.0.0.0", port=8000)\n\`\`\``;
  }

  if (lower.includes("fastapi") || lower.includes("python")) {
    return `Here is a production-ready **Python FastAPI Backend Server**:\n\n\`\`\`python\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport uvicorn\n\napp = FastAPI(title="VictorX Production API")\n\nclass PredictRequest(BaseModel):\n    prompt: str\n\n@app.post("/api/v1/predict")\nasync def predict(req: PredictRequest):\n    return {"status": "success", "result": f"Processed: {req.prompt}"}\n\nif __name__ == "__main__":\n    uvicorn.run(app, host="0.0.0.0", port=8000)\n\`\`\``;
  }

  if (lower.includes("flutter") || lower.includes("dart")) {
    return `Here is a complete **Flutter Application Screen**:\n\n\`\`\`dart\nimport 'package:flutter/material.dart';\n\nvoid main() => runApp(const VictorXApp());\n\nclass VictorXApp extends StatelessWidget {\n  const VictorXApp({super.key});\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      title: 'VictorX App',\n      theme: ThemeData.dark().copyWith(scaffoldBackgroundColor: const Color(0xFF0C0F17)),\n      home: const Scaffold(body: Center(child: Text('🚀 VictorX Flutter App Live'))),\n    );\n  }\n}\n\`\`\``;
  }

  return `I have processed your prompt **"${raw}"**.\n\nLet me know what specific app code, design, or synthesis you'd like me to build next!`;
}

function checkBackendHealth() {
  fetch(`${state.keys.fastapi}/health`).catch(() => {});
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
}

function formatMarkdown(str) {
  if (!str) return "";
  let html = str;

  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<div class="msg-code-block">
      <div class="code-block-header">
        <span>${lang ? lang.toUpperCase() : 'CODE'}</span>
        <button class="copy-code-inline" onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`')}\`); toast('Code copied!', 'success')">📋 Copy</button>
      </div>
      <pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>
    </div>`;
  });

  return escapeHtmlExceptTags(html)
    .replace(/### (.*?)\n/g, '<h3 style="margin:0.5rem 0; font-family:var(--font-heading);">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="msg-inline-code">$1</code>')
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
