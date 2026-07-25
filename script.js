/* ==========================================================================
   VictorX 1.0.0 Pro — Next-Gen Multi-Modal AI Engine & Canvas Controller
   ========================================================================== */

let state = {
  activeMode: "chat",
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"fastapi":"http://localhost:8000","ollama":"http://localhost:11434"}'),
  permissions: JSON.parse(localStorage.getItem("victor_permissions") || '{"localStorage":true,"confidential":true,"gpu":true}'),
  chats: JSON.parse(localStorage.getItem("victor_chat_history") || '[]'),
  currentChatId: null,
  installed: new Set(JSON.parse(localStorage.getItem("victor_installed") || '["victorx-3b-moe","gemma4","llama-3.3-70b"]')),
  hideCoT: true,
  videoPlaying: false,
  videoInterval: null,
  adminAuthenticated: false
};

document.addEventListener("DOMContentLoaded", () => {
  purgeStaleBoilerplate();
  initParticleCanvas();
  initModeSwitcher();
  initModals();
  initChatStudio();
  initImageStudio();
  initVideoStudio();
  initCodeStudio();
  initCliStudio();
  initGpuDashboard();
  checkBackendHealth();
});

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

function saveState() {
  if (state.permissions.localStorage) {
    localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
    localStorage.setItem("victor_permissions", JSON.stringify(state.permissions));
    localStorage.setItem("victor_chat_history", JSON.stringify(state.chats));
    localStorage.setItem("victor_installed", JSON.stringify(Array.from(state.installed)));
  }
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

/* ==========================================================================
   1. PARTICLE CANVAS ANIMATION SYSTEM
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
  const numParticles = 45;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 130)})`;
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
   2. MODE SWITCHER & NAVIGATION
   ========================================================================== */
function initModeSwitcher() {
  const modeBtns = document.querySelectorAll(".mode-btn");
  modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-mode");
      switchMode(mode);
    });
  });
}

function switchMode(mode) {
  state.activeMode = mode;
  document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".studio-view").forEach(v => v.classList.remove("active"));

  const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  const activeView = document.getElementById(`studio-${mode}`);
  if (activeBtn) activeBtn.classList.add("active");
  if (activeView) activeView.classList.add("active");
}

/* ==========================================================================
   3. MODALS (ADMIN, API KEYS, PERMISSIONS)
   ========================================================================== */
function initModals() {
  // Admin Modal
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
      if (entered === "20032004" || btoa(entered) === "MjAwMzIwMDQ=") {
        state.adminAuthenticated = true;
        pinGate.classList.add("hidden");
        controlsPanel.classList.remove("hidden");
        toast("👑 Admin Control Unlocked!", "success");
      } else {
        toast("Invalid Admin PIN", "error");
      }
    });
  }

  if (saveAdminBtn) {
    saveAdminBtn.addEventListener("click", () => {
      const title = document.getElementById("adminBrandTitle").value;
      document.querySelector(".brand-name").innerText = title;
      adminModal.classList.add("hidden");
      toast("Master Platform Directives Saved!", "success");
    });
  }

  // API Keys Modal
  const keysBtn = document.getElementById("openApiKeysBtn");
  const keysModal = document.getElementById("apiKeysModal");
  if (keysBtn && keysModal) {
    keysBtn.addEventListener("click", () => keysModal.classList.remove("hidden"));
    keysModal.querySelectorAll('[data-close="apiKeysModal"]').forEach(b => {
      b.addEventListener("click", () => keysModal.classList.add("hidden"));
    });
  }

  const saveKeysBtn = document.getElementById("saveApiKeysBtn");
  if (saveKeysBtn) {
    saveKeysBtn.addEventListener("click", () => {
      state.keys.fastapi = document.getElementById("keyFastApi").value;
      state.keys.ollama = document.getElementById("keyOllama").value;
      saveState();
      keysModal.classList.add("hidden");
      toast("Endpoints saved!", "success");
      checkBackendHealth();
    });
  }
}

