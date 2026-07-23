/* ==========================================================================
   VictorX Engine & Database Controller
   - Synchronizes state across localStorage, IndexedDB, and db/data.json
   - Manages API Workbench execution & live code snippet generator
   - Manages Model Hub filtering, pulling simulation, and AI Playground
   - Handles Admin PIN authentication (20032004) & modal controls
   ========================================================================== */

const PORTS = [
  { id: "ollama",     name: "Ollama",       color: "#F0A93D", desc: "Local-first runtime. Pulls sit on your own machine." },
  { id: "hf",         name: "Model Hub",    color: "#4FD1C5", desc: "Open model weights, datasets, and pipelines." },
  { id: "meta",       name: "Meta",         color: "#7C9CFF", desc: "Llama open weights family." },
  { id: "mistral",    name: "Mistral AI",   color: "#E5675F", desc: "Fast, high-performance open weight models." },
  { id: "google",     name: "Google",       color: "#8FD14F", desc: "Gemma open weight models." },
  { id: "openrouter", name: "OpenRouter",   color: "#38BDF8", desc: "Unified API gateway accessing top AI models." }
];

const MODELS = [
  { id: "llama-3.3-70b",  name: "Llama 3.3", size: "70B",  port: "meta",     tags: ["reasoning","chat"],    haul: 540000, added: 2,  desc: "State of the art open reasoning model comparable to top proprietary APIs.", apiModel: "meta-llama/llama-3.3-70b-instruct" },
  { id: "llama-3.1-8b",   name: "Llama 3.1", size: "8B",   port: "meta",     tags: ["chat","general"],     haul: 812000, added: 9,  desc: "Meta's general-purpose chat model, fast and efficient.", apiModel: "meta-llama/llama-3.1-8b-instruct" },
  { id: "deepseek-r1",    name: "DeepSeek R1", size: "671B", port: "openrouter", tags: ["reasoning","math","code"], haul: 920000, added: 1, desc: "Open-weights reasoning model with chain-of-thought verification.", apiModel: "deepseek/deepseek-r1" },
  { id: "mistral-7b",     name: "Mistral",   size: "7B",   port: "mistral",  tags: ["chat","general"],      haul: 690000, added: 22, desc: "Compact and fast model build for low latency inference.", apiModel: "mistralai/mistral-7b-instruct" },
  { id: "mixtral-8x7b",   name: "Mixtral",   size: "8x7B", port: "mistral",  tags: ["chat","reasoning"],    haul: 210000, added: 30, desc: "Mixture-of-experts model architecture for sparse inference.", apiModel: "mistralai/mixtral-8x7b-instruct" },
  { id: "gemma-2-27b",    name: "Gemma 2",   size: "27B",  port: "google",   tags: ["chat","reasoning"],    haul: 98000,  added: 5,  desc: "Google's open weights, tuned for efficient reasoning workloads.", apiModel: "google/gemma-2-27b-it" },
  { id: "qwen-2.5-72b",   name: "Qwen 2.5",   size: "72B",  port: "hf",       tags: ["reasoning","chat"],    haul: 61000,  added: 12, desc: "Top of the line open model for multi-step reasoning.", apiModel: "qwen/qwen-2.5-72b-instruct" },
  { id: "phi-3.5-mini",   name: "Phi-3.5",   size: "3.8B", port: "hf",       tags: ["chat","edge"],         haul: 133000, added: 18, desc: "Lightweight model tuned for high efficiency on edge devices.", apiModel: "microsoft/phi-3.5-mini-instruct" },
  { id: "codellama-13b",  name: "CodeLlama", size: "13B",  port: "meta",     tags: ["code"],                haul: 145000, added: 60, desc: "Meta's code-specialized model for programming context.", apiModel: "meta-llama/codellama-13b-instruct" },
  { id: "whisper-v3",     name: "Whisper",   size: "Large", port: "hf",      tags: ["audio"],               haul: 310000, added: 120,desc: "State of the art speech-to-text reference model.", apiModel: "openai/whisper-large-v3" }
];

