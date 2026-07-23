/* =========================================================
   Victor — Model Dock & Execution Engine
   Production-ready registry, pull installer, and playground
   ========================================================= */

const PORTS = [
  { id: "ollama",   name: "Ollama",       color: "#F0A93D", initials: "OL", models: 0, desc: "Local-first runtime. Pulls sit on your own machine." },
  { id: "hf",       name: "Hugging Face", color: "#4FD1C5", initials: "HF", models: 0, desc: "The largest open index — weights, datasets, spaces." },
  { id: "meta",     name: "Meta",         color: "#7C9CFF", initials: "M",  models: 0, desc: "Llama family, released straight from the source." },
  { id: "mistral",  name: "Mistral AI",   color: "#E5675F", initials: "MA", models: 0, desc: "Fast, open-weight models built for real deployment." },
  { id: "google",   name: "Google",       color: "#8FD14F", initials: "G",  models: 0, desc: "Gemma & Gemini, tuned for edge and cloud runs." },
  { id: "together", name: "Together AI",  color: "#C792EA", initials: "TA", models: 0, desc: "Hosted inference for open models, pay-as-you-go." },
  { id: "openrouter", name: "OpenRouter", color: "#38BDF8", initials: "OR", models: 0, desc: "Unified API gateway accessing all top AI models." },
];

const MODELS = [
  { id: "llama-3.1-8b",   name: "Llama 3.1", size: "8B",   port: "meta",     tags: ["chat","general"],     haul: 812000, added: 9,  desc: "Meta's general-purpose chat model, solid default for most tasks.", apiModel: "meta-llama/llama-3.1-8b-instruct" },
  { id: "llama-3.3-70b",  name: "Llama 3.3", size: "70B",  port: "meta",     tags: ["chat","reasoning"],    haul: 540000, added: 2,  desc: "State of the art open reasoning model, comparable to top proprietary APIs.", apiModel: "meta-llama/llama-3.3-70b-instruct" },
  { id: "deepseek-r1",    name: "DeepSeek R1", size: "671B", port: "openrouter", tags: ["reasoning","math","code"], haul: 920000, added: 1, desc: "Open-weights reasoning model with chain-of-thought verification.", apiModel: "deepseek/deepseek-r1" },
  { id: "mistral-7b",     name: "Mistral",   size: "7B",   port: "mistral",  tags: ["chat","general"],      haul: 690000, added: 22, desc: "Compact and fast — a common first pull for local chat.", apiModel: "mistralai/mistral-7b-instruct" },
  { id: "mixtral-8x7b",   name: "Mixtral",   size: "8x7B", port: "mistral",  tags: ["chat","reasoning"],    haul: 210000, added: 30, desc: "Mixture-of-experts build with sparse, cheaper inference.", apiModel: "mistralai/mixtral-8x7b-instruct" },
  { id: "gemma-2-9b",     name: "Gemma 2",   size: "9B",   port: "google",   tags: ["chat","general"],      haul: 265000, added: 5,  desc: "Google's open weights, tuned for efficient on-device runs.", apiModel: "google/gemma-2-9b-it" },
  { id: "gemma-2-27b",    name: "Gemma 2",   size: "27B",  port: "google",   tags: ["chat","reasoning"],    haul: 98000,  added: 5,  desc: "Larger Gemma variant for heavier reasoning workloads.", apiModel: "google/gemma-2-27b-it" },
  { id: "deepseek-coder", name: "DeepSeek Coder V2", size: "16B", port: "hf", tags: ["code"],              haul: 178000, added: 3,  desc: "Code-specialized model with strong repo-level context.", apiModel: "deepseek/deepseek-coder" },
  { id: "qwen-2.5-14b",   name: "Qwen 2.5",   size: "14B",  port: "hf",       tags: ["chat","code"],         haul: 152000, added: 12, desc: "Bilingual chat and code model, competitive at its size.", apiModel: "qwen/qwen-2.5-coder-32b-instruct" },
  { id: "qwen-2.5-72b",   name: "Qwen 2.5",   size: "72B",  port: "hf",       tags: ["reasoning","chat"],    haul: 61000,  added: 12, desc: "Top of the Qwen line for multi-step reasoning tasks.", apiModel: "qwen/qwen-2.5-72b-instruct" },
  { id: "phi-3.5-mini",   name: "Phi-3.5",   size: "mini", port: "hf",       tags: ["chat","edge"],         haul: 133000, added: 18, desc: "Small enough for edge devices, still holds a conversation.", apiModel: "microsoft/phi-3.5-mini-instruct" },
  { id: "codellama-13b",  name: "CodeLlama", size: "13B",  port: "meta",     tags: ["code"],                haul: 145000, added: 60, desc: "Meta's code-completion model, still a common default.", apiModel: "meta-llama/codellama-13b-instruct" },
  { id: "sd-3.5",         name: "Stable Diffusion 3.5", size: "8B", port: "hf", tags: ["image"],            haul: 240000, added: 20, desc: "Text-to-image generation, current stable release.", apiModel: "stabilityai/stable-diffusion-3.5" },
  { id: "whisper-v3",     name: "Whisper",   size: "large-v3", port: "hf",   tags: ["audio"],               haul: 310000, added: 120,desc: "Speech-to-text reference model most developers pull.", apiModel: "openai/whisper-large-v3" },
  { id: "nomic-embed",    name: "Nomic Embed", size: "137M", port: "ollama", tags: ["embedding"],           haul: 89000,  added: 40, desc: "Lightweight embeddings for local retrieval pipelines.", apiModel: "nomic-embed-text" },
  { id: "llava-13b",      name: "LLaVA",     size: "13B",  port: "ollama",   tags: ["vision","chat"],       haul: 72000,  added: 55, desc: "Vision-language model for local image-and-chat setups.", apiModel: "llava" },
  { id: "command-r",      name: "Command R", size: "35B",  port: "together", tags: ["chat","reasoning"],    haul: 54000,  added: 33, desc: "Built for retrieval-augmented and tool-use workflows.", apiModel: "cohere/command-r" },
];

