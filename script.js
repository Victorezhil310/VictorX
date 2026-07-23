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

const ADMIN_VERIFICATION = '20032004';

const state = {
  search: "",
  port: "all",
  sort: "popular",
  connected: new Set(JSON.parse(localStorage.getItem("victor_connected") || '["ollama","hf","openrouter","meta"]')),
  user: JSON.parse(localStorage.getItem("victor_user") || 'null'),
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"openrouter":"","openai":"","gemini":"","ollama":"http://localhost:11434"}'),
  installed: new Set(JSON.parse(localStorage.getItem("victor_installed") || '["llama-3.1-8b","mistral-7b"]')),
  activeTab: "cli",
  currentPullingModel: null,
  isAdmin: false,
  adminAuthenticated: false
};

// Database Initialization (IndexedDB)
const DB_NAME = "VictorDockDB";
const DB_VERSION = 1;
let db;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => reject("IndexedDB error: " + event.target.errorCode);
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("models")) db.createObjectStore("models", { keyPath: "id" });
      if (!db.objectStoreNames.contains("chats")) db.createObjectStore("chats", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("vault")) db.createObjectStore("vault", { keyPath: "key" });
      if (!db.objectStoreNames.contains("users")) db.createObjectStore("users", { keyPath: "username" });
    };
  });
}

function saveToDB(storeName, obj) {
  if (!db) return Promise.reject("DB not initialized");
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(obj);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

// Helpers
const fmt = n => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'k' : n;
const portInfo = id => PORTS.find(p => p.id === id) || { name: "Unknown", color: "#aaa" };
const escapeHtml = str => String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[tag]));

function toast(msg, type = "info") {
  const t = document.createElement("div");
  t.className = `fixed bottom-4 right-4 p-4 rounded-xl shadow-lg border border-white/10 z-50 transform transition-all duration-300 translate-y-10 opacity-0 flex items-center gap-3`;
  if(type === "error") t.classList.add("bg-red-900/90", "text-red-100");
  else if(type === "success") t.classList.add("bg-green-900/90", "text-green-100");
  else t.classList.add("bg-slate-800/90", "text-slate-200", "backdrop-blur-md");
  
  t.innerHTML = `<div>${escapeHtml(msg)}</div>`;
  document.body.appendChild(t);
  
  requestAnimationFrame(() => {
    t.classList.remove("translate-y-10", "opacity-0");
  });
  
  setTimeout(() => {
    t.classList.add("translate-y-10", "opacity-0");
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// UI Rendering
function updateStats() {
  const modelsCount = document.getElementById("heroModelsCount");
  const pullsCount = document.getElementById("heroPullsCount");
  if(modelsCount) modelsCount.innerText = MODELS.length;
  if(pullsCount) pullsCount.innerText = fmt(MODELS.reduce((acc, m) => acc + m.haul, 0));
  
  const dockBadge = document.getElementById("dockCountBadge");
  if(dockBadge) {
    dockBadge.innerText = state.installed.size;
    dockBadge.style.display = state.installed.size > 0 ? "inline-flex" : "none";
  }
}

function renderChips() {
  const c = document.getElementById("portChips");
  if(!c) return;
  c.innerHTML = `<button class="px-4 py-2 rounded-full text-sm font-medium transition-colors ${state.port === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'}" data-port="all">All Ports</button>`;
  
  PORTS.forEach(p => {
    const isSelected = state.port === p.id;
    const isConnected = state.connected.has(p.id);
    if(isConnected) {
        c.innerHTML += `<button class="px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'}" data-port="${p.id}">
          <span class="w-2 h-2 rounded-full" style="background:${p.color}"></span> ${escapeHtml(p.name)}
        </button>`;
    }
  });

  c.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => {
      state.port = b.dataset.port;
      renderChips();
      renderGrid();
    });
  });
}