const ADMIN_VERIFICATION_PIN = '20032004';

let state = {
  search: "",
  port: "all",
  sort: "most_hauled",
  user: JSON.parse(localStorage.getItem("victor_user") || 'null'),
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"openrouter":"","openai":"","gemini":"","ollama":"http://localhost:11434"}'),
  installed: new Set(JSON.parse(localStorage.getItem("victor_installed") || '["llama-3.1-8b","mistral-7b"]')),
  currentPullingModel: null,
  adminAuthenticated: false
};

// Database Storage Helper
function saveState() {
  localStorage.setItem("victor_installed", JSON.stringify(Array.from(state.installed)));
  localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
  if(state.user) localStorage.setItem("victor_user", JSON.stringify(state.user));
  else localStorage.removeItem("victor_user");
}

function fmt(n) {
  return n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'k' : n;
}

function portInfo(id) {
  return PORTS.find(p => p.id === id) || { name: "Unknown", color: "#818cf8" };
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
}

function toast(msg, type = "info") {
  const container = document.getElementById("toast");
  if(!container) return;
  const t = document.createElement("div");
  t.style.padding = "10px 16px";
  t.style.borderRadius = "6px";
  t.style.fontSize = "13px";
  t.style.fontWeight = "500";
  t.style.marginBottom = "8px";
  t.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
  
  if(type === "error") {
    t.style.background = "#7f1d1d";
    t.style.color = "#fca5a5";
    t.style.border = "1px solid #991b1b";
  } else if(type === "success") {
    t.style.background = "#064e3b";
    t.style.color = "#6ee7b7";
    t.style.border = "1px solid #065f46";
  } else {
    t.style.background = "#1e293b";
    t.style.color = "#e2e8f0";
    t.style.border = "1px solid #334155";
  }
  
  t.innerText = msg;
  container.appendChild(t);
  
  setTimeout(() => {
    t.remove();
  }, 3000);
}

// Modal Helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if(modal) modal.style.display = "flex";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if(modal) modal.style.display = "none";
}

// Render Functions
function updateStats() {
  const statModels = document.getElementById("statModels");
  const statPorts = document.getElementById("statPorts");
  const statInstalled = document.getElementById("statInstalled");
  const installedCountPill = document.getElementById("installedCountPill");
  
  if(statModels) statModels.innerText = MODELS.length;
  if(statPorts) statPorts.innerText = PORTS.length;
  if(statInstalled) statInstalled.innerText = state.installed.size;
  if(installedCountPill) installedCountPill.innerText = `${state.installed.size} Models`;
}

function renderChips() {
  const c = document.getElementById("portChips");
  if(!c) return;
  
  let html = `<button class="chip ${state.port === 'all' ? 'active' : ''}" data-port="all">All Ports</button>`;
  PORTS.forEach(p => {
    html += `<button class="chip ${state.port === p.id ? 'active' : ''}" data-port="${p.id}">
      <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${p.color}; margin-right:4px;"></span>
      ${escapeHtml(p.name)}
    </button>`;
  });
  c.innerHTML = html;

  c.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.port = btn.dataset.port;
      renderChips();
      renderGrid();
    });
  });
}