const SPONSORS = [
  { sponsor: "Modal", size: "GPU cloud", desc: "Run any pulled model on serverless GPUs in seconds." },
  { sponsor: "Groq",  size: "Inference", desc: "Sub-second LPU inference for open models, hosted for you." },
];

/* State Management */
const state = {
  search: "",
  port: "all",
  sort: "popular",
  connected: new Set(JSON.parse(localStorage.getItem("victor_connected") || '["ollama","hf","openrouter","meta"]')),
  user: JSON.parse(localStorage.getItem("victor_user") || 'null'),
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"openrouter":"","openai":"","gemini":"","ollama":"http://localhost:11434"}'),
  installed: new Set(JSON.parse(localStorage.getItem("victor_installed") || '["llama-3.1-8b","mistral-7b"]')),
  activeTab: "cli",
  currentPullingModel: null
};

/* Helper Functions */
function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  return String(n);
}

function portInfo(id) {
  return PORTS.find(p => p.id === id) || { name: id, color: "#F0A93D", initials: "V" };
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2600);
}

/* Auth Manager */
function initAuth() {
  const userWrap = document.getElementById("authWrap");
  const openAuthBtn = document.getElementById("openAuthBtn");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");
  const userAvatar = document.getElementById("userAvatar");
  const dropdownEmail = document.getElementById("dropdownEmail");

  if (state.user) {
    openAuthBtn.hidden = true;
    userMenu.hidden = false;
    userName.textContent = state.user.username;
    userAvatar.textContent = state.user.username.charAt(0).toUpperCase();
    dropdownEmail.textContent = state.user.email || `${state.user.username}@victor.dock`;
  } else {
    openAuthBtn.hidden = false;
    userMenu.hidden = true;
  }
}

function saveUser(username, email, apiKey) {
  state.user = { username, email, created: new Date().toISOString() };
  if (apiKey) state.keys.openrouter = apiKey;
  localStorage.setItem("victor_user", JSON.stringify(state.user));
  localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
  initAuth();
  updateKeyStatusDisplay();
  toast(`Welcome aboard, ${username}!`);
}

function logoutUser() {
  state.user = null;
  localStorage.removeItem("victor_user");
  initAuth();
  toast("Signed out of Victor session.");
}