function renderGrid() {
  const g = document.getElementById("modelGrid");
  if(!g) return;
  
  const filtered = MODELS.filter(m => {
    if (state.port !== "all" && m.port !== state.port) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.id.toLowerCase().includes(q) && !m.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  filtered.sort((a,b) => {
    if(state.sort === "popular") return b.haul - a.haul;
    if(state.sort === "new") return a.added - b.added;
    if(state.sort === "size") return parseFloat(a.size) - parseFloat(b.size); // Naive sort
    return a.name.localeCompare(b.name);
  });

  g.innerHTML = "";
  if(filtered.length === 0) {
    g.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500">No models found matching your criteria.</div>`;
    return;
  }

  let sIdx = 0;
  filtered.forEach((m, i) => {
    if(i > 0 && i % 6 === 0 && sIdx < SPONSORS.length) {
      const s = SPONSORS[sIdx++];
      g.innerHTML += `
        <div class="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
          <div>
            <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Sponsored</div>
            <h3 class="text-xl font-semibold text-white mb-2">${escapeHtml(s.sponsor)}</h3>
            <span class="inline-block px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 mb-3">${escapeHtml(s.size)}</span>
            <p class="text-sm text-slate-400 line-clamp-3">${escapeHtml(s.desc)}</p>
          </div>
          <button class="mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-colors font-medium text-sm">
            Try ${escapeHtml(s.sponsor)}
          </button>
        </div>`;
    }

    const p = portInfo(m.port);
    const isInstalled = state.installed.has(m.id);
    
    g.innerHTML += `
      <div class="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all flex flex-col justify-between group opacity-0 animate-fade-in" style="animation-delay: ${i*50}ms">
        <div>
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" style="background:${p.color}"></span>
              <span class="text-xs font-medium text-slate-400">${escapeHtml(p.name)}</span>
            </div>
            <div class="text-xs text-slate-500 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              ${fmt(m.haul)}
            </div>
          </div>
          <h3 class="text-lg font-bold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors">${escapeHtml(m.name)}</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300 font-mono">${escapeHtml(m.size)}</span>
            ${m.tags.map(t => `<span class="px-2 py-0.5 bg-slate-800/50 rounded text-xs text-slate-400 border border-slate-700/50">${escapeHtml(t)}</span>`).join('')}
          </div>
          <p class="text-sm text-slate-400 line-clamp-2 mb-4">${escapeHtml(m.desc)}</p>
        </div>
        <div class="flex gap-2">
          ${isInstalled 
            ? `<button onclick="openPlayground('${m.id}')" class="flex-1 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors font-medium text-sm flex justify-center items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Run
               </button>`
            : `<button onclick="openPullModal('${m.id}')" class="flex-1 py-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors font-medium text-sm flex justify-center items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Pull
               </button>`
          }
        </div>
      </div>`;
  });
}

function renderInstalledGrid() {
    const g = document.getElementById("installedGrid");
    if(!g) return;
    
    if(state.installed.size === 0) {
        g.innerHTML = `
            <div class="col-span-full py-16 text-center">
                <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-300 mb-2">No models installed</h3>
                <p class="text-slate-500 mb-6">Explore the registry to pull your first model.</p>
                <button onclick="document.getElementById('navRegistry').click()" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">Browse Registry</button>
            </div>
        `;
        return;
    }

    g.innerHTML = "";
    Array.from(state.installed).forEach(id => {
        const m = MODELS.find(x => x.id === id);
        if(!m) return;
        const p = portInfo(m.port);
        g.innerHTML += `
            <div class="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between group">
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full" style="background:${p.color}"></span>
                        <span class="text-xs font-medium text-slate-400">${escapeHtml(p.name)}</span>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors">${escapeHtml(m.name)}</h3>
                    <div class="flex gap-2 mb-4">
                        <span class="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300 font-mono">${escapeHtml(m.size)}</span>
                        <span class="px-2 py-0.5 bg-green-900/30 text-green-400 border border-green-500/20 rounded text-xs">Ready</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="openPlayground('${m.id}')" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium">Launch</button>
                    <button onclick="removeModel('${m.id}')" class="p-2 bg-slate-800 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors" title="Remove model">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        `;
    });
}

function removeModel(id) {
    if(!confirm(`Are you sure you want to remove ${id}?`)) return;
    state.installed.delete(id);
    localStorage.setItem("victor_installed", JSON.stringify(Array.from(state.installed)));
    toast(`Removed ${id}`);
    updateStats();
    renderInstalledGrid();
    renderGrid(); // update pull/run buttons
}

// Authentication System
function getUsersDB() {
    return JSON.parse(localStorage.getItem("victor_users_db") || '[]');
}

function saveUsersDB(users) {
    localStorage.setItem("victor_users_db", JSON.stringify(users));
}

function initAuth() {
    const authBtn = document.getElementById("authBtn");
    const userMenu = document.getElementById("userMenu");
    const userAvatar = document.getElementById("userAvatar");
    
    if(state.user) {
        if(authBtn) authBtn.style.display = "none";
        if(userMenu) userMenu.style.display = "flex";
        if(userAvatar) userAvatar.innerText = state.user.username ? state.user.username.charAt(0).toUpperCase() : "?";
    } else {
        if(authBtn) authBtn.style.display = "flex";
        if(userMenu) userMenu.style.display = "none";
    }
}

function handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;
    
    const users = getUsersDB();
    const user = users.find(u => (u.email === identifier || u.username === identifier) && u.password === btoa(pass));
    
    if(user) {
        state.user = user;
        localStorage.setItem("victor_user", JSON.stringify(user));
        document.getElementById("authModal").style.display = "none";
        initAuth();
        toast("Welcome back, " + user.username, "success");
    } else {
        toast("Invalid credentials", "error");
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPassword").value;
    
    const users = getUsersDB();
    if(users.find(u => u.username === username)) {
        toast("Username already taken", "error");
        return;
    }
    if(users.find(u => u.email === email)) {
        toast("Email already registered", "error");
        return;
    }
    
    const newUser = {
        username,
        email,
        password: btoa(pass),
        role: "user",
        created: new Date().toISOString(),
        modelsPulled: 0
    };
    
    users.push(newUser);
    saveUsersDB(users);
    
    // Auto login
    state.user = newUser;
    localStorage.setItem("victor_user", JSON.stringify(newUser));
    document.getElementById("authModal").style.display = "none";
    initAuth();
    toast("Registration successful!", "success");
}

function handleGuestLogin() {
    const guestUser = {
        username: "Guest_" + Math.floor(Math.random() * 10000),
        email: "guest@victor.dock",
        role: "guest"
    };
    state.user = guestUser;
    localStorage.setItem("victor_user", JSON.stringify(guestUser));
    document.getElementById("authModal").style.display = "none";
    initAuth();
    toast("Logged in as Guest");
}

function handleLogout() {
    state.user = null;
    localStorage.removeItem("victor_user");
    state.adminAuthenticated = false;
    document.getElementById("userDropdown").classList.add("hidden");
    initAuth();
    toast("Logged out");
}

// Admin System
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
        if(pin === ADMIN_VERIFICATION) {
            state.adminAuthenticated = true;
            document.getElementById("adminPinOverlay").style.display = "none";
            inputs.forEach(i => i.value = "");
            openAdminDashboard();
            toast("Admin access granted", "success");
        } else {
            const container = document.querySelector("#adminPinOverlay .bg-slate-900");
            container.classList.add("animate-shake");
            setTimeout(() => container.classList.remove("animate-shake"), 500);
            inputs.forEach(i => i.value = "");
            inputs[0].focus();
            toast("Access denied. Wrong PIN.", "error");
        }
    }
}