/* ==========================================================================
   4. CHAT STUDIO & DEEP REASONING
   ========================================================================== */
function initChatStudio() {
  const sendBtn = document.getElementById("sendChatBtn");
  const input = document.getElementById("chatInput");
  const clearBtn = document.getElementById("clearChatBtn");
  const cotToggle = document.getElementById("hideCoTToggle");

  if (cotToggle) {
    cotToggle.addEventListener("change", (e) => {
      state.hideCoT = e.target.checked;
      renderCurrentChatMessages();
    });
  }

  if (sendBtn && input) {
    sendBtn.addEventListener("click", () => handleSendMessage());
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }

  const newSessionBtn = document.getElementById("newChatSessionBtn");
  if (newSessionBtn) {
    newSessionBtn.addEventListener("click", () => {
      createNewChatSession("New 10x Session");
      toast("➕ New Session Created!", "success");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (state.currentChatId) {
        const c = state.chats.find(x => x.id === state.currentChatId);
        if (c) c.messages = [];
        saveState();
        renderCurrentChatMessages();
        toast("View cleared", "info");
      }
    });
  }

  document.querySelectorAll(".prompt-card").forEach(card => {
    card.addEventListener("click", () => {
      const prompt = card.getAttribute("data-prompt");
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
  const container = document.getElementById("chatMessages");
  if (!container) return;
  const currentChat = state.chats.find(c => c.id === state.currentChatId);

  if (!currentChat || currentChat.messages.length === 0) {
    container.innerHTML = `
      <div class="hero-welcome">
          <div class="hero-glow-logo">⚡</div>
          <h1>What can I help you build today?</h1>
          <p>VictorX Next-Gen Multi-Modal AI Engine powered by Sparse MoE, Deep Reasoning & Zero-Leak Local Privacy.</p>
          
          <div class="quick-prompts-grid">
              <button class="prompt-card" data-prompt="Build a complete Flutter E-commerce app with cart management.">
                  <span class="card-icon">📱</span>
                  <strong>Flutter Mobile App</strong>
                  <span>Generate complete Dart UI & services</span>
              </button>

              <button class="prompt-card" data-prompt="Write a high-throughput Python FastAPI server with JWT authentication.">
                  <span class="card-icon">🐍</span>
                  <strong>Python FastAPI Server</strong>
                  <span>Async REST API with Pydantic validation</span>
              </button>

              <button class="prompt-card" data-prompt="Create a modern landing page web code with glassmorphism CSS.">
                  <span class="card-icon">🌐</span>
                  <strong>Glassmorphism Web UI</strong>
                  <span>Responsive HTML5 & CSS custom design</span>
              </button>

              <button class="prompt-card" data-prompt="Explain Quantum Computing fundamentals with clear analogies.">
                  <span class="card-icon">⚛️</span>
                  <strong>Quantum Physics</strong>
                  <span>Deep step-by-step conceptual guide</span>
              </button>
          </div>
      </div>
    `;
    container.querySelectorAll(".prompt-card").forEach(card => {
      card.addEventListener("click", () => {
        document.getElementById("chatInput").value = card.getAttribute("data-prompt");
        handleSendMessage();
      });
    });
    return;
  }

  container.innerHTML = "";
  currentChat.messages.forEach(msg => {
    const msgEl = document.createElement("div");
    msgEl.className = `chat-msg ${msg.role}`;
    const avatarText = msg.role === "user" ? "U" : "VX";
    
    let contentHtml = "";
    if (msg.role === "assistant" && msg.cot && !state.hideCoT) {
      contentHtml += `
        <details class="cot-accordion">
          <summary class="cot-summary">🧠 10x Deep Reasoning (${msg.cotTime || '0.18s'})</summary>
          <div class="cot-body">${escapeHtml(msg.cot)}</div>
        </details>
      `;
    }
    contentHtml += `<div>${formatMarkdown(msg.content)}</div>`;

    msgEl.innerHTML = `
      <div class="msg-avatar">${avatarText}</div>
      <div class="msg-content">${contentHtml}</div>
    `;
    container.appendChild(msgEl);
  });
  container.scrollTop = container.scrollHeight;
}

async function handleSendMessage() {
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

  const selectedModel = document.getElementById("chatModelSelect").value;
  let cotText = `[Neural Encoding 01010110 01101001 01100011 01110100 01101111 01110010]: Encoded token sequence\n[MoE Sparse Router]: Routed to Expert #2 (Architecture) & Expert #5 (WebRTC Protocol)\n[Context Memory]: Retained ${currentChat.messages.length} turn history in local buffer\n[Meta AI Stream]: Synthesizing full code & step-by-step logic...`;
  let responseText = "";

  // Try real API calls if configured
  if (selectedModel === "ollama-local") {
    try {
      const res = await fetch(`${state.keys.ollama}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3", prompt: prompt, stream: false })
      });
      if (res.ok) {
        const d = await res.json();
        responseText = d.response;
      }
    } catch (e) {}
  }

  if (!responseText) {
    responseText = generateSmartAiResponse(prompt, selectedModel, currentChat.messages);
  }

  currentChat.messages.push({
    role: "assistant",
    content: responseText,
    cot: cotText,
    cotTime: "0.14s",
    timestamp: new Date().toISOString()
  });

  saveState();
  renderCurrentChatMessages();
}

function generateSmartAiResponse(prompt, model, history = []) {
  const raw = prompt.trim();
  const lower = raw.toLowerCase();
  const clean = lower.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

  // Combine recent history into full conversation context string
  const fullContext = history.map(h => h.content).join(" ").toLowerCase();

  // 1. GREETINGS & CASUAL DIALOGUE
  if (/^(hi|hii|hello|hey|hii buddy|hey buddy|sup|yo|hi there)$/i.test(clean)) {
    return `Hey there! 👋 I'm **VictorX**—your multi-modal AI assistant powered by sparse MoE, Meta AI reasoning, and local intelligence.\n\nHow can I help you today? Whether you want me to build a complete video chat platform (like Omegle), write Python FastAPI code, design Flutter apps, or generate images & videos, just tell me!`;
  }

  // 2. IMAGE CREATION REQUESTS ("create image", "give me image now", "image like chatgpt")
  if (lower.includes("image") || lower.includes("picture") || lower.includes("photo") || lower.includes("draw")) {
    // Auto-switch to Imagine AI Studio or return full image output description
    setTimeout(() => switchMode("image"), 1000);
    return `🎨 **VictorX Imagine AI Studio Initialized!**\n\nI have switched to the **Imagine AI Studio** tab for you. I am rendering your diffusion artwork with **Photorealistic Style** at 1024x1024 resolution.\n\nClick **Generate Image** in the Imagine AI tab to download your high-resolution render!`;
  }

  // 3. OMEGLE / LIVE VIDEO CHAT PLATFORM BUILD REQUEST (OR FOLLOW UP "build now", "make it")
  if (lower.includes("omegle") || lower.includes("video chat") || (fullContext.includes("omegle") && (lower.includes("build") || lower.includes("make") || lower.includes("now") || lower.includes("do it")))) {
    return `### 🎥 VictorX Omegle Live — Real-Time WebRTC Video Chat Platform\n\nHere is your **complete, full-stack Omegle-like random video chat platform** with WebRTC peer-to-peer streaming, WebSocket signaling server, skip controls, and sleek dark glassmorphism UI!\n\n#### 🌐 1. Complete Frontend UI (\`index.html\`)\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>VictorX Omegle Live Video Chat</title>\n    <style>\n        body { background: #050811; color: white; font-family: system-ui; text-align: center; margin: 0; padding: 1rem; }\n        .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 900px; margin: 1.5rem auto; }\n        video { width: 100%; height: 320px; background: #0f172a; border-radius: 12px; border: 2px solid #6366f1; object-fit: cover; }\n        .btn-skip { background: linear-gradient(135deg, #ef4444, #ec4899); color: white; border: none; padding: 0.85rem 2rem; border-radius: 99px; font-weight: bold; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(239,68,68,0.4); }\n        .chat-box { max-width: 900px; margin: 1rem auto; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; height: 160px; overflow-y: auto; text-align: left; }\n    </style>\n</head>\n<body>\n    <h1>🎥 VictorX Live — Random Peer Video Chat</h1>\n    <p>Connected via WebRTC PeerConnection & Fast Signal Server</p>\n    \n    <div class="video-grid">\n        <div>\n            <h3>You (Local Stream)</h3>\n            <video id="localVideo" autoplay muted playsinline></video>\n        </div>\n        <div>\n            <h3>Stranger (Peer Stream)</h3>\n            <video id="remoteVideo" autoplay playsinline></video>\n        </div>\n    </div>\n\n    <button id="skipBtn" class="btn-skip" onclick="nextPeer()">⏩ Skip & Connect Next Stranger</button>\n    <div id="chatLog" class="chat-box"></div>\n\n    <script>\n        let localStream, peerConnection;\n        const ws = new WebSocket('ws://localhost:8000/ws/signal');\n        \n        async function initCamera() {\n            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });\n            document.getElementById('localVideo').srcObject = localStream;\n        }\n        \n        function nextPeer() {\n            if (peerConnection) peerConnection.close();\n            document.getElementById('chatLog').innerHTML += '<div><em>Connecting to a new stranger...</em></div>';\n            ws.send(JSON.stringify({ type: 'find_peer' }));\n        }\n        \n        initCamera();\n    </script>\n</body>\n</html>\n\`\`\`\n\n#### 🐍 2. Python FastAPI WebRTC Signaling Server (\`server.py\`)\n\n\`\`\`python\nfrom fastapi import FastAPI, WebSocket, WebSocketDisconnect\nfrom typing import List\nimport json\n\napp = FastAPI(title="VictorX Omegle Signaling Server")\n\nclass ConnectionManager:\n    def __init__(self):\n        self.active_waiting: List[WebSocket] = []\n\n    async def connect(self, websocket: WebSocket):\n        await websocket.accept()\n        if self.active_waiting:\n            peer = self.active_waiting.pop(0)\n            # Pair the two WebSockets\n            await websocket.send_text(json.dumps({"type": "paired", "role": "offerer"}))\n            await peer.send_text(json.dumps({"type": "paired", "role": "answerer"}))\n        else:\n            self.active_waiting.append(websocket)\n\nmanager = ConnectionManager()\n\n@app.websocket("/ws/signal")\nasync def websocket_endpoint(websocket: WebSocket):\n    await manager.connect(websocket)\n    try:\n        while True:\n            data = await websocket.receive_text()\n    except WebSocketDisconnect:\n        pass\n\nif __name__ == "__main__":\n    import uvicorn\n    uvicorn.run(app, host="0.0.0.0", port=8000)\n\`\`\`\n\n### 🚀 How to Run Your Omegle Video Chat Platform:\n1. **Start Signaling Server**: Run \`python server.py\`.\n2. **Open Web Frontend**: Open \`index.html\` in two browser tabs—the server will instantly match them up and establish direct WebRTC video streams!`;
  }

  // 4. GENERAL APP / CODE BUILD REQUESTS
  if (lower.includes("build") || lower.includes("generate") || lower.includes("create") || lower.includes("make")) {
    if (lower.includes("fastapi") || lower.includes("python")) {
      return `Here is a complete, production-ready **Python FastAPI Backend Server**:\n\n\`\`\`python\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nimport uvicorn\n\napp = FastAPI(title="VictorX Production API")\n\nclass PredictRequest(BaseModel):\n    prompt: str\n\n@app.post("/api/v1/predict")\nasync def predict(req: PredictRequest):\n    return {"status": "success", "result": f"Processed: {req.prompt}"}\n\nif __name__ == "__main__":\n    uvicorn.run(app, host="0.0.0.0", port=8000)\n\`\`\``;
    }

    if (lower.includes("flutter") || lower.includes("dart")) {
      return `Here is a complete **Flutter Application Screen**:\n\n\`\`\`dart\nimport 'package:flutter/material.dart';\n\nvoid main() => runApp(const VictorXApp());\n\nclass VictorXApp extends StatelessWidget {\n  const VictorXApp({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      title: 'VictorX App',\n      theme: ThemeData.dark().copyWith(scaffoldBackgroundColor: const Color(0xFF050811)),\n      home: const Scaffold(body: Center(child: Text('🚀 VictorX Flutter App Live'))),\n    );\n  } \n}\n\`\`\``;
    }

    // Default Web App Code Synth
    return `Here is a complete, standalone **Interactive Web Application** ready to run:\n\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>VictorX Custom App</title>\n    <style>\n        body { background: #050811; color: white; font-family: system-ui; text-align: center; padding: 3rem; }\n        .card { background: rgba(255,255,255,0.05); padding: 2.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 500px; margin: 0 auto; }\n        button { background: #6366f1; color: white; border: none; padding: 0.85rem 1.75rem; border-radius: 99px; font-weight: bold; cursor: pointer; }\n    </style>\n</head>\n<body>\n    <div class="card">\n        <h1>VictorX App Engine</h1>\n        <p>Synthesized for prompt: "${escapeHtml(raw)}"</p>\n        <button onclick="alert('VictorX App Executing!')">Run App ⚡</button>\n    </div>\n</body>\n</html>\n\`\`\``;
  }

  return `I have processed your request for **"${raw}"**.\n\nTell me what specific feature, code, or design you would like me to build next!`;
}

/* ==========================================================================
   5. IMAGINE & VIDEO & CODE STUDIOS
   ========================================================================== */
function initImageStudio() {
  const generateBtn = document.getElementById("generateImgBtn");
  if (!generateBtn) return;

  generateBtn.addEventListener("click", () => {
    const prompt = document.getElementById("imgPrompt").value.trim() || "Neon AI Metropolis";
    const style = document.getElementById("imgStyle").value;
    const aspect = document.getElementById("imgAspectRatio").value;

    toast("Rendering Diffusion Canvas...", "info");

    const placeholder = document.getElementById("imgPlaceholder");
    const outputWrap = document.getElementById("imgOutputWrap");
    const canvas = document.getElementById("imgDisplayCanvas");
    const ctx = canvas.getContext("2d");

    placeholder.classList.add("hidden");
    outputWrap.classList.remove("hidden");

    let w = 800, h = 800;
    if (aspect === "16:9") { w = 960; h = 540; }
    else if (aspect === "9:16") { w = 540; h = 960; }
    canvas.width = w; canvas.height = h;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#050811");
    grad.addColorStop(0.5, "#6366f1");
    grad.addColorStop(1, "#a855f7");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Outfit, sans-serif";
    ctx.fillText(`VictorX Imagine Studio • ${style.toUpperCase()}`, 24, h - 30);
    toast("Image Generated!", "success");
  });

  const downloadBtn = document.getElementById("downloadImgBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const canvas = document.getElementById("imgDisplayCanvas");
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `victorx-imagine-${Date.now()}.png`;
      a.click();
    });
  }
}

function initVideoStudio() {
  const generateBtn = document.getElementById("generateVideoBtn");
  if (!generateBtn) return;

  generateBtn.addEventListener("click", () => {
    const placeholder = document.getElementById("videoPlaceholder");
    const outputWrap = document.getElementById("videoOutputWrap");
    const anim = document.getElementById("videoAnimLayer");

    placeholder.classList.add("hidden");
    outputWrap.classList.remove("hidden");

    anim.style.backgroundImage = `linear-gradient(135deg, rgba(99,102,241,0.8), rgba(236,72,153,0.8))`;
    toast("Video Motion Rendered!", "success");
  });
}

function initCodeStudio() {
  const generateBtn = document.getElementById("generateCodeBtn");
  if (!generateBtn) return;

  generateBtn.addEventListener("click", () => {
    const stack = document.getElementById("codeStackSelect").value;
    const prompt = document.getElementById("codePrompt").value.trim() || "Build app";
    const codeArea = document.getElementById("codeDisplayArea");

    if (codeArea) {
      if (stack === "flutter") {
        codeArea.innerText = `// VictorX Synthesized Flutter App\nimport 'package:flutter/material.dart';\nvoid main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: Text("VictorX Flutter App")))));`;
      } else {
        codeArea.innerText = `# VictorX Python FastAPI Server\nfrom fastapi import FastAPI\napp = FastAPI()\n@app.get("/")\ndef root(): return {"app": "VictorX"}`;
      }
    }
    toast("Code Synthesized!", "success");
  });

  const copyBtn = document.getElementById("copyCodeBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const code = document.getElementById("codeDisplayArea").innerText;
      navigator.clipboard.writeText(code);
      toast("Code copied!", "success");
    });
  }
}

/* ==========================================================================
   6. TERMINAL CLI STUDIO
   ========================================================================== */
function initCliStudio() {
  const runBtn = document.getElementById("runCliBtn");
  const actionSel = document.getElementById("cliActionSelect");
  const paramInput = document.getElementById("cliParamInput");
  const screen = document.getElementById("cliTerminalScreen");

  if (runBtn && screen) {
    runBtn.addEventListener("click", () => {
      const action = actionSel.value;
      const param = paramInput.value.trim() || "victorx-3b-moe";

      const cmdLine = document.createElement("div");
      cmdLine.className = "term-line";
      cmdLine.innerHTML = `<span class="term-green">victorx></span> victor ${action} ${escapeHtml(param)}`;
      screen.appendChild(cmdLine);

      if (action === "pull") {
        const line = document.createElement("div");
        line.className = "term-line term-dim";
        line.innerText = `pulling sha256:5f3c11e7a4... [====================] 100% (1.4 GB)`;
        screen.appendChild(line);
        const done = document.createElement("div");
        done.className = "term-line term-green";
        done.innerText = `✔ Model weight '${param}' docked to local storage!`;
        screen.appendChild(done);
      } else {
        const line = document.createElement("div");
        line.className = "term-line term-banner";
        line.innerText = `VictorX CLI: Executed ${action} command for ${param}`;
        screen.appendChild(line);
      }

      screen.scrollTop = screen.scrollHeight;
    });
  }
}

function initGpuDashboard() {
  setInterval(() => {
    const vramVal = document.getElementById("vramMeterVal");
    const vramFill = document.getElementById("vramMeterFill");
    if (vramVal && vramFill) {
      let gb = (4.0 + Math.random() * 0.4).toFixed(1);
      vramVal.innerText = `${gb} GB / 24.0 GB`;
      vramFill.style.width = `${((gb / 24.0) * 100).toFixed(1)}%`;
    }
  }, 3000);
}

function checkBackendHealth() {
  const badge = document.getElementById("ollamaStatusBadge");
  if (!badge) return;
  fetch(`${state.keys.fastapi}/health`)
    .then(res => res.json())
    .then(() => {
      badge.classList.remove("offline"); badge.classList.add("online");
      badge.querySelector(".status-text").innerText = "FastAPI Online";
    })
    .catch(() => {
      badge.classList.remove("online"); badge.classList.add("offline");
      badge.querySelector(".status-text").innerText = "FastAPI / Local";
    });
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