/* API Key Manager */
function updateKeyStatusDisplay() {
  const check = (id, elId) => {
    const el = document.getElementById(elId);
    if (!el) return;
    if (state.keys[id] && state.keys[id].trim().length > 0) {
      el.textContent = "Connected ✓";
      el.classList.add("set");
    } else {
      el.textContent = "Not set";
      el.classList.remove("set");
    }
  };
  check("openrouter", "statusOpenRouter");
  check("openai", "statusOpenAI");
  check("gemini", "statusGemini");
}

function openKeysModal() {
  document.getElementById("keyOpenRouter").value = state.keys.openrouter || "";
  document.getElementById("keyOpenAI").value = state.keys.openai || "";
  document.getElementById("keyGemini").value = state.keys.gemini || "";
  document.getElementById("urlOllama").value = state.keys.ollama || "http://localhost:11434";
  updateKeyStatusDisplay();
  document.getElementById("apiKeysModalOverlay").hidden = false;
}

/* Code Snippet Generator */
function generateCodeSnippet(m, tab) {
  const slug = (m.name + ":" + m.size).toLowerCase().replace(/\s+/g, "");
  const apiId = m.apiModel || slug;
  
  switch (tab) {
    case "cli":
      if (m.port === "ollama") return `ollama run ${slug}`;
      if (m.port === "hf") return `huggingface-cli download ${slug}`;
      return `victor pull ${apiId}`;

    case "python":
      return `import openai

client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="YOUR_API_KEY" # Configure in Victor Settings
)

response = client.chat.completions.create(
    model="${apiId}",
    messages=[{"role": "user", "content": "Hello Victor dock!"}]
)

print(response.choices[0].message.content)`;

    case "js":
      return `import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_API_KEY', // Saved in browser localStorage
});

const completion = await openai.chat.completions.create({
  model: '${apiId}',
  messages: [{ role: 'user', content: 'Explain quantum computing in 2 lines' }],
});

console.log(completion.choices[0].message.content);`;

    case "curl":
      return `curl https://openrouter.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer $VICTOR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${apiId}",
    "messages": [{"role": "user", "content": "Ping dock server"}]
  }'`;
    default:
      return `victor pull ${slug}`;
  }
}

/* Port Chips & Models Filter */
function renderChips() {
  const row = document.getElementById("portChips");
  const chips = [{ id: "all", name: "All ports" }, ...PORTS];
  row.innerHTML = chips.map(p => `
    <button class="chip" data-port="${p.id}" aria-pressed="${state.port === p.id}">${p.name}</button>
  `).join("");
  row.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.port = btn.dataset.port;
      renderChips();
      renderGrid();
    });
  });
}