function openAdminDashboard() {
    if(!state.adminAuthenticated) {
        document.getElementById("adminPinOverlay").style.display = "flex";
        setTimeout(() => document.querySelector(".pin-digit").focus(), 100);
        return;
    }
    document.getElementById("adminDashboardOverlay").style.display = "flex";
    renderAdminUsers();
}

function renderAdminUsers() {
    const tbody = document.getElementById("adminUsersTableBody");
    if(!tbody) return;
    const users = getUsersDB();
    
    document.getElementById("adminTotalUsers").innerText = users.length;
    document.getElementById("adminActiveSessions").innerText = state.user ? "1" : "0";
    
    tbody.innerHTML = "";
    users.forEach((u, i) => {
        tbody.innerHTML += `
            <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="p-3 text-sm text-slate-400">${i+1}</td>
                <td class="p-3 text-sm font-medium text-slate-200">${escapeHtml(u.username)}</td>
                <td class="p-3 text-sm text-slate-400">${escapeHtml(u.email)}</td>
                <td class="p-3 text-sm text-slate-400">${escapeHtml(u.role)}</td>
                <td class="p-3 text-sm text-slate-400">${u.modelsPulled || 0}</td>
                <td class="p-3 text-sm">
                    <button class="text-red-400 hover:text-red-300">Delete</button>
                </td>
            </tr>
        `;
    });
}

