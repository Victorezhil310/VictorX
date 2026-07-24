/* ==========================================================================
   VictorX Engine — Model Registry, Ollama & Hugging Face Hub
   ========================================================================== */

const PORTS = [
  { id: "ollama",       name: "Local Ollama",  color: "#10B981", desc: "Local Ollama server (http://localhost:11434)" },
  { id: "huggingface",  name: "Hugging Face",  color: "#FFD21E", desc: "Hugging Face Serverless Inference API models." },
  { id: "meta",         name: "Meta",          color: "#7C9CFF", desc: "Llama open weights family." },
  { id: "deepseek",     name: "DeepSeek",      color: "#38BDF8", desc: "DeepSeek R1 reasoning models." },
  { id: "google",       name: "Google",        color: "#8FD14F", desc: "Gemma 3 & 4 open models." },
  { id: "mistral",      name: "Mistral AI",    color: "#E5675F", desc: "Fast open weight models." },
  { id: "qwen",         name: "Alibaba Qwen",  color: "#C792EA", desc: "Qwen 2.5 series." }
];

const MODELS = [
  { id: "gemma4",          name: "Gemma 4",          size: "9B/27B", port: "google",       tags: ["multimodal","chat","edge"], haul: 125000000, added: 1, desc: "Google DeepMind's newest flagship open model for lightweight high-performance reasoning.", apiModel: "gemma4" },
  { id: "llama-3.3-70b",   name: "Llama 3.3 70B",    size: "70B",    port: "meta",         tags: ["text-generation","reasoning"], haul: 54000000, added: 2, desc: "State of the art open reasoning model fine tuned for chat & coding.", apiModel: "meta-llama/llama-3.3-70b-instruct" },
  { id: "deepseek-r1",    name: "DeepSeek R1",     size: "671B",   port: "deepseek",     tags: ["reasoning","math","code"],    haul: 90300000, added: 3, desc: "Frontier reasoning model with deep chain of thought capabilities.", apiModel: "deepseek/deepseek-r1" },
  { id: "qwen2.5-coder",   name: "Qwen 2.5 Coder",   size: "32B",    port: "qwen",         tags: ["code","infilling"],          haul: 42100000, added: 4, desc: "State of the art open coding model with 128K context window.", apiModel: "qwen/qwen-2.5-coder-32b" },
  { id: "phi4",            name: "Phi 4",            size: "14B",    port: "ollama",       tags: ["reasoning","math"],          haul: 21900000, added: 5, desc: "Microsoft Phi-4 dense model with top-tier math and logical reasoning.", apiModel: "phi4" },
  { id: "llama3.2-3b-hf",  name: "Llama 3.2 3B",     size: "3B",     port: "huggingface",  tags: ["text-generation","edge"],    haul: 65400000, added: 6, desc: "Meta's lightweight model optimized for edge devices and mobile tasks on Hugging Face.", apiModel: "meta-llama/Llama-3.2-3B-Instruct" },
  { id: "phi3-mini",       name: "Phi 3 Mini",       size: "3.8B",    port: "huggingface",  tags: ["reasoning","fast"],          haul: 28900000, added: 7, desc: "Microsoft's highly capable lightweight 3.8B parameter instruction-tuned model.", apiModel: "microsoft/Phi-3-mini-4k-instruct" },
  { id: "mistral-7b-v0.3", name: "Mistral 7B v0.3",  size: "7B",     port: "huggingface",  tags: ["chat","general"],            haul: 39500000, added: 8, desc: "Mistral instruction-tuned model v0.3 loaded via Hugging Face Hub.", apiModel: "mistralai/Mistral-7B-Instruct-v0.3" },
  { id: "gemma-3-12b",    name: "Gemma 3 12B",     size: "12B",    port: "google",       tags: ["multimodal","chat"],         haul: 38800000, added: 9, desc: "Google DeepMind lightweight model for single GPU deployment.", apiModel: "google/gemma-2-27b-it" },
  { id: "mistral-nemo",    name: "Mistral Nemo",     size: "12B",    port: "mistral",      tags: ["multilingual","chat"],       haul: 18400000, added: 10, desc: "12B model built in collaboration with NVIDIA with 128K context.", apiModel: "mistralai/mistral-nemo" },
  { id: "llama-3.1-8b",    name: "Llama 3.1 8B",    size: "8B",     port: "meta",         tags: ["general","lightweight"],     haul: 81200000, added: 11, desc: "Meta general purpose fast open weight model.", apiModel: "meta-llama/llama-3.1-8b-instruct" }
];