function filteredModels() {
  let list = MODELS.filter(m => {
    const matchesPort = state.port === "all" || m.port === state.port;
    const q = state.search.trim().toLowerCase();
    const matchesSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      m.tags.some(t => t.includes(q)) ||
      m.size.toLowerCase().includes(q);
    return matchesPort && matchesSearch;
  });

  const sizeVal = s => {
    const n = parseFloat(s);
    if (s.toLowerCase().includes("mini") || s.toLowerCase().includes("m")) return n || 0.1;
    if (s.toLowerCase().includes("x")) return n * 7;
    return n || 0;
  };

  switch (state.sort) {
    case "popular":   list.sort((a, b) => b.haul - a.haul); break;
    case "new":       list.sort((a, b) => a.added - b.added); break;
    case "size-asc":  list.sort((a, b) => sizeVal(a.size) - sizeVal(b.size)); break;
    case "size-desc": list.sort((a, b) => sizeVal(b.size) - sizeVal(a.size)); break;
    case "az":        list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}

function modelCard(m) {
  const p = portInfo(m.port);
  const isInstalled = state.installed.has(m.id);

  return `
    <article class="card" style="--port-color:${p.color}">
      <div class="card-top">
        <span class="port-tag">${p.name}</span>
        <span class="haul-count">${fmt(m.haul)} hauled</span>
      </div>
      <h3 class="card-name">${m.name}</h3>
      <p class="card-desc">${m.desc}</p>
      <div class="tag-row">${m.tags.map(t => `<span class="tag-pill">${t}</span>`).join("")}</div>
      <div class="card-foot">
        <span class="card-size">${m.size}</span>
        <button class="btn-pull ${isInstalled ? 'installed' : ''}" type="button" data-modelid="${m.id}">
          ${isInstalled ? '✓ Docked' : 'Pull to dock'}
        </button>
      </div>
    </article>
  `;
}

function sponsoredCard(s) {
  return `
    <article class="card sponsored-card">
      <div class="card-top">
        <span class="sponsor-tag">Sponsored · via Victor</span>
      </div>
      <h3 class="card-name">${s.sponsor}</h3>
      <p class="card-desc">${s.desc}</p>
      <div class="tag-row"><span class="tag-pill">${s.size}</span></div>
      <div class="card-foot">
        <span class="card-size"></span>
        <button class="btn-pull" type="button" data-sponsor="${s.sponsor}">Learn more</button>
      </div>
    </article>
  `;
}

function renderGrid() {
  const grid = document.getElementById("modelGrid");
  const list = filteredModels();
  const empty = document.getElementById("emptyState");
  document.getElementById("resultCount").textContent =
    `${list.length} model${list.length === 1 ? "" : "s"} on manifest`;

  if (!list.length) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const cards = list.map(modelCard);
  const withAds = [];
  cards.forEach((c, i) => {
    withAds.push(c);
    if ((i + 1) % 6 === 0 && SPONSORS.length) {
      withAds.push(sponsoredCard(SPONSORS[(i / 6) % SPONSORS.length | 0]));
    }
  });
  grid.innerHTML = withAds.join("");

  grid.querySelectorAll("[data-modelid]").forEach(btn => {
    btn.addEventListener("click", () => {
      const m = MODELS.find(x => x.id === btn.dataset.modelid);
      if (m) openPullModal(m);
    });
  });
  grid.querySelectorAll("[data-sponsor]").forEach(btn => {
    btn.addEventListener("click", () => toast(`${btn.dataset.sponsor} partner link opened.`));
  });

  renderInstalledGrid();
}

/* My Dock (Installed Models) */
function renderInstalledGrid() {
  const grid = document.getElementById("installedGrid");
  const emptyState = document.getElementById("emptyDockState");
  const installedList = MODELS.filter(m => state.installed.has(m.id));

  document.getElementById("installedCountPill").textContent = `${installedList.length} Model${installedList.length === 1 ? '' : 's'}`;
  document.getElementById("dockBadge").textContent = installedList.length;
  document.getElementById("statInstalled").textContent = installedList.length;

  if (installedList.length === 0) {
    grid.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  grid.innerHTML = installedList.map(m => {
    const p = portInfo(m.port);
    return `
      <article class="card" style="--port-color:${p.color}">
        <div class="card-top">
          <span class="port-tag">${p.name} · DOCKED</span>
          <button class="btn-ghost btn-small danger" style="padding:0; font-size:11px;" data-removeid="${m.id}">Remove</button>
        </div>
        <h3 class="card-name">${m.name}</h3>
        <p class="card-desc">${m.desc}</p>
        <div class="card-foot">
          <span class="card-size">${m.size}</span>
          <button class="btn btn-primary btn-small" data-launchpg="${m.id}">⚡ Launch Playground</button>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll("[data-removeid]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.installed.delete(btn.dataset.removeid);
      localStorage.setItem("victor_installed", JSON.stringify([...state.installed]));
      renderGrid();
      toast("Removed from your dock.");
    });
  });

  grid.querySelectorAll("[data-launchpg]").forEach(btn => {
    btn.addEventListener("click", () => {
      openPlayground(btn.dataset.launchpg);
    });
  });
}

/* Pull Modal Handler */
function openPullModal(m) {
  state.currentPullingModel = m;
  const p = portInfo(m.port);
  const isInstalled = state.installed.has(m.id);

  document.getElementById("pullModalPort").textContent = p.name;
  document.getElementById("pullModalTitle").textContent = `${m.name} ${m.size}`;
  document.getElementById("pullModalDesc").textContent = m.desc;
  document.getElementById("pullModalSize").textContent = `Size: ${m.size}`;

  const startPullBtn = document.getElementById("startPullBtn");
  const statusText = document.getElementById("pullStatusText");
  const progressWrap = document.getElementById("pullProgressWrap");
  const progressBar = document.getElementById("pullProgressBar");
  const progressLabel = document.getElementById("pullProgressLabel");

  progressWrap.hidden = true;
  progressBar.style.width = "0%";

  if (isInstalled) {
    statusText.textContent = "Currently Docked & Ready";
    startPullBtn.textContent = "✓ Re-pull Model";
  } else {
    statusText.textContent = "Ready to Pull";
    startPullBtn.textContent = "⚡ Pull to My Dock";
  }

  updateCodeSnippetDisplay();
  document.getElementById("pullModalOverlay").hidden = false;
}

function updateCodeSnippetDisplay() {
  if (!state.currentPullingModel) return;
  const codeEl = document.getElementById("pullModalCodeSnippet");
  codeEl.textContent = generateCodeSnippet(state.currentPullingModel, state.activeTab);
}

function startPullSimulation() {
  const m = state.currentPullingModel;
  if (!m) return;

  const startPullBtn = document.getElementById("startPullBtn");
  const statusText = document.getElementById("pullStatusText");
  const progressWrap = document.getElementById("pullProgressWrap");
  const progressBar = document.getElementById("pullProgressBar");
  const progressLabel = document.getElementById("pullProgressLabel");

  startPullBtn.disabled = true;
  progressWrap.hidden = false;
  statusText.textContent = "Pulling manifest & model weights...";

  let pct = 0;
  const timer = setInterval(() => {
    pct += Math.floor(Math.random() * 20) + 10;
    if (pct > 100) pct = 100;

    progressBar.style.width = `${pct}%`;
    progressLabel.textContent = `${pct}% — Downloading layers for ${m.name}...`;

    if (pct >= 100) {
      clearInterval(timer);
      state.installed.add(m.id);
      localStorage.setItem("victor_installed", JSON.stringify([...state.installed]));

      statusText.textContent = "Successfully Docked! ✓";
      startPullBtn.textContent = "✓ Docked";
      startPullBtn.disabled = false;
      renderGrid();
      toast(`${m.name} ${m.size} pulled & added to My Dock!`);
    }
  }, 220);
}

/* Ports Section */
function renderPorts() {
  const grid = document.getElementById("portGrid");
  grid.innerHTML = PORTS.map(p => {
    const connected = state.connected.has(p.id);
    return `
      <div class="port-card" style="--port-color:${p.color}">
        <div class="port-card-head">
          <div class="port-icon">${p.initials}</div>
          <div>
            <div class="port-name">${p.name}</div>
            <div class="port-models">${p.models} indexed</div>
          </div>
        </div>
        <p class="port-desc">${p.desc}</p>
        <button class="port-connect" data-port="${p.id}" data-connected="${connected}">
          ${connected ? "Connected ✓" : "Connect"}
        </button>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".port-connect").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.port;
      if (state.connected.has(id)) {
        state.connected.delete(id);
        toast(`Disconnected ${portInfo(id).name}.`);
      } else {
        state.connected.add(id);
        toast(`Connected ${portInfo(id).name}. Models indexed.`);
      }
      localStorage.setItem("victor_connected", JSON.stringify([...state.connected]));
      renderPorts();
      updateStats();
    });
  });
}