function switchAdminTab(tabId) {
    document.querySelectorAll(".admin-panel").forEach(p => p.classList.add("hidden"));
    document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("bg-slate-800", "text-white"));
    
    document.getElementById(tabId).classList.remove("hidden");
    document.querySelector(`[data-target="${tabId}"]`).classList.add("bg-slate-800", "text-white");
    
    if(tabId === 'adminUsersPanel') renderAdminUsers();
    // Add logic for other admin tabs as needed
}

// Pull Simulation
function openPullModal(modelId) {
    state.currentPullingModel = MODELS.find(m => m.id === modelId);
    if(!state.currentPullingModel) return;
    
    const m = state.currentPullingModel;
    document.getElementById("pullModalTitle").innerText = `Pulling ${m.name} (${m.size})`;
    document.getElementById("pullModal").style.display = "flex";
    
    // Generate snippets
    document.getElementById("snippetCli").innerText = `victor pull ${m.id}`;
    document.getElementById("snippetPython").innerText = `import victor\n\nmodel = victor.pull("${m.id}")\nprint(f"Loaded {model.name}")`;
    document.getElementById("snippetJs").innerText = `import { pull } from 'victorx';\n\nconst model = await pull('${m.id}');`;
    
    startPullSimulation();
}

function startPullSimulation() {
    const layers = [
        { name: "config.json", size: 1024, el: document.getElementById("layer1Progress") },
        { name: "safetensors.index.json", size: 24000, el: document.getElementById("layer2Progress") },
        { name: "weight_shards.bin", size: 1024 * 1024 * 100, el: document.getElementById("layer3Progress") }, // pseudo size
        { name: "tokenizer.model", size: 1024 * 500, el: document.getElementById("layer4Progress") }
    ];
    
    const btn = document.getElementById("pullConfirmBtn");
    btn.disabled = true;
    btn.innerText = "Pulling...";
    
    let layerIdx = 0;
    
    function animateLayer(layer, cb) {
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 15;
            if(p >= 100) {
                p = 100;
                clearInterval(interval);
                layer.el.style.width = "100%";
                layer.el.classList.add("bg-green-500");
                layer.el.classList.remove("bg-indigo-500");
                setTimeout(cb, 200);
            } else {
                layer.el.style.width = `${p}%`;
            }
        }, 100);
    }
    
    function nextLayer() {
        if(layerIdx < layers.length) {
            animateLayer(layers[layerIdx], () => {
                layerIdx++;
                nextLayer();
            });
        } else {
            // Complete
            btn.innerText = "Complete";
            btn.classList.add("bg-green-600");
            btn.classList.remove("bg-indigo-600");
            
            setTimeout(() => {
                state.installed.add(state.currentPullingModel.id);
                localStorage.setItem("victor_installed", JSON.stringify(Array.from(state.installed)));
                
                // Update user stats
                if(state.user) {
                    const users = getUsersDB();
                    const uIdx = users.findIndex(u => u.username === state.user.username);
                    if(uIdx > -1) {
                        users[uIdx].modelsPulled = (users[uIdx].modelsPulled || 0) + 1;
                        saveUsersDB(users);
                    }
                }
                
                toast(`Successfully pulled ${state.currentPullingModel.id}`, "success");
                document.getElementById("pullModal").style.display = "none";
                updateStats();
                renderInstalledGrid();
                renderGrid();
                
                // reset modal state
                layers.forEach(l => {
                    l.el.style.width = "0%";
                    l.el.classList.add("bg-indigo-500");
                    l.el.classList.remove("bg-green-500");
                });
                btn.disabled = false;
                btn.innerText = "Pulling...";
                btn.classList.add("bg-indigo-600");
                btn.classList.remove("bg-green-600");
            }, 1000);
        }
    }
    
    nextLayer();
}