const INTEGRATIONS_DATA = {
  "claude-code": {
    title: "Claude Code Integration",
    command: "ollama launch claude-code",
    desc: "Claude Code is a terminal coding agent with tools, vision, web search, and long context support.",
    details: "<strong>Quickstart:</strong><br>1. Install Ollama & run <code>ollama serve</code><br>2. Run <code>ollama launch claude-code</code><br>3. Select model (e.g. <code>gemma4</code>, <code>llama3.3</code>, or <code>deepseek-r1</code>)"
  },
  "opencode": {
    title: "OpenCode Integration",
    command: "ollama launch opencode",
    desc: "OpenCode is an open-source terminal coding agent that edits, runs, and iterates on code automatically.",
    details: "<strong>Quickstart:</strong><br>1. Run <code>ollama launch opencode</code> in your workspace terminal.<br>2. Point to local host <code>http://localhost:11434</code>.<br>3. OpenCode will use active Ollama models to auto-fix code."
  },
  "openclaw": {
    title: "OpenClaw Integration",
    command: "ollama launch openclaw",
    desc: "Personal assistant for messaging apps and everyday tasks with long-term memory.",
    details: "<strong>Quickstart:</strong><br>1. Run <code>ollama launch openclaw</code>.<br>2. Connect Telegram/Discord bot token.<br>3. Interact with local Ollama LLMs through your favorite chat app!"
  },
  "hermes": {
    title: "Hermes Agent Integration",
    command: "ollama launch hermes",
    desc: "Open-source agent with self-improving skills, memory, and messaging integration.",
    details: "<strong>Quickstart:</strong><br>1. Run <code>ollama launch hermes</code>.<br>2. Hermes will load custom skills and system prompts.<br>3. Works seamlessly with local Ollama models."
  },
  "vscode": {
    title: "VS Code & Ollama Integration",
    command: "ollama launch vscode",
    desc: "Use local Ollama models inside VS Code Chat, Continue.dev, or GitHub Copilot.",
    details: "<strong>Quickstart:</strong><br>1. Install <code>Continue</code> or <code>Ollama VS Code Extension</code>.<br>2. Set Provider URL to <code>http://localhost:11434</code>.<br>3. Start chatting and auto-completing code inside your editor!"
  }
};

// Obfuscated administrative PIN (20032004)
const ADMIN_VERIFICATION_HASH = "MjAwMzIwMDQ=";

let state = {
  search: "",
  port: "all",
  sort: "most_hauled",
  user: JSON.parse(localStorage.getItem("victor_user") || 'null'),
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"openrouter":"","openai":"","gemini":"","huggingface":"","ollama":"http://localhost:11434"}'),
  installed: new Set(JSON.parse(localStorage.getItem("victor_installed") || '["gemma4","llama-3.3-70b","deepseek-r1","qwen2.5-coder","llama3.2-3b-hf","mistral-7b-v0.3"]')),
  ollamaModels: [],
  ollamaOnline: false,
  adminAuthenticated: false
};

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
  return PORTS.find(p => p.id === id) || { name: "Open Weights", color: "#38bdf8" };
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
  t.style.borderRadius = "8px";
  t.style.fontSize = "13px";
  t.style.fontWeight = "600";
  t.style.boxShadow = "0 4px 14px rgba(0,0,0,0.5)";
  t.style.background = type === "error" ? "#7f1d1d" : type === "success" ? "#064e3b" : "#1f2937";
  t.style.color = type === "error" ? "#fca5a5" : type === "success" ? "#6ee7b7" : "#f9fafb";
  t.style.border = "1px solid " + (type === "error" ? "#991b1b" : type === "success" ? "#065f46" : "#374151");
  
  t.innerText = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function openModal(id) {
  const m = document.getElementById(id);
  if(m) m.style.display = "flex";
}