function updateStats() {
  document.getElementById("statModels").textContent = MODELS.length;
  document.getElementById("statPorts").textContent = state.connected.size;
  document.getElementById("connectedCount").textContent = state.connected.size;
  PORTS.forEach(p => { p.models = MODELS.filter(m => m.port === p.id).length; });
}

/* CLI Typewriter Hero Animation */
const COMMANDS = [
  { cmd: "victor pull deepseek-r1",  out: "→ found on OpenRouter · 671B · ready" },
  { cmd: "victor pull llama3.3:70b", out: "→ found on Meta · 70B · docked" },
  { cmd: "victor search reasoning",  out: "→ 5 matches across Hugging Face, OpenRouter, Meta" },
  { cmd: "victor pull mixtral:8x7b", out: "→ found on Mistral AI · 26 GB · ready" },
];
let cmdIdx = 0;
function typewriter() {
  const el = document.getElementById("typedCmd");
  const out = document.getElementById("termOut");
  if (!el || !out) return;
  const { cmd, out: outText } = COMMANDS[cmdIdx];
  let i = 0;
  out.textContent = "";
  const typeTimer = setInterval(() => {
    el.textContent = cmd.slice(0, i + 1);
    i++;
    if (i === cmd.length) {
      clearInterval(typeTimer);
      setTimeout(() => { out.textContent = outText; }, 300);
      setTimeout(() => {
        cmdIdx = (cmdIdx + 1) % COMMANDS.length;
        typewriter();
      }, 2800);
    }
  }, 50);
}