// Web CLI
function processCliCommand(input) {
    const cmd = input.trim().toLowerCase();
    const parts = cmd.split(" ");
    
    appendTermLine(`> ${escapeHtml(input)}`, 'text-slate-300');
    
    if(!cmd) return;
    
    if(cmd === "clear") {
        document.getElementById("cliOutput").innerHTML = "";
        return;
    }
    
    if(parts[0] === "victor") {
        switch(parts[1]) {
            case "pull":
                if(!parts[2]) appendTermLine("Usage: victor pull <model_id>", "text-red-400");
                else {
                    const m = MODELS.find(x => x.id === parts[2]);
                    if(m) {
                        appendTermLine(`Initializing pull for ${m.id}...`, "text-indigo-400");
                        openPullModal(m.id);
                    } else {
                        appendTermLine(`Error: Model '${parts[2]}' not found in registry.`, "text-red-400");
                    }
                }
                break;
            case "ls":
            case "list":
                if(state.installed.size === 0) {
                    appendTermLine("No models currently installed.", "text-slate-400");
                } else {
                    appendTermLine("INSTALLED MODELS:", "text-indigo-400 font-bold");
                    Array.from(state.installed).forEach(id => {
                        const m = MODELS.find(x => x.id === id);
                        appendTermLine(`${m.id.padEnd(20)} ${m.size.padEnd(8)} ${m.port}`, "text-slate-300 font-mono");
                    });
                }
                break;
            case "search":
                if(!parts[2]) appendTermLine("Usage: victor search <query>", "text-red-400");
                else {
                    const q = parts[2];
                    const res = MODELS.filter(m => m.id.includes(q) || m.name.toLowerCase().includes(q));
                    appendTermLine(`Found ${res.length} models matching '${q}':`, "text-indigo-400");
                    res.forEach(m => appendTermLine(`- ${m.id}`, "text-slate-300"));
                }
                break;
            case "run":
                if(!parts[2]) appendTermLine("Usage: victor run <model_id>", "text-red-400");
                else if(state.installed.has(parts[2])) openPlayground(parts[2]);
                else appendTermLine(`Error: Model '${parts[2]}' not installed. Try 'victor pull ${parts[2]}' first.`, "text-red-400");
                break;
            case "keys":
                appendTermLine("API KEY STATUS:", "text-indigo-400 font-bold");
                Object.entries(state.keys).forEach(([provider, key]) => {
                    appendTermLine(`${provider.padEnd(12)}: ${key ? '[SET]' : '[NOT SET]'}`, key ? "text-green-400" : "text-slate-500");
                });
                break;
            case "help":
            default:
                appendTermLine("VictorX CLI Commands:", "text-indigo-400 font-bold");
                appendTermLine("victor pull <model>   - Download a model");
                appendTermLine("victor ls             - List installed models");
                appendTermLine("victor search <query> - Search the registry");
                appendTermLine("victor run <model>    - Launch playground");
                appendTermLine("victor keys           - Check API key status");
                appendTermLine("clear                 - Clear terminal");
                break;
        }
    } else {
        appendTermLine(`command not found: ${parts[0]}`, "text-red-400");
    }
}

function appendTermLine(text, className = "text-slate-300") {
    const out = document.getElementById("cliOutput");
    const line = document.createElement("div");
    line.className = className;
    line.innerHTML = text; // Allow pre-formatted html
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

// AI Playground
let playgroundChatHistory = [];

function openPlayground(modelId) {
    if(!state.installed.has(modelId)) {
        toast(`Please pull ${modelId} first`, "error");
        return;
    }
    
    document.getElementById("playgroundModal").style.display = "flex";
    
    const select = document.getElementById("pgModelSelect");
    select.innerHTML = "";
    Array.from(state.installed).forEach(id => {
        const m = MODELS.find(x => x.id === id);
        if(m) {
            select.innerHTML += `<option value="${m.id}" ${m.id === modelId ? 'selected' : ''}>${m.name} (${m.size})</option>`;
        }
    });
    
    document.getElementById("pgChatArea").innerHTML = `
        <div class="text-center text-slate-500 my-8">
            System: Connected to ${modelId}. Type a message to begin.
        </div>
    `;
    playgroundChatHistory = [];
}

async function handlePlaygroundSend() {
    const input = document.getElementById("pgInput");
    const msg = input.value.trim();
    if(!msg) return;
    
    const modelId = document.getElementById("pgModelSelect").value;
    const model = MODELS.find(m => m.id === modelId);
    
    input.value = "";
    appendChatMessage("user", msg);
    playgroundChatHistory.push({ role: "user", content: msg });
    
    const btn = document.getElementById("pgSendBtn");
    btn.disabled = true;
    
    // Simulated loading
    const loadingId = "msg-" + Date.now();
    const chatArea = document.getElementById("pgChatArea");
    chatArea.innerHTML += `<div id="${loadingId}" class="flex gap-4 mb-6"><div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">AI</div><div class="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-slate-300 animate-pulse">Thinking...</div></div>`;
    chatArea.scrollTop = chatArea.scrollHeight;
    
    try {
        let responseText = "";
        
        // Try real APIs if configured
        if(state.keys.openrouter && model.port === 'openrouter') {
             // Real OpenRouter call
             const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                 method: "POST",
                 headers: {
                     "Authorization": `Bearer ${state.keys.openrouter}`,
                     "Content-Type": "application/json"
                 },
                 body: JSON.stringify({
                     model: model.apiModel,
                     messages: playgroundChatHistory
                 })
             });
             const data = await res.json();
             if(data.choices && data.choices.length > 0) {
                 responseText = data.choices[0].message.content;
             } else {
                 throw new Error("Invalid API response");
             }
        } else {
            // Offline Simulation
            await new Promise(r => setTimeout(r, 1500));
            responseText = generateSimulatedResponse(msg, modelId);
        }
        
        document.getElementById(loadingId).remove();
        appendChatMessage("assistant", responseText);
        playgroundChatHistory.push({ role: "assistant", content: responseText });
        
    } catch (err) {
        document.getElementById(loadingId).remove();
        appendChatMessage("system", `Error: ${err.message}. Please check your API keys or connection.`);
    }
    
    btn.disabled = false;
}