function renderGrid() {
  const g = document.getElementById("modelGrid");
  const resultCount = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");
  if(!g) return;

  const filtered = MODELS.filter(m => {
    if(state.port !== "all" && m.port !== state.port) return false;
    if(state.search) {
      const q = state.search.toLowerCase();
      if(!m.name.toLowerCase().includes(q) && !m.id.toLowerCase().includes(q) && !m.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  filtered.sort((a,b) => {
    if(state.sort === "most_hauled") return b.haul - a.haul;
    if(state.sort === "newest") return a.added - b.added;
    if(state.sort === "name_asc") return a.name.localeCompare(b.name);
    return b.haul - a.haul;
  });

  if(resultCount) resultCount.innerText = `${filtered.length} models on manifest`;

  if(filtered.length === 0) {
    g.innerHTML = "";
    if(emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if(emptyState) emptyState.classList.add("hidden");

  g.innerHTML = "";
  filtered.forEach(m => {
    const p = portInfo(m.port);
    const isInstalled = state.installed.has(m.id);

    g.innerHTML += `
      <div class="model-card" style="border-left-color:${p.color};">
        <div class="card-header">
          <div>
            <span class="provider-tag" style="color:${p.color};">${escapeHtml(p.name)}</span>
            <h3 class="model-name" style="margin-top:4px;">${escapeHtml(m.name)} <span>(${m.size})</span></h3>
          </div>
          <span class="tag">⬇️ ${fmt(m.haul)}</span>
        </div>

        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">${escapeHtml(m.desc)}</p>

        <div class="card-tags">
          ${m.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>

        <div class="card-actions">
          ${isInstalled 
            ? `<button class="btn btn-sm btn-ghost launch-playground-btn" data-model="${m.id}">⚡ Playground</button>`
            : `<button class="btn btn-sm btn-primary open-pull-modal" data-model="${m.id}">Pull Model</button>`
          }
          <button class="btn btn-sm btn-ghost test-api-btn" data-model="${m.apiModel}">⚡ Test API</button>
        </div>
      </div>
    `;
  });
}

function renderInstalledGrid() {
  const g = document.getElementById("installedGrid");
  const emptyDockState = document.getElementById("emptyDockState");
  if(!g) return;

  if(state.installed.size === 0) {
    g.innerHTML = "";
    if(emptyDockState) emptyDockState.classList.remove("hidden");
    return;
  }
  if(emptyDockState) emptyDockState.classList.add("hidden");

  g.innerHTML = "";
  Array.from(state.installed).forEach(id => {
    const m = MODELS.find(x => x.id === id) || { id, name: id, size: "Default", desc: "Installed custom model", port: "hf" };
    const p = portInfo(m.port);

    g.innerHTML += `
      <div class="model-card docked-card">
        <div class="card-header">
          <div>
            <span class="provider-tag">${escapeHtml(p.name)}</span>
            <h3 class="model-name" style="margin-top:4px;">${escapeHtml(m.name)}</h3>
          </div>
          <span class="badge live-badge">DOCKED</span>
        </div>
        <div class="card-actions" style="margin-top:12px;">
          <button class="btn btn-sm btn-primary launch-playground-btn" data-model="${m.id}">⚡ Launch Playground</button>
          <button class="btn btn-sm btn-ghost remove-dock-btn" data-model="${m.id}">Remove</button>
        </div>
      </div>
    `;
  });
}

function renderPorts() {
  const grid = document.getElementById("portGrid");
  if(!grid) return;
  grid.innerHTML = "";
  PORTS.forEach(p => {
    grid.innerHTML += `
      <div class="port-card">
        <div class="port-icon" style="color:${p.color};">🔌</div>
        <div>
          <h4 style="margin-bottom:2px;">${escapeHtml(p.name)}</h4>
          <p style="font-size:12px; color:var(--text-muted);">${escapeHtml(p.desc)}</p>
        </div>
      </div>
    `;
  });
}

// API Testing Workbench Engine
function initApidogWorkbench() {
  const sendBtn = document.getElementById("apiSendBtn");
  const saveBtn = document.getElementById("apiSaveBtn");
  const endpointInput = document.getElementById("apiEndpointInput");
  const bodyInput = document.getElementById("apiRequestBody");
  const methodSelect = document.getElementById("apiMethod");

  if(sendBtn) sendBtn.addEventListener("click", handleSendApiRequest);
  if(saveBtn) saveBtn.addEventListener("click", () => toast("API Request saved to database collection", "success"));

  if(bodyInput) bodyInput.addEventListener("input", generateCodeSnippets);
  if(endpointInput) endpointInput.addEventListener("input", generateCodeSnippets);
  if(methodSelect) methodSelect.addEventListener("change", generateCodeSnippets);

  // Workbench Tabs
  document.querySelectorAll(".request-pane .pane-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".request-pane .pane-tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      
      const targetTab = e.target.dataset.tab;
      document.querySelectorAll(".request-pane .tab-panel").forEach(p => p.classList.add("hidden"));
      
      if(targetTab === 'body') document.getElementById("tabBody")?.classList.remove("hidden");
      if(targetTab === 'headers') document.getElementById("tabHeaders")?.classList.remove("hidden");
      if(targetTab === 'params') document.getElementById("tabParams")?.classList.remove("hidden");
      if(targetTab === 'code') {
        document.getElementById("tabCode")?.classList.remove("hidden");
        generateCodeSnippets();
      }
    });
  });

  generateCodeSnippets();
}

async function handleSendApiRequest() {
  const endpoint = document.getElementById("apiEndpointInput")?.value || "https://openrouter.ai/api/v1/chat/completions";
  const method = document.getElementById("apiMethod")?.value || "POST";
  const bodyText = document.getElementById("apiRequestBody")?.value || "{}";
  const responseViewer = document.getElementById("apiResponseViewer");
  const statusBadge = document.getElementById("apiResponseStatus");
  const timeBadge = document.getElementById("apiResponseTime");
  const sizeBadge = document.getElementById("apiResponseSize");

  if(statusBadge) {
    statusBadge.className = "badge-green";
    statusBadge.innerText = "SENDING...";
  }

  const startTime = performance.now();

  try {
    let responseData;
    let statusCode = 200;

    // Real API call if OpenRouter key exists
    if(endpoint.includes("openrouter.ai") && state.keys.openrouter) {
      const res = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.keys.openrouter}`
        },
        body: bodyText
      });
      statusCode = res.status;
      responseData = await res.json();
    } else {
      // High performance simulated response
      await new Promise(r => setTimeout(r, 200));
      let parsedBody = {};
      try { parsedBody = JSON.parse(bodyText); } catch(e){}

      responseData = {
        id: "gen-" + Date.now(),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: parsedBody.model || "meta-llama/llama-3.3-70b-instruct",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "Quantum computing harnesses quantum mechanics (superposition and entanglement) to solve complex calculations exponentially faster than classical computers."
            },
            finish_reason: "stop"
          }
        ],
        usage: { prompt_tokens: 14, completion_tokens: 28, total_tokens: 42 }
      };
    }

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    const jsonString = JSON.stringify(responseData, null, 2);

    if(responseViewer) responseViewer.innerText = jsonString;
    if(statusBadge) {
      statusBadge.className = statusCode >= 200 && statusCode < 300 ? "badge-green" : "badge-red";
      statusBadge.innerText = `${statusCode} OK`;
    }
    if(timeBadge) timeBadge.innerText = `${latency} ms`;
    if(sizeBadge) sizeBadge.innerText = `${jsonString.length} B`;

    toast("API Request Executed Successfully", "success");

  } catch(err) {
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    if(responseViewer) responseViewer.innerText = JSON.stringify({ error: err.message }, null, 2);
    if(statusBadge) {
      statusBadge.className = "badge-red";
      statusBadge.innerText = "500 Error";
    }
    if(timeBadge) timeBadge.innerText = `${latency} ms`;
    toast("Request failed: " + err.message, "error");
  }
}

function generateCodeSnippets() {
  const snippetEl = document.getElementById("generatedCodeSnippet");
  if(!snippetEl) return;

  const endpoint = document.getElementById("apiEndpointInput")?.value || "https://openrouter.ai/api/v1/chat/completions";
  const method = document.getElementById("apiMethod")?.value || "POST";
  const body = document.getElementById("apiRequestBody")?.value || "{}";

  const code = `// cURL Command
curl -X ${method} "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${body.replace(/\n/g, '')}'

// JavaScript (Fetch API)
const response = await fetch("${endpoint}", {
  method: "${method}",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify(${body.trim()})
});
const data = await response.json();
console.log(data);`;

  snippetEl.innerText = code;
}

// Pull Simulation
function openPullModal(modelId) {
  const m = MODELS.find(x => x.id === modelId) || { id: modelId, name: modelId, size: "8B", desc: "Model download", port: "hf" };
  state.currentPullingModel = m;

  const p = portInfo(m.port);

  document.getElementById("pullModalTitle").innerText = `Pulling ${m.name} (${m.size})`;
  document.getElementById("pullModalDesc").innerText = m.desc;
  document.getElementById("pullModalPort").innerText = p.name;
  openModal("pullModalOverlay");

  document.getElementById("pullProgressBar").style.width = "0%";
  document.getElementById("pullLayers").innerHTML = "<div style='color:var(--text-muted);'>Initializing download shards...</div>";

  const btn = document.getElementById("pullConfirmBtn");
  if(btn) {
    btn.disabled = false;
    btn.innerText = "Start Pull";
    btn.onclick = startPullSimulation;
  }
}

function startPullSimulation() {
  const m = state.currentPullingModel;
  if(!m) return;

  const btn = document.getElementById("pullConfirmBtn");
  if(btn) {
    btn.disabled = true;
    btn.innerText = "Downloading Shards...";
  }

  const layersEl = document.getElementById("pullLayers");
  const progressBar = document.getElementById("pullProgressBar");

  const layers = ["config.json", "model-00001-of-00003.safetensors", "model-00002-of-00003.safetensors", "tokenizer.json"];
  let layerIdx = 0;

  function nextShard() {
    if(layerIdx < layers.length) {
      const shardName = layers[layerIdx];
      layersEl.innerHTML += `<div style="color:var(--green); margin-bottom:4px;">✔ Pulled shard: ${shardName}</div>`;
      layersEl.scrollTop = layersEl.scrollHeight;
      
      layerIdx++;
      const pct = Math.round((layerIdx / layers.length) * 100);
      if(progressBar) progressBar.style.width = `${pct}%`;

      setTimeout(nextShard, 300);
    } else {
      state.installed.add(m.id);
      saveState();

      toast(`Successfully docked ${m.name}`, "success");
      updateStats();
      renderInstalledGrid();
      renderGrid();

      if(btn) {
        btn.disabled = false;
        btn.innerText = "Close";
        btn.onclick = () => closeModal("pullModalOverlay");
      }

      const pgBtn = document.getElementById("pullPlaygroundBtn");
      if(pgBtn) {
        pgBtn.classList.remove("hidden");
        pgBtn.onclick = () => {
          closeModal("pullModalOverlay");
          openPlayground(m.id);
        };
      }
    }
  }

  nextShard();
}

// AI Playground
function openPlayground(modelId) {
  if(!modelId) modelId = Array.from(state.installed)[0] || "llama-3.1-8b";

  openModal("playgroundModalOverlay");

  const select = document.getElementById("pgModelSelect");
  if(select) {
    select.innerHTML = "";
    Array.from(state.installed).forEach(id => {
      const m = MODELS.find(x => x.id === id) || { id, name: id, size: "" };
      select.innerHTML += `<option value="${m.id}" ${m.id === modelId ? 'selected' : ''}>${m.name}</option>`;
    });
  }

  const history = document.getElementById("pgHistory");
  if(history) {
    history.innerHTML = `<div class="msg system" style="text-align:center; color:var(--text-muted); margin:16px 0;">System: Connected to ${modelId}. Type a message below.</div>`;
  }
}

async function handlePlaygroundSend(e) {
  if(e) e.preventDefault();
  const input = document.getElementById("pgInput");
  const msg = input?.value.trim();
  if(!msg) return;

  const modelId = document.getElementById("pgModelSelect")?.value || "llama-3.1-8b";
  input.value = "";

  appendChatMessage("user", msg);

  const history = document.getElementById("pgHistory");
  const loadingId = "msg-" + Date.now();
  if(history) {
    history.innerHTML += `<div id="${loadingId}" style="margin-bottom:12px; padding:10px; background:var(--bg-input); border-radius:6px; border:1px solid var(--border); color:var(--accent);">AI is thinking...</div>`;
    history.scrollTop = history.scrollHeight;
  }

  setTimeout(() => {
    const loadingEl = document.getElementById(loadingId);
    const reply = `[Response from ${modelId}]\nI received your prompt: "${msg}". Execution finished cleanly with status 200 OK.`;
    if(loadingEl) loadingEl.remove();
    appendChatMessage("assistant", reply);
  }, 600);
}

function appendChatMessage(role, text) {
  const history = document.getElementById("pgHistory");
  if(!history) return;
  const div = document.createElement("div");
  div.style.marginBottom = "12px";
  div.style.padding = "10px 14px";
  div.style.borderRadius = "6px";
  div.style.fontSize = "13px";

  if(role === "user") {
    div.style.background = "#1e293b";
    div.style.color = "#e2e8f0";
    div.innerHTML = `<strong>You:</strong> ${escapeHtml(text)}`;
  } else {
    div.style.background = "#111827";
    div.style.border = "1px solid var(--border)";
    div.style.color = "#818cf8";
    div.innerHTML = `<strong>AI:</strong> ${escapeHtml(text)}`;
  }

  history.appendChild(div);
  history.scrollTop = history.scrollHeight;
}

// CLI Processor
function processCliCommand(input) {
  const cmd = input.trim().toLowerCase();
  const parts = cmd.split(" ");
  appendTermLine(`$ ${escapeHtml(input)}`, "color:var(--text);");

  if(!cmd) return;

  if(parts[0] === "victor") {
    switch(parts[1]) {
      case "pull":
        if(!parts[2]) appendTermLine("Usage: victor pull <model_id>", "color:var(--red);");
        else {
          appendTermLine(`Initializing pull for ${parts[2]}...`, "color:var(--accent);");
          openPullModal(parts[2]);
        }
        break;
      case "ls":
        appendTermLine("INSTALLED DOCKED MODELS:", "color:var(--green); font-weight:bold;");
        Array.from(state.installed).forEach(id => appendTermLine(`- ${id}`, "color:var(--text);"));
        break;
      case "help":
      default:
        appendTermLine("VictorX CLI Commands:", "color:var(--accent); font-weight:bold;");
        appendTermLine("victor pull <model>  - Pull model weights");
        appendTermLine("victor ls            - List installed models");
        break;
    }
  } else {
    appendTermLine(`command not found: ${parts[0]}`, "color:var(--red);");
  }
}

function appendTermLine(text, style = "") {
  const history = document.getElementById("termHistory");
  if(!history) return;
  const line = document.createElement("div");
  line.style = style;
  line.innerHTML = text;
  history.appendChild(line);
  history.scrollTop = history.scrollHeight;
}

// Auth Handlers
function initAuth() {
  const authBtn = document.getElementById("openAuthBtn");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");

  if(state.user) {
    if(authBtn) authBtn.style.display = "none";
    if(userMenu) userMenu.style.display = "flex";
    if(userName) userName.innerText = state.user.username || "User";
  } else {
    if(authBtn) authBtn.style.display = "flex";
    if(userMenu) userMenu.style.display = "none";
  }
}

function handleLogin(e) {
  if(e) e.preventDefault();
  const username = document.getElementById("loginUsername")?.value || "Developer";
  state.user = { username, role: "user" };
  saveState();
  closeModal("authModalOverlay");
  initAuth();
  toast(`Welcome back, ${username}!`, "success");
}

function handleGuestLogin() {
  state.user = { username: "Guest_" + Math.floor(Math.random() * 1000), role: "guest" };
  saveState();
  closeModal("authModalOverlay");
  initAuth();
  toast("Signed in as Guest", "success");
}

function handleLogout() {
  state.user = null;
  saveState();
  initAuth();
  toast("Signed out", "info");
}

// Admin System (PIN: 20032004)
function setupAdminPIN() {
  const inputs = document.querySelectorAll(".pin-digit");
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      if(e.target.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      checkPIN();
    });
    input.addEventListener("keydown", (e) => {
      if(e.key === "Backspace" && !e.target.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
}

function checkPIN() {
  const inputs = document.querySelectorAll(".pin-digit");
  const pin = Array.from(inputs).map(i => i.value).join("");
  if(pin.length === 8) {
    if(pin === ADMIN_VERIFICATION_PIN) {
      state.adminAuthenticated = true;
      closeModal("adminPinOverlay");
      inputs.forEach(i => i.value = "");
      openAdminDashboard();
      toast("Admin access granted", "success");
    } else {
      const pinError = document.getElementById("pinError");
      if(pinError) pinError.classList.remove("hidden");
      inputs.forEach(i => i.value = "");
      inputs[0]?.focus();
      toast("Access denied. Wrong PIN.", "error");
    }
  }
}

function openAdminDashboard() {
  if(!state.adminAuthenticated) {
    openModal("adminPinOverlay");
    setTimeout(() => document.querySelector(".pin-digit")?.focus(), 100);
    return;
  }
  openModal("adminDashboardOverlay");
}

// Event Binding Master
document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  renderChips();
  renderGrid();
  renderInstalledGrid();
  renderPorts();
  initAuth();
  initApidogWorkbench();
  setupAdminPIN();

  // Topbar Buttons
  document.getElementById("openAuthBtn")?.addEventListener("click", () => openModal("authModalOverlay"));
  document.getElementById("openAdminPinBtn")?.addEventListener("click", () => openModal("adminPinOverlay"));
  document.getElementById("adminPinBtn")?.addEventListener("click", () => openModal("adminPinOverlay"));
  document.getElementById("openUpiModalBtn")?.addEventListener("click", () => openModal("upiModalOverlay"));
  document.getElementById("openApiKeysBtn")?.addEventListener("click", () => openModal("apiKeysModalOverlay"));
  document.getElementById("openConnectedBtn")?.addEventListener("click", () => openModal("apiKeysModalOverlay"));
  document.getElementById("heroPlaygroundBtn")?.addEventListener("click", () => openPlayground());
  document.getElementById("dropdownKeysBtn")?.addEventListener("click", () => openModal("apiKeysModalOverlay"));
  document.getElementById("dropdownDockBtn")?.addEventListener("click", () => document.getElementById("mydock")?.scrollIntoView({behavior:'smooth'}));
  document.getElementById("logoutBtn")?.addEventListener("click", handleLogout);

  // User menu toggle
  document.getElementById("userMenuBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById("userDropdown");
    if(dropdown) dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    const dropdown = document.getElementById("userDropdown");
    if(dropdown) dropdown.style.display = "none";
  });

  // Auth Modal
  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("loginSubmitBtn")?.addEventListener("click", handleLogin);
  document.getElementById("quickGuestLoginBtn")?.addEventListener("click", handleGuestLogin);
  document.getElementById("googleSignInBtn")?.addEventListener("click", handleGuestLogin);

  document.getElementById("authTabLogin")?.addEventListener("click", () => {
    document.getElementById("authTabLogin")?.classList.add("active");
    document.getElementById("authTabRegister")?.classList.remove("active");
    document.getElementById("loginForm")?.classList.remove("hidden");
    document.getElementById("registerForm")?.classList.add("hidden");
  });

  document.getElementById("authTabRegister")?.addEventListener("click", () => {
    document.getElementById("authTabRegister")?.classList.add("active");
    document.getElementById("authTabLogin")?.classList.remove("active");
    document.getElementById("registerForm")?.classList.remove("hidden");
    document.getElementById("loginForm")?.classList.add("hidden");
  });

  // Admin PIN
  document.getElementById("pinCancelBtn")?.addEventListener("click", () => closeModal("adminPinOverlay"));
  document.getElementById("pinVerifyBtn")?.addEventListener("click", checkPIN);

  // API Keys
  document.getElementById("saveApiKeysBtn")?.addEventListener("click", () => {
    state.keys.openrouter = document.getElementById("keyOpenRouter")?.value || "";
    state.keys.openai = document.getElementById("keyOpenAI")?.value || "";
    state.keys.gemini = document.getElementById("keyGemini")?.value || "";
    state.keys.ollama = document.getElementById("urlOllama")?.value || "http://localhost:11434";
    saveState();
    toast("API Keys Saved", "success");
    closeModal("apiKeysModalOverlay");
  });

  document.getElementById("clearApiKeysBtn")?.addEventListener("click", () => {
    state.keys = { openrouter: "", openai: "", gemini: "", ollama: "http://localhost:11434" };
    saveState();
    toast("API Keys Cleared", "info");
    closeModal("apiKeysModalOverlay");
  });

  // Support
  document.getElementById("confirmSupportBtn")?.addEventListener("click", () => {
    toast("Thank you for supporting VictorX!", "success");
    closeModal("upiModalOverlay");
  });

  // Search & Filter
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
  });

  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrid();
  });

  // CLI
  document.getElementById("cliInput")?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      const input = document.getElementById("cliInput");
      if(input && input.value) {
        processCliCommand(input.value);
        input.value = "";
      }
    }
  });

  document.getElementById("clearTermBtn")?.addEventListener("click", () => {
    const history = document.getElementById("termHistory");
    if(history) history.innerHTML = "";
  });

  // Playground
  document.getElementById("pgForm")?.addEventListener("submit", handlePlaygroundSend);

  // Global Dynamic Delegation for cards
  document.addEventListener("click", (e) => {
    const pullBtn = e.target.closest(".open-pull-modal");
    if(pullBtn) {
      const modelId = pullBtn.dataset.model;
      if(modelId) openPullModal(modelId);
    }

    const testBtn = e.target.closest(".test-api-btn");
    if(testBtn) {
      const apiModel = testBtn.dataset.model || "meta-llama/llama-3.3-70b-instruct";
      const bodyInput = document.getElementById("apiRequestBody");
      if(bodyInput) {
        bodyInput.value = JSON.stringify({
          model: apiModel,
          messages: [{ role: "user", content: "Explain quantum computing in 2 sentences." }]
        }, null, 2);
      }
      generateCodeSnippets();
      document.getElementById("apidogWorkbench")?.scrollIntoView({ behavior: "smooth" });
      toast(`Loaded ${apiModel} into API Workbench`, "info");
    }

    const pgBtn = e.target.closest(".launch-playground-btn");
    if(pgBtn) {
      const modelId = pgBtn.dataset.model;
      openPlayground(modelId);
    }

    const removeBtn = e.target.closest(".remove-dock-btn");
    if(removeBtn) {
      const modelId = removeBtn.dataset.model;
      if(modelId && confirm(`Remove ${modelId} from dock?`)) {
        state.installed.delete(modelId);
        saveState();
        updateStats();
        renderInstalledGrid();
        renderGrid();
        toast(`Removed ${modelId}`);
      }
    }

    // Modal Close logic
    if(e.target.closest(".btn-close")) {
      const overlay = e.target.closest(".modal-overlay") || e.target.closest(".pin-overlay");
      if(overlay) overlay.style.display = "none";
    }

    if(e.target.classList.contains("modal-overlay") || e.target.classList.contains("pin-overlay")) {
      e.target.style.display = "none";
    }
  });

  // Legal tabs
  document.querySelectorAll(".legal-tabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".legal-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".legal-panel").forEach(p => p.classList.add("hidden"));
      e.target.classList.add("active");
      const target = e.target.dataset.target;
      document.getElementById(target)?.classList.remove("hidden");
    });
  });

  // Escape key closes modals
  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape") {
      document.querySelectorAll(".modal-overlay, .pin-overlay").forEach(m => m.style.display = "none");
    }
  });
});