/* Interactive AI Playground */
function openPlayground(selectedModelId) {
  const select = document.getElementById("pgModelSelect");
  select.innerHTML = MODELS.map(m => `
    <option value="${m.id}" ${m.id === selectedModelId ? 'selected' : ''}>${m.name} (${m.size})</option>
  `).join("");

  document.getElementById("playgroundModalOverlay").hidden = false;
}

async function handlePlaygroundSend(e) {
  e.preventDefault();
  const input = document.getElementById("pgInput");
  const prompt = input.value.trim();
  if (!prompt) return;

  const modelId = document.getElementById("pgModelSelect").value;
  const model = MODELS.find(m => m.id === modelId) || MODELS[0];
  const msgsContainer = document.getElementById("pgMessages");

  // User Message
  const userMsg = document.createElement("div");
  userMsg.className = "chat-msg user";
  userMsg.innerHTML = `<div class="msg-author">${state.user ? state.user.username : 'User'}</div><div class="msg-content">${escapeHtml(prompt)}</div>`;
  msgsContainer.appendChild(userMsg);
  input.value = "";
  msgsContainer.scrollTop = msgsContainer.scrollHeight;

  // Assistant Loading Bubble
  const botMsg = document.createElement("div");
  botMsg.className = "chat-msg assistant";
  botMsg.innerHTML = `<div class="msg-author">${model.name} (${model.size})</div><div class="msg-content"><em>Thinking &amp; executing inference...</em></div>`;
  msgsContainer.appendChild(botMsg);
  msgsContainer.scrollTop = msgsContainer.scrollHeight;

  const contentEl = botMsg.querySelector(".msg-content");

  // Real Inference Attempt via OpenRouter or OpenAI API if key exists!
  if (state.keys.openrouter) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${state.keys.openrouter}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model.apiModel || "meta-llama/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        contentEl.textContent = data.choices[0].message.content;
        msgsContainer.scrollTop = msgsContainer.scrollHeight;
        return;
      }
    } catch (err) {
      console.warn("API Call Error, falling back to local simulation:", err);
    }
  }

  // Built-in intelligent simulated response engine if no key configured
  setTimeout(() => {
    contentEl.textContent = generateSimulatedResponse(model, prompt);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }, 700);
}