function appendChatMessage(role, content) {
    const area = document.getElementById("pgChatArea");
    let html = "";
    if(role === "user") {
        html = `
        <div class="flex gap-4 mb-6 justify-end">
            <div class="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                ${escapeHtml(content)}
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-white/10">U</div>
        </div>`;
    } else if (role === "assistant") {
        html = `
        <div class="flex gap-4 mb-6">
            <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_10px_rgba(79,70,229,0.5)]">AI</div>
            <div class="bg-slate-800 border border-white/5 rounded-2xl rounded-tl-none p-4 text-slate-300 max-w-[80%] whitespace-pre-wrap">
                ${escapeHtml(content)}
            </div>
        </div>`;
    } else {
        html = `<div class="text-center text-red-400 my-4 text-sm">${escapeHtml(content)}</div>`;
    }
    
    area.innerHTML += html;
    area.scrollTop = area.scrollHeight;
}

function generateSimulatedResponse(prompt, modelId) {
    const p = prompt.toLowerCase();
    if(p.includes("hello") || p.includes("hi")) return `Hello! I am ${modelId}, running locally in your browser simulation. How can I assist you today?`;
    if(p.includes("code") || p.includes("write")) return "```javascript\nfunction simulateCode() {\n  return 'This is a simulated code block from ' + modelId;\n}\n```";
    return `[Simulated response from ${modelId}]\nI understood your query: "${prompt}". In a full deployment, I would process this using my weights. Since this is a demo, I am replying with a standard simulated response.`;
}


// Key Manager
function openKeysModal() {
    document.getElementById("keysModal").style.display = "flex";
    document.getElementById("keyOpenRouter").value = state.keys.openrouter || "";
    document.getElementById("keyOpenAI").value = state.keys.openai || "";
    document.getElementById("keyGemini").value = state.keys.gemini || "";
    document.getElementById("keyOllama").value = state.keys.ollama || "http://localhost:11434";
    updateKeyStatusDisplay();
}

function saveKeys() {
    state.keys = {
        openrouter: document.getElementById("keyOpenRouter").value,
        openai: document.getElementById("keyOpenAI").value,
        gemini: document.getElementById("keyGemini").value,
        ollama: document.getElementById("keyOllama").value
    };
    localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
    updateKeyStatusDisplay();
    toast("API Keys saved successfully", "success");
    document.getElementById("keysModal").style.display = "none";
}

function updateKeyStatusDisplay() {
    ['openrouter', 'openai', 'gemini'].forEach(k => {
        const badge = document.getElementById(`status${k.charAt(0).toUpperCase() + k.slice(1)}`);
        if(badge) {
            if(state.keys[k]) {
                badge.className = "text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-500/20";
                badge.innerText = "Connected";
            } else {
                badge.className = "text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-white/5";
                badge.innerText = "Not set";
            }
        }
    });
}