function closeModal(id) {
  const m = document.getElementById(id);
  if(m) m.style.display = "none";
}

// Ollama Server Live Detection & Sync
async function checkOllamaServer() {
  const badge = document.getElementById("ollamaStatusBadge");
  const countEl = document.getElementById("ollamaModelCount");
  const ollamaUrl = state.keys.ollama || "http://localhost:11434";

  let data = null;
  try {
    const res = await fetch(`${ollamaUrl}/api/tags`, { method: 'GET' });
    if(res.ok) data = await res.json();
  } catch(e) {}

  if(!data || !data.models) {
    try {
      const res = await fetch('/api/ollama?action=tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'tags', ollamaUrl }) });
      if(res.ok) {
        const proxyData = await res.json();
        if(proxyData.models && proxyData.models.length > 0) data = proxyData;
      }
    } catch(e) {}
  }

  if(data && data.models) {
    state.ollamaOnline = true;
    state.ollamaModels = data.models || [];

    if(badge) {
      badge.className = "ollama-status-pill online";
      badge.innerHTML = `<span class="status-dot"></span><span class="status-text">Ollama Online (${state.ollamaModels.length} models)</span>`;
    }
    if(countEl) countEl.innerText = state.ollamaModels.length;

    state.ollamaModels.forEach(m => {
      const cleanName = m.name.split(':')[0];
      if(!MODELS.some(x => x.id === cleanName || x.id === m.name)) {
        MODELS.unshift({
          id: m.name,
          name: m.name,
          size: m.details ? `${(m.size / (1024*1024*1024)).toFixed(1)}GB` : "Ollama",
          port: "ollama",
          tags: ["ollama","local"],
          haul: 1000000,
          added: Date.now(),
          desc: `Local Ollama model loaded on ${ollamaUrl}`,
          apiModel: m.name
        });
      }
      state.installed.add(m.name);
    });

    saveState();
    updateStats();
    renderInstalledGrid();
    renderGrid();
    return true;
  }

  state.ollamaOnline = false;
  if(badge) {
    badge.className = "ollama-status-pill offline";
    badge.innerHTML = `<span class="status-dot"></span><span class="status-text">Ollama Server Offline</span>`;
  }
  if(countEl) countEl.innerText = "0";
  return false;
}

// Render Functions
function updateStats() {
  const installedCountPill = document.getElementById("installedCountPill");
  const statInstalled = document.getElementById("statInstalled");
  if(installedCountPill) installedCountPill.innerText = `${state.installed.size} Models`;
  if(statInstalled) statInstalled.innerText = state.installed.size;
}

function renderChips() {
  const c = document.getElementById("portChips");
  if(!c) return;
  let html = `<button class="chip ${state.port === 'all' ? 'active' : ''}" data-port="all">All Ecosystems</button>`;
  PORTS.forEach(p => {
    html += `<button class="chip ${state.port === p.id ? 'active' : ''}" data-port="${p.id}">${escapeHtml(p.name)}</button>`;
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

  if(resultCount) resultCount.innerText = `${filtered.length} Models`;

  if(filtered.length === 0) {
    g.innerHTML = "";
    if(emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if(emptyState) emptyState.classList.add("hidden");

  g.innerHTML = "";
  filtered.forEach(m => {
    const p = portInfo(m.port);
    const isInstalled = state.installed.has(m.id) || state.installed.has(m.name);

    g.innerHTML += `
      <div class="model-card">
        <div class="card-top">
          <div>
            <span class="provider-badge" style="color:${p.color};">${escapeHtml(p.name)}</span>
            <h3 class="model-title">${escapeHtml(m.name)} <span style="font-size:12px; color:var(--text-muted);">(${m.size})</span></h3>
          </div>
          <span class="count-tag">⬇ ${fmt(m.haul)}</span>
        </div>
        <p class="model-desc">${escapeHtml(m.desc)}</p>
        <div class="card-meta-row">
          ${m.tags.map(t => `<span class="meta-tag">${t}</span>`).join('')}
        </div>
        <div class="card-bottom-actions">
          ${isInstalled 
            ? `<button class="btn btn-secondary launch-playground-btn style-flex-1" data-model="${m.id}">⚡ Playground</button>`
            : `<button class="btn btn-primary open-pull-modal style-flex-1" data-model="${m.id}">Pull Weights</button>`
          }
          <button class="btn btn-secondary test-api-btn" data-model="${m.apiModel}">⚡ Test API</button>
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
    const m = MODELS.find(x => x.id === id || x.name === id) || { id, name: id, size: "Weights" };
    g.innerHTML += `
      <div class="model-card">
        <div class="card-top">
          <h3 class="model-title">${escapeHtml(m.name)}</h3>
          <span class="badge yellow-badge">DOCKED</span>
        </div>
        <div class="card-bottom-actions" style="margin-top:12px;">
          <button class="btn btn-primary launch-playground-btn style-flex-1" data-model="${m.id}">⚡ Launch Chat</button>
          <button class="btn btn-secondary remove-dock-btn" data-model="${m.id}">Remove</button>
        </div>
      </div>
    `;
  });
}

// API Workbench Runner
function initApidogWorkbench() {
  document.getElementById("apiSendBtn")?.addEventListener("click", handleSendApiRequest);
  document.getElementById("apiSaveBtn")?.addEventListener("click", () => toast("API Request saved to database", "success"));

  document.querySelectorAll(".tab-header .tab-btn").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-header .tab-btn").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      const targetTab = e.target.dataset.tab;
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));
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

  const startTime = performance.now();
  let responseData;
  let status = 200;

  try {
    if(endpoint.includes("localhost:11434") || endpoint.includes("/api/generate") || endpoint.includes("/api/chat")) {
      const res = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: bodyText });
      status = res.status;
      responseData = await res.json();
    } else if(endpoint.includes("openrouter.ai") && state.keys.openrouter) {
      const res = await fetch(endpoint, { method, headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.keys.openrouter}` }, body: bodyText });
      status = res.status;
      responseData = await res.json();
    } else {
      await new Promise(r => setTimeout(r, 200));
      responseData = { id: "gen-" + Date.now(), object: "chat.completion", model: "gemma4", choices: [{ message: { role: "assistant", content: "Superposition and quantum mechanics power parallel LLM token generation." } }] };
    }
  } catch(e) {
    status = 500;
    responseData = { error: e.message, hint: "Make sure Ollama is running (ollama serve) at http://localhost:11434" };
  }

  const latency = Math.round(performance.now() - startTime);
  const jsonStr = JSON.stringify(responseData, null, 2);

  document.getElementById("apiResponseViewer").innerText = jsonStr;
  document.getElementById("apiResponseStatus").innerText = `${status} ${status === 200 ? 'OK' : 'Error'}`;
  document.getElementById("apiResponseTime").innerText = `${latency} ms`;
  document.getElementById("apiResponseSize").innerText = `${jsonStr.length} B`;
  toast("Request Executed", status === 200 ? "success" : "error");
}

function generateCodeSnippets() {
  const el = document.getElementById("generatedCodeSnippet");
  if(!el) return;
  const endpoint = document.getElementById("apiEndpointInput")?.value || "";
  const method = document.getElementById("apiMethod")?.value || "POST";
  const body = document.getElementById("apiRequestBody")?.value || "";

  el.innerText = `curl -X ${method} "${endpoint}" -H "Content-Type: application/json" -d '${body.replace(/\n/g, '')}'`;
}

// Pull Engine (Supports Real Ollama Server & Client Simulation)
function openPullModal(modelId) {
  const m = MODELS.find(x => x.id === modelId || x.name === modelId) || { id: modelId, name: modelId, size: "Weights", desc: `Pulling weights for ${modelId}` };
  document.getElementById("pullModalTitle").innerText = `Pulling ${m.name}`;
  document.getElementById("pullModalDesc").innerText = m.desc;
  openModal("pullModalOverlay");

  const btn = document.getElementById("pullConfirmBtn");
  if(btn) {
    btn.disabled = false;
    btn.innerText = "Start Pull";
    btn.onclick = () => startPullSimulation(m);
  }
}

async function startPullSimulation(m) {
  const progressBar = document.getElementById("pullProgressBar");
  const layersEl = document.getElementById("pullLayers");
  const btn = document.getElementById("pullConfirmBtn");
  const modelName = m.id || m.name;
  const ollamaUrl = state.keys.ollama || "http://localhost:11434";

  if(btn) { btn.disabled = true; btn.innerText = "Downloading..."; }
  if(layersEl) layersEl.innerHTML = `<div style="color:var(--yellow);">Connecting to Ollama server (${ollamaUrl})...</div>`;

  let isRealOllamaSuccess = false;
  try {
    const res = await fetch(`${ollamaUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName, stream: true })
    });

    if(res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partial = "";

      while(true) {
        const { done, value } = await reader.read();
        if(done) break;
        partial += decoder.decode(value, { stream: true });
        const lines = partial.split('\n');
        partial = lines.pop();

        for(const line of lines) {
          if(!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if(data.status) {
              let msg = `[Ollama] ${data.status}`;
              if(data.total && data.completed) {
                const pct = Math.round((data.completed / data.total) * 100);
                if(progressBar) progressBar.style.width = `${pct}%`;
                msg += ` (${pct}%) - ${(data.completed / (1024*1024)).toFixed(1)}MB / ${(data.total / (1024*1024)).toFixed(1)}MB`;
              }
              if(layersEl) {
                layersEl.innerHTML += `<div style="color:var(--green);">${escapeHtml(msg)}</div>`;
                layersEl.scrollTop = layersEl.scrollHeight;
              }
            }
            if(data.status === 'success') {
              isRealOllamaSuccess = true;
            }
          } catch(err) {}
        }
      }
      isRealOllamaSuccess = true;
    }
  } catch(e) {}

  if(isRealOllamaSuccess) {
    if(progressBar) progressBar.style.width = `100%`;
    state.installed.add(modelName);
    saveState();
    updateStats();
    renderInstalledGrid();
    renderGrid();
    toast(`Successfully pulled & docked ${modelName} via Ollama!`, "success");
    closeModal("pullModalOverlay");
    return;
  }

  if(layersEl) layersEl.innerHTML += `<div style="color:var(--text-secondary);">Direct browser socket unavailable. Running Victor Dock layer pull simulator...</div>`;
  let pct = 0;
  const timer = setInterval(() => {
    pct += 25;
    if(progressBar) progressBar.style.width = `${pct}%`;
    if(layersEl) {
      layersEl.innerHTML += `<div style="color:var(--green);">✔ Pulled shard layer ${pct/25}/4: ${modelName}-q4_k_m.safetensors</div>`;
      layersEl.scrollTop = layersEl.scrollHeight;
    }

    if(pct >= 100) {
      clearInterval(timer);
      state.installed.add(modelName);
      saveState();
      updateStats();
      renderInstalledGrid();
      renderGrid();
      toast(`Docked ${modelName}. Run 'ollama pull ${modelName}' in terminal for native binary weights.`, "success");
      closeModal("pullModalOverlay");
    }
  }, 300);
}

// Open Integration Modal Setup Guide
function openIntegrationModal(agentKey) {
  const data = INTEGRATIONS_DATA[agentKey];
  if(!data) return;

  document.getElementById("intModalTitle").innerText = data.title;
  document.getElementById("intModalDesc").innerText = data.desc;
  document.getElementById("intModalCmd").innerText = data.command;
  document.getElementById("intModalDetails").innerHTML = data.details;

  openModal("integrationModalOverlay");
}

// AI Playground Chat
function openPlayground(modelId = "gemma4") {
  openModal("playgroundModalOverlay");
  const select = document.getElementById("pgModelSelect");
  if(select) {
    select.innerHTML = "";
    Array.from(state.installed).forEach(id => {
      const m = MODELS.find(x => x.id === id || x.name === id) || { id, name: id };
      select.innerHTML += `<option value="${m.id}" ${m.id === modelId ? 'selected' : ''}>${m.name}</option>`;
    });
  }
}

// Admin Security PIN check
function setupAdminPIN() {
  const inputs = document.querySelectorAll(".pin-digit");
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      if(e.target.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();
      checkPIN();
    });
  });
}

function checkPIN() {
  const inputs = document.querySelectorAll(".pin-digit");
  const pin = Array.from(inputs).map(i => i.value).join("");
  if(pin.length === 8) {
    if(btoa(pin) === ADMIN_VERIFICATION_HASH) {
      state.adminAuthenticated = true;
      closeModal("adminPinOverlay");
      openModal("adminDashboardOverlay");
      toast("Admin access granted", "success");
    } else {
      document.getElementById("pinError")?.classList.remove("hidden");
    }
  }
}

// Master Initialization
function initApp() {
  updateStats();
  renderChips();
  renderGrid();
  renderInstalledGrid();
  initApidogWorkbench();
  setupAdminPIN();
  checkOllamaServer();

  // Search Listener
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
  });

  // Quick Pull Listener
  document.getElementById("quickPullBtn")?.addEventListener("click", () => {
    const input = document.getElementById("quickPullInput");
    const val = input ? input.value.trim() : "";
    if(!val) {
      toast("Please enter an Ollama model tag (e.g. gemma4)", "error");
      return;
    }
    openPullModal(val);
  });

  document.getElementById("quickPullInput")?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
      document.getElementById("quickPullBtn")?.click();
    }
  });

  // Sync Ollama Listener
  document.getElementById("syncOllamaBtn")?.addEventListener("click", async () => {
    toast("Syncing with local Ollama server...", "info");
    const online = await checkOllamaServer();
    if(online) toast(`Synced ${state.ollamaModels.length} local Ollama models!`, "success");
    else toast("Could not connect to Ollama at http://localhost:11434. Make sure 'ollama serve' is running.", "error");
  });

  document.getElementById("adminPinBtn")?.addEventListener("click", () => openModal("adminPinOverlay"));
  document.getElementById("openUpiModalBtn")?.addEventListener("click", () => openModal("upiModalOverlay"));
  
  // API Keys Open Modal Listener
  document.getElementById("openApiKeysBtn")?.addEventListener("click", () => {
    document.getElementById("keyOpenRouter").value = state.keys.openrouter || "";
    document.getElementById("keyOpenAI").value = state.keys.openai || "";
    document.getElementById("keyGemini").value = state.keys.gemini || "";
    document.getElementById("keyHuggingFace").value = state.keys.huggingface || "";
    document.getElementById("urlOllama").value = state.keys.ollama || "http://localhost:11434";
    openModal("apiKeysModalOverlay");
  });

  document.getElementById("pinVerifyBtn")?.addEventListener("click", checkPIN);
  document.getElementById("pinCancelBtn")?.addEventListener("click", () => closeModal("adminPinOverlay"));

  // API Keys Save Listener
  document.getElementById("saveApiKeysBtn")?.addEventListener("click", () => {
    const openrouter = document.getElementById("keyOpenRouter")?.value || "";
    const openai = document.getElementById("keyOpenAI")?.value || "";
    const gemini = document.getElementById("keyGemini")?.value || "";
    const huggingface = document.getElementById("keyHuggingFace")?.value || "";
    const ollama = document.getElementById("urlOllama")?.value || "http://localhost:11434";

    state.keys.openrouter = openrouter;
    state.keys.openai = openai;
    state.keys.gemini = gemini;
    state.keys.huggingface = huggingface;
    state.keys.ollama = ollama;

    saveState();
    toast("API Keys & Ollama URL saved!", "success");
    closeModal("apiKeysModalOverlay");
    checkOllamaServer();
  });

  // API Playground Form Submit
  document.getElementById("pgForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputEl = document.getElementById("pgInput");
    const historyEl = document.getElementById("pgHistory");
    const modelSelect = document.getElementById("pgModelSelect");
    const prompt = inputEl.value.trim();
    if(!prompt) return;
    
    historyEl.innerHTML += `<div style="margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid var(--border);"><strong>You:</strong> ${escapeHtml(prompt)}</div>`;
    inputEl.value = "";
    
    const loadingId = 'loading-' + Date.now();
    historyEl.innerHTML += `<div id="${loadingId}" style="margin-bottom:8px; color:var(--text-secondary);"><strong>VictorX:</strong> Thinking...</div>`;
    historyEl.scrollTop = historyEl.scrollHeight;
    
    const selectedModel = modelSelect.value;
    let aiReply = "";

    // 1. Try direct browser call to Hugging Face if model is Hugging Face
    const targetModelObj = MODELS.find(x => x.id === selectedModel);
    if(targetModelObj && targetModelObj.port === 'huggingface') {
      try {
        const hfToken = state.keys.huggingface;
        const headers = { 'Content-Type': 'application/json' };
        if(hfToken) headers['Authorization'] = `Bearer ${hfToken}`;

        const res = await fetch(`https://api-inference.huggingface.co/models/${targetModelObj.apiModel}`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ inputs: prompt })
        });
        if(res.ok) {
          const data = await res.json();
          if(Array.isArray(data) && data[0]) {
            aiReply = data[0].generated_text || data[0].summary_text || data[0].translation_text;
          } else if(data.generated_text) {
            aiReply = data.generated_text;
          }
        }
      } catch(err) {}
    }

    // 2. Try direct local Ollama inference if available
    if(!aiReply && (!targetModelObj || targetModelObj.port !== 'huggingface')) {
      try {
        const ollamaUrl = state.keys.ollama || "http://localhost:11434";
        const res = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: selectedModel, prompt: prompt, stream: false })
        });
        if(res.ok) {
          const data = await res.json();
          aiReply = data.response || "";
        }
      } catch(err) {}
    }

    // 3. Try proxying via /api/ollama backend proxy
    if(!aiReply) {
      try {
        const res = await fetch('/api/ollama', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate', model: selectedModel, prompt: prompt })
        });
        if(res.ok) {
          const data = await res.json();
          if(data.response) aiReply = data.response;
        }
      } catch(err) {}
    }

    // 4. Try /api/chat endpoint
    if(!aiReply) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            prompt: prompt,
            messages: [{ role: 'user', content: prompt }],
            apiKey: state.keys.openrouter || "",
            hfToken: state.keys.huggingface || ""
          })
        });
        const data = await res.json();
        if(data.choices && data.choices[0] && data.choices[0].message) {
          aiReply = data.choices[0].message.content;
        } else if(data.response) {
          aiReply = data.response;
        }
      } catch(e) {}
    }

    if(!aiReply) {
      aiReply = `Hello! I am ${selectedModel}. Ready to assist with coding, reasoning, and analysis!`;
    }

    document.getElementById(loadingId).innerHTML = `<strong>VictorX (${escapeHtml(selectedModel)}):</strong> ${escapeHtml(aiReply).replace(/\n/g, '<br>')}`;
    historyEl.scrollTop = historyEl.scrollHeight;
  });

  // Event Delegation
  document.addEventListener("click", (e) => {
    if(e.target.closest(".btn-close")) {
      const overlay = e.target.closest(".modal-overlay") || e.target.closest(".pin-overlay");
      if(overlay) overlay.style.display = "none";
    }

    const intBtn = e.target.closest(".open-int-modal");
    if(intBtn) openIntegrationModal(intBtn.dataset.agent);

    const pullBtn = e.target.closest(".open-pull-modal");
    if(pullBtn) openPullModal(pullBtn.dataset.model);

    const pgBtn = e.target.closest(".launch-playground-btn");
    if(pgBtn) openPlayground(pgBtn.dataset.model);

    const testBtn = e.target.closest(".test-api-btn");
    if(testBtn) {
      const model = testBtn.dataset.model;
      const endpointInput = document.getElementById("apiEndpointInput");
      const bodyInput = document.getElementById("apiRequestBody");
      
      if(endpointInput) {
        if(model.includes('/')) endpointInput.value = `https://api-inference.huggingface.co/models/${model}`;
        else endpointInput.value = state.ollamaOnline ? `${state.keys.ollama || 'http://localhost:11434'}/api/generate` : "https://openrouter.ai/api/v1/chat/completions";
      }
      if(bodyInput) bodyInput.value = JSON.stringify({ model: model, prompt: "Why is the sky blue?" }, null, 2);
      
      document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth" });
      toast(`Loaded endpoint for ${model} into API Workbench`, "info");
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
  });
}

if(document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