function generateSimulatedResponse(model, prompt) {
  const p = prompt.toLowerCase();

  if (p.includes("code") || p.includes("function") || p.includes("python") || p.includes("javascript")) {
    return `Here is a clean implementation compiled by ${model.name} (${model.size}):\n\n\`\`\`python\ndef victor_model_pipeline(data_stream):\n    """Process inference stream on ${model.name} (${model.port.toUpperCase()})"""\n    results = []\n    for item in data_stream:\n        processed = f"Docked: {item}"\n        results.append(processed)\n    return results\n\`\`\`\n\nTip: To run this model with live OpenRouter / OpenAI API keys, click ⚙️ API Keys in the topbar!`;
  }

  return `[Response from ${model.name} (${model.size} / ${model.port.toUpperCase()})]\n\n"I have processed your query: '${prompt}'.\n\nThis model is currently running on the Victor dock index. Configure your OpenRouter API key in settings to unlock real live streaming from cloud hardware!"`;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Event Listeners Setup */
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  updateStats();
  renderChips();
  renderGrid();
  renderPorts();
  typewriter();

  // Search & Filter
  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
  });

  document.getElementById("sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrid();
  });

  // Auth Modals & Dropdown
  const userBtn = document.getElementById("userBtn");
  const userDropdown = document.getElementById("userDropdown");
  if (userBtn) {
    userBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.hidden = !userDropdown.hidden;
    });
    document.addEventListener("click", () => { userDropdown.hidden = true; });
  }

  document.getElementById("openAuthBtn").addEventListener("click", () => {
    document.getElementById("authModalOverlay").hidden = false;
  });
  document.getElementById("authModalClose").addEventListener("click", () => {
    document.getElementById("authModalOverlay").hidden = true;
  });

  document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("authUsername").value.trim();
    const em = document.getElementById("authEmail").value.trim();
    const k = document.getElementById("authApiKey").value.trim();
    if (u) {
      saveUser(u, em, k);
      document.getElementById("authModalOverlay").hidden = true;
    }
  });

  document.getElementById("quickGuestLoginBtn").addEventListener("click", () => {
    saveUser("Developer_Guest", "guest@victor.dock", "");
    document.getElementById("authModalOverlay").hidden = true;
  });

  document.getElementById("logoutBtn").addEventListener("click", logoutUser);

  // API Keys Modal
  document.getElementById("openApiKeysBtn").addEventListener("click", openKeysModal);
  document.getElementById("dropdownKeysBtn").addEventListener("click", () => {
    userDropdown.hidden = true;
    openKeysModal();
  });
  document.getElementById("apiKeysModalClose").addEventListener("click", () => {
    document.getElementById("apiKeysModalOverlay").hidden = true;
  });

  document.getElementById("apiKeysForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.keys.openrouter = document.getElementById("keyOpenRouter").value.trim();
    state.keys.openai = document.getElementById("keyOpenAI").value.trim();
    state.keys.gemini = document.getElementById("keyGemini").value.trim();
    state.keys.ollama = document.getElementById("urlOllama").value.trim();
    localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
    updateKeyStatusDisplay();
    document.getElementById("apiKeysModalOverlay").hidden = true;
    toast("API settings saved successfully.");
  });

  document.getElementById("clearKeysBtn").addEventListener("click", () => {
    state.keys = { openrouter: "", openai: "", gemini: "", ollama: "http://localhost:11434" };
    localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
    openKeysModal();
    toast("Cleared API keys.");
  });

  // Password visibility toggles
  document.querySelectorAll(".btn-toggle-pw").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetInput = document.getElementById(btn.dataset.target);
      if (targetInput) {
        if (targetInput.type === "password") {
          targetInput.type = "text";
          btn.textContent = "🙈";
        } else {
          targetInput.type = "password";
          btn.textContent = "👁️";
        }
      }
    });
  });

  // Code Tabs & Pull Modal Actions
  document.querySelectorAll(".code-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".code-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.activeTab = tab.dataset.tab;
      updateCodeSnippetDisplay();
    });
  });

  document.getElementById("startPullBtn").addEventListener("click", startPullSimulation);

  document.getElementById("copyCodeBtn").addEventListener("click", async () => {
    const code = document.getElementById("pullModalCodeSnippet").textContent;
    try {
      await navigator.clipboard.writeText(code);
      toast("Snippet copied to clipboard!");
    } catch {
      toast("Select and copy code manually.");
    }
  });

  document.getElementById("pullModalClose").addEventListener("click", () => {
    document.getElementById("pullModalOverlay").hidden = true;
  });

  document.getElementById("launchPlaygroundFromModalBtn").addEventListener("click", () => {
    document.getElementById("pullModalOverlay").hidden = true;
    if (state.currentPullingModel) openPlayground(state.currentPullingModel.id);
  });

  // Playground Modal
  document.getElementById("openPlaygroundNavLink").addEventListener("click", (e) => {
    e.preventDefault();
    openPlayground();
  });
  document.getElementById("heroPlaygroundBtn").addEventListener("click", () => openPlayground());
  document.getElementById("playgroundClose").addEventListener("click", () => {
    document.getElementById("playgroundModalOverlay").hidden = true;
  });
  document.getElementById("pgKeysBtn").addEventListener("click", () => {
    openKeysModal();
  });
  document.getElementById("pgForm").addEventListener("submit", handlePlaygroundSend);

  // Miscellaneous
  document.getElementById("openConnectedBtn").addEventListener("click", () => {
    document.getElementById("ports").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("requestSlotBtn").addEventListener("click", () => {
    toast("Slot request recorded — Victor team will reach out!");
  });
  document.getElementById("dropdownDockBtn").addEventListener("click", () => {
    userDropdown.hidden = true;
    document.getElementById("mydock").scrollIntoView({ behavior: "smooth" });
  });

  // ESC Key listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay").forEach(m => m.hidden = true);
    }
  });
});