// Initialize & Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await initDB();
    } catch (e) {
        console.warn("IndexedDB init failed, falling back to localStorage", e);
    }

    updateStats();
    renderChips();
    renderGrid();
    renderInstalledGrid();
    initAuth();
    
    // Auth Tabs
    const loginTab = document.getElementById("authTabLogin");
    const regTab = document.getElementById("authTabRegister");
    const loginForm = document.getElementById("loginForm");
    const regForm = document.getElementById("registerForm");
    
    if(loginTab && regTab) {
        loginTab.addEventListener("click", () => {
            loginTab.classList.replace("border-transparent", "border-indigo-500");
            loginTab.classList.replace("text-slate-400", "text-indigo-400");
            regTab.classList.replace("border-indigo-500", "border-transparent");
            regTab.classList.replace("text-indigo-400", "text-slate-400");
            loginForm.classList.remove("hidden");
            regForm.classList.add("hidden");
        });
        
        regTab.addEventListener("click", () => {
            regTab.classList.replace("border-transparent", "border-indigo-500");
            regTab.classList.replace("text-slate-400", "text-indigo-400");
            loginTab.classList.replace("border-indigo-500", "border-transparent");
            loginTab.classList.replace("text-indigo-400", "text-slate-400");
            regForm.classList.remove("hidden");
            loginForm.classList.add("hidden");
        });
    }

    if(loginForm) loginForm.addEventListener("submit", handleLogin);
    if(regForm) regForm.addEventListener("submit", handleRegister);
    
    const guestBtn = document.getElementById("guestLoginBtn");
    if(guestBtn) guestBtn.addEventListener("click", handleGuestLogin);
    
    const authBtn = document.getElementById("authBtn");
    if(authBtn) authBtn.addEventListener("click", () => document.getElementById("authModal").style.display = "flex");
    
    const userMenu = document.getElementById("userMenu");
    const userDropdown = document.getElementById("userDropdown");
    if(userMenu) {
        userMenu.addEventListener("click", () => userDropdown.classList.toggle("hidden"));
    }
    
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    
    // Navigation
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("text-indigo-400"));
            link.classList.add("text-indigo-400");
            
            document.querySelectorAll(".section-container").forEach(s => s.classList.add("hidden"));
            const target = link.dataset.target;
            if(document.getElementById(target)) document.getElementById(target).classList.remove("hidden");
            
            if(target === 'sectionMyDock') renderInstalledGrid();
        });
    });

    // Search & Filter
    const searchInput = document.getElementById("searchInput");
    if(searchInput) {
        searchInput.addEventListener("input", (e) => {
            state.search = e.target.value;
            renderGrid();
        });
    }
    
    const sortSelect = document.getElementById("sortSelect");
    if(sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            state.sort = e.target.value;
            renderGrid();
        });
    }

    // CLI
    const cliInput = document.getElementById("cliInput");
    if(cliInput) {
        cliInput.addEventListener("keydown", (e) => {
            if(e.key === "Enter") {
                processCliCommand(cliInput.value);
                cliInput.value = "";
            }
        });
        appendTermLine("VictorX Interactive CLI v1.0.0", "text-slate-400");
        appendTermLine("Type 'help' to see available commands.", "text-slate-500 mb-4");
    }

    // Playground
    const pgInput = document.getElementById("pgInput");
    const pgSendBtn = document.getElementById("pgSendBtn");
    if(pgSendBtn) pgSendBtn.addEventListener("click", handlePlaygroundSend);
    if(pgInput) {
        pgInput.addEventListener("keydown", (e) => {
            if(e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePlaygroundSend();
            }
        });
    }

    // Modals Close
    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const modal = e.target.closest(".fixed.inset-0");
            if(modal) modal.style.display = "none";
        });
    });

    // Admin PIN & Dashboard
    const adminPinBtn = document.getElementById("adminPinBtn");
    if(adminPinBtn) {
        adminPinBtn.addEventListener("click", () => {
            document.getElementById("adminPinOverlay").style.display = "flex";
            setTimeout(() => document.querySelector(".pin-digit").focus(), 100);
        });
    }
    setupAdminPIN();
    
    document.querySelectorAll(".admin-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            switchAdminTab(e.currentTarget.dataset.target);
        });
    });

    // Global Shortcuts
    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape") {
            document.querySelectorAll(".fixed.inset-0").forEach(m => m.style.display = "none");
        }
        if(e.ctrlKey && e.key === "k") {
            e.preventDefault();
            if(searchInput) searchInput.focus();
        }
        if(e.ctrlKey && e.key === "p") {
            e.preventDefault();
            if(state.installed.size > 0) {
                openPlayground(Array.from(state.installed)[0]);
            }
        }
    });

    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("opacity-100", "translate-y-0");
                entry.target.classList.remove("opacity-0", "translate-y-10");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));
});
