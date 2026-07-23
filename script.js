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
  sort: "most_hauled",
  connected: new Set(JSON.parse(localStorage.getItem("victor_connected") || '["ollama","hf","openrouter","meta"]')),
  user: JSON.parse(localStorage.getItem("victor_user") || 'null'),
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"openrouter":"","openai":"","gemini":"","ollama":"http://localhost:11434"}'),
  installed: new Set(JSON.parse(localStorage.getItem("victor_installed") || '["llama-3.1-8b","mistral-7b"]')),
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
    if(state.sort === "most_hauled") return b.haul - a.haul;
    if(state.sort === "newest") return a.added - b.added;
    if(state.sort === "size_asc") return parseFloat(a.size) - parseFloat(b.size); // Naive sort
    if(state.sort === "size_desc") return parseFloat(b.size) - parseFloat(a.size); // Naive sort
    if(state.sort === "name_asc") return a.name.localeCompare(b.name);
    return b.haul - a.haul;
  });

  g.innerHTML = "";
  if(filtered.length === 0) {
    g.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500" style="display:flex; flex-direction:column; align-items:center; justify-content:center;">No models found matching your criteria.</div>`;
    return;
  }

  let sIdx = 0;
  filtered.forEach((m, i) => {
    if(i > 0 && i % 6 === 0 && sIdx < SPONSORS.length) {
      const s = SPONSORS[sIdx++];
      g.innerHTML += `
        <div class="model-card bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
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
      <div class="model-card bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all flex flex-col justify-between group opacity-0 animate-fade-in" data-model="${m.id}" style="animation-delay: ${i*50}ms">
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
            ? `<button data-model="${m.id}" class="launch-playground-btn flex-1 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors font-medium text-sm flex justify-center items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Run
               </button>`
            : `<button data-model="${m.id}" class="open-pull-modal flex-1 py-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors font-medium text-sm flex justify-center items-center gap-2">
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
            <div class="col-span-full py-16 text-center" style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-300 mb-2">No models installed</h3>
                <p class="text-slate-500 mb-6">Explore the registry to pull your first model.</p>
                <button onclick="document.querySelector('.nav-link[data-target=\\'sectionRegistry\\']')?.click()" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">Browse Registry</button>
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
            <div class="model-card bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between group" data-model="${m.id}">
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
                    <button data-model="${m.id}" class="launch-playground-btn flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium">Launch</button>
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
    const authBtn = document.getElementById("openAuthBtn");
    const userMenu = document.getElementById("userMenu");
    const userAvatar = document.getElementById("userAvatar");
    const userName = document.getElementById("userName");
    
    if(state.user) {
        if(authBtn) authBtn.style.display = "none";
        if(userMenu) userMenu.style.display = "flex";
        if(userName) userName.innerText = state.user.username || "User";
        if(userAvatar) {
            const initial = state.user.username ? state.user.username.charAt(0).toUpperCase() : "?";
            userAvatar.src = `https://ui-avatars.com/api/?name=${initial}&background=random`;
        }
    } else {
        if(authBtn) authBtn.style.display = "flex";
        if(userMenu) userMenu.style.display = "none";
    }
}

function handleLogin(e) {
    if(e) e.preventDefault();
    const identifier = document.getElementById("loginUsername").value;
    const pass = document.getElementById("loginPassword").value;
    
    const users = getUsersDB();
    const user = users.find(u => (u.email === identifier || u.username === identifier) && u.password === btoa(pass));
    
    if(user) {
        state.user = user;
        localStorage.setItem("victor_user", JSON.stringify(user));
        document.getElementById("authModalOverlay").style.display = "none";
        initAuth();
        toast("Welcome back, " + user.username, "success");
    } else {
        toast("Invalid credentials", "error");
    }
}

function handleRegister(e) {
    if(e) e.preventDefault();
    const fullName = document.getElementById("regFullName").value;
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPassword").value;
    const passConfirm = document.getElementById("regConfirmPassword").value;
    
    if(pass !== passConfirm) {
        toast("Passwords do not match", "error");
        return;
    }
    
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
        fullName,
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
    document.getElementById("authModalOverlay").style.display = "none";
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
    document.getElementById("authModalOverlay").style.display = "none";
    initAuth();
    toast("Logged in as Guest");
}

function handleGoogleLogin() {
    const googleUser = {
        username: "GoogleUser_" + Math.floor(Math.random() * 1000),
        email: "user@gmail.com",
        role: "user",
        provider: "google"
    };
    state.user = googleUser;
    localStorage.setItem("victor_user", JSON.stringify(googleUser));
    document.getElementById("authModalOverlay").style.display = "none";
    initAuth();
    toast("Logged in with Google");
}

function handleLogout() {
    state.user = null;
    localStorage.removeItem("victor_user");
    state.adminAuthenticated = false;
    document.getElementById("userDropdown").style.display = "none";
    initAuth();
    toast("Logged out");
}

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
            const container = document.querySelector("#adminPinOverlay .pin-modal");
            if(container) {
                container.classList.add("animate-shake");
                setTimeout(() => container.classList.remove("animate-shake"), 500);
            }
            inputs.forEach(i => i.value = "");
            inputs[0].focus();
            toast("Access denied. Wrong PIN.", "error");
        }
    }
}

function openAdminDashboard() {
    if(!state.adminAuthenticated) {
        document.getElementById("adminPinOverlay").style.display = "flex";
        setTimeout(() => document.querySelector(".pin-digit")?.focus(), 100);
        return;
    }
    document.getElementById("adminDashboardOverlay").style.display = "flex";
    renderAdminUsers();
}

function renderAdminUsers() {
    const tbody = document.getElementById("adminUsersTableBody");
    if(!tbody) return;
    const users = getUsersDB();
    
    const countTotal = document.getElementById("adminTotalUsers");
    const countActive = document.getElementById("adminActiveSessions");
    if(countTotal) countTotal.innerText = users.length;
    if(countActive) countActive.innerText = state.user ? "1" : "0";
    
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
    document.querySelectorAll(".admin-panel").forEach(p => p.style.display = "none");
    document.querySelectorAll(".admin-tabs .tab-btn").forEach(b => b.classList.remove("active"));
    
    const targetPanel = document.getElementById(tabId);
    if(targetPanel) targetPanel.style.display = "block";
    const activeTab = document.querySelector(`.admin-tabs .tab-btn[data-target="${tabId}"]`);
    if(activeTab) activeTab.classList.add("active");
    
    if(tabId === 'adminUsersPanel') renderAdminUsers();
}

function openPullModal(modelId) {
    state.currentPullingModel = MODELS.find(m => m.id === modelId);
    if(!state.currentPullingModel) return;
    
    const m = state.currentPullingModel;
    const p = portInfo(m.port);
    
    document.getElementById("pullModalTitle").innerText = `Pulling ${m.name} (${m.size})`;
    document.getElementById("pullModalDesc").innerText = m.desc;
    document.getElementById("pullModalPort").innerText = p.name;
    document.getElementById("pullModalOverlay").style.display = "flex";
    
    document.getElementById("pullProgressBar").style.width = "0%";
    const layers = document.getElementById("pullLayers");
    if(layers) layers.innerHTML = "";
    
    const snippetEl = document.getElementById("pullCodeSnippet");
    if(snippetEl) snippetEl.innerText = `victor pull ${m.id}`;
    
    startPullSimulation();
}

function startPullSimulation() {
    const m = state.currentPullingModel;
    if(!m) return;
    const layerData = [
        { name: "config.json", size: 1024 },
        { name: "safetensors.index.json", size: 24000 },
        { name: "weight_shards.bin", size: 1024 * 1024 * 100 }, 
        { name: "tokenizer.model", size: 1024 * 500 }
    ];
    
    const layersContainer = document.getElementById("pullLayers");
    layersContainer.innerHTML = "";
    
    const layerEls = layerData.map((ld, i) => {
        const div = document.createElement("div");
        div.className = "mb-2";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span style="color:#94a3b8;">${escapeHtml(ld.name)}</span>
                <span style="color:#64748b;">0%</span>
            </div>
            <div style="width:100%; background:#1e293b; border-radius:9999px; height:6px; overflow:hidden;">
                <div style="width:0%; background:#818cf8; height:100%; transition:width 0.1s;" id="layerProgress_${i}"></div>
            </div>
        `;
        layersContainer.appendChild(div);
        return { ...ld, el: document.getElementById(`layerProgress_${i}`), textEl: div.querySelector("span:nth-child(2)") };
    });
    
    const btn = document.getElementById("pullConfirmBtn");
    if(btn) {
        btn.disabled = true;
        btn.innerText = "Pulling...";
    }
    
    let layerIdx = 0;
    
    function animateLayer(layer, cb) {
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 15;
            if(p >= 100) {
                p = 100;
                clearInterval(interval);
                layer.el.style.width = "100%";
                layer.textEl.innerText = "100%";
                layer.el.style.background = "#34d399";
                document.getElementById("pullProgressBar").style.width = `${((layerIdx + 1) / layerData.length) * 100}%`;
                setTimeout(cb, 200);
            } else {
                layer.el.style.width = `${p}%`;
                layer.textEl.innerText = `${Math.floor(p)}%`;
            }
        }, 100);
    }
    
    function nextLayer() {
        if(layerIdx < layerEls.length) {
            animateLayer(layerEls[layerIdx], () => {
                layerIdx++;
                nextLayer();
            });
        } else {
            if(btn) {
                btn.innerText = "Complete";
                btn.style.background = "#34d399";
            }
            
            const pgBtn = document.getElementById("pullPlaygroundBtn");
            if(pgBtn) pgBtn.style.display = "inline-block";
            
            setTimeout(() => {
                state.installed.add(state.currentPullingModel.id);
                localStorage.setItem("victor_installed", JSON.stringify(Array.from(state.installed)));
                
                if(state.user) {
                    const users = getUsersDB();
                    const uIdx = users.findIndex(u => u.username === state.user.username);
                    if(uIdx > -1) {
                        users[uIdx].modelsPulled = (users[uIdx].modelsPulled || 0) + 1;
                        saveUsersDB(users);
                    }
                }
                
                toast(`Successfully pulled ${state.currentPullingModel.name}`, "success");
                updateStats();
                renderInstalledGrid();
                renderGrid();
                
                if(btn) {
                    btn.disabled = false;
                    btn.innerText = "Close";
                    btn.onclick = () => document.getElementById("pullModalOverlay").style.display = "none";
                }
            }, 500);
        }
    }
    
    nextLayer();
}

let playgroundChatHistory = [];

function openPlayground(modelId) {
    if(!modelId) {
        modelId = Array.from(state.installed)[0] || "llama-3.1-8b";
    }
    if(!state.installed.has(modelId)) {
        state.installed.add(modelId);
        localStorage.setItem("victor_installed", JSON.stringify(Array.from(state.installed)));
    }
    
    document.getElementById("playgroundModalOverlay").style.display = "flex";
    
    const select = document.getElementById("pgModelSelect");
    if(select) {
        select.innerHTML = "";
        Array.from(state.installed).forEach(id => {
            const m = MODELS.find(x => x.id === id);
            if(m) {
                select.innerHTML += `<option value="${m.id}" ${m.id === modelId ? 'selected' : ''}>${m.name} (${m.size})</option>`;
            }
        });
    }
    
    const history = document.getElementById("pgHistory");
    if(history) {
        history.innerHTML = `
            <div class="msg system text-center text-slate-500 my-8" style="text-align:center; color:#64748b; margin:24px 0;">
                System: Connected to ${modelId}. Type a message to begin.
            </div>
        `;
    }
    playgroundChatHistory = [];
}

async function handlePlaygroundSend(e) {
    if(e) e.preventDefault();
    const input = document.getElementById("pgInput");
    const msg = input.value.trim();
    if(!msg) return;
    
    const modelSelect = document.getElementById("pgModelSelect");
    const modelId = modelSelect ? modelSelect.value : "llama-3.1-8b";
    const model = MODELS.find(m => m.id === modelId);
    
    input.value = "";
    appendChatMessage("user", msg);
    playgroundChatHistory.push({ role: "user", content: msg });
    
    const loadingId = "msg-" + Date.now();
    const chatArea = document.getElementById("pgHistory");
    chatArea.innerHTML += `<div id="${loadingId}" class="msg assistant" style="margin-bottom:12px; padding:12px; background:#111827; border-radius:8px; border:1px solid #1e293b;"><strong style="color:#818cf8;">${model ? model.name : 'AI'}:</strong> <span class="animate-pulse">Thinking...</span></div>`;
    chatArea.scrollTop = chatArea.scrollHeight;
    
    setTimeout(() => {
        const loadingEl = document.getElementById(loadingId);
        const reply = generateSimulatedResponse(msg, modelId);
        playgroundChatHistory.push({ role: "assistant", content: reply });
        if(loadingEl) {
            loadingEl.innerHTML = `<strong style="color:#818cf8;">${model ? model.name : 'AI'}:</strong> ${escapeHtml(reply)}`;
        }
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 1000);
}

function appendChatMessage(role, text) {
    const chatArea = document.getElementById("pgHistory");
    if(!chatArea) return;
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.style.marginBottom = "12px";
    div.style.padding = "12px";
    div.style.borderRadius = "8px";
    div.style.border = "1px solid #1e293b";
    
    if(role === "user") {
        div.style.background = "#1e293b";
        div.innerHTML = `<strong style="color:#e2e8f0;">You:</strong> ${escapeHtml(text)}`;
    } else {
        div.style.background = "#111827";
        div.innerHTML = `<strong style="color:#818cf8;">Assistant:</strong> ${escapeHtml(text)}`;
    }
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function generateSimulatedResponse(prompt, modelId) {
    const p = prompt.toLowerCase();
    if(p.includes("hello") || p.includes("hi")) return `Hello! I am ${modelId}, running locally in your browser simulation. How can I assist you today?`;
    if(p.includes("code") || p.includes("write")) return "```javascript\nfunction simulateCode() {\n  return 'This is a simulated code block from ' + modelId;\n}\n```";
    return `[Response from ${modelId}]\nI processed your query: "${prompt}". Model inference completed successfully.`;
}

function openKeysModal() {
    document.getElementById("apiKeysModalOverlay").style.display = "flex";
    document.getElementById("keyOpenRouter").value = state.keys.openrouter || "";
    document.getElementById("keyOpenAI").value = state.keys.openai || "";
    document.getElementById("keyGemini").value = state.keys.gemini || "";
    document.getElementById("urlOllama").value = state.keys.ollama || "http://localhost:11434";
}

function saveKeys(e) {
    if(e) e.preventDefault();
    state.keys = {
        openrouter: document.getElementById("keyOpenRouter").value,
        openai: document.getElementById("keyOpenAI").value,
        gemini: document.getElementById("keyGemini").value,
        ollama: document.getElementById("urlOllama").value
    };
    localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
    toast("API Keys saved successfully", "success");
    document.getElementById("apiKeysModalOverlay").style.display = "none";
}

function clearKeys() {
    document.getElementById("keyOpenRouter").value = "";
    document.getElementById("keyOpenAI").value = "";
    document.getElementById("keyGemini").value = "";
    document.getElementById("urlOllama").value = "http://localhost:11434";
    state.keys = { openrouter:"", openai:"", gemini:"", ollama:"http://localhost:11434" };
    localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
    toast("API Keys cleared", "info");
}

function updateKeyStatusDisplay() {}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await initDB();
    } catch (e) {
        console.warn("IndexedDB init failed", e);
    }

    updateStats();
    renderChips();
    renderGrid();
    renderInstalledGrid();
    initAuth();
    
    const loginTab = document.getElementById("authTabLogin");
    const regTab = document.getElementById("authTabRegister");
    const loginForm = document.getElementById("loginForm");
    const regForm = document.getElementById("registerForm");
    
    if(loginTab && regTab) {
        loginTab.addEventListener("click", () => {
            loginTab.classList.add("active");
            regTab.classList.remove("active");
            if(loginForm) loginForm.style.display = "block";
            if(regForm) regForm.style.display = "none";
        });
        
        regTab.addEventListener("click", () => {
            regTab.classList.add("active");
            loginTab.classList.remove("active");
            if(regForm) regForm.style.display = "block";
            if(loginForm) loginForm.style.display = "none";
        });
    }

    if(loginForm) loginForm.addEventListener("submit", handleLogin);
    if(regForm) regForm.addEventListener("submit", handleRegister);
    
    const guestBtn = document.getElementById("quickGuestLoginBtn");
    if(guestBtn) guestBtn.addEventListener("click", handleGuestLogin);
    
    const googleBtn = document.getElementById("googleSignInBtn");
    if(googleBtn) googleBtn.addEventListener("click", handleGoogleLogin);
    
    const openAuthBtn = document.getElementById("openAuthBtn");
    if(openAuthBtn) openAuthBtn.addEventListener("click", () => {
        document.getElementById("authModalOverlay").style.display = "flex";
    });

    const adminPinBtn = document.getElementById("adminPinBtn");
    if(adminPinBtn) adminPinBtn.addEventListener("click", () => {
        document.getElementById("adminPinOverlay").style.display = "flex";
        setTimeout(() => document.querySelector(".pin-digit")?.focus(), 100);
    });

    const pinCancelBtn = document.getElementById("pinCancelBtn");
    if(pinCancelBtn) pinCancelBtn.addEventListener("click", () => {
        document.getElementById("adminPinOverlay").style.display = "none";
    });

    const pinVerifyBtn = document.getElementById("pinVerifyBtn");
    if(pinVerifyBtn) pinVerifyBtn.addEventListener("click", checkPIN);

    const openUpiModalBtn = document.getElementById("openUpiModalBtn");
    if(openUpiModalBtn) openUpiModalBtn.addEventListener("click", () => {
        document.getElementById("upiModalOverlay").style.display = "flex";
    });

    const footerSupportBtn = document.getElementById("footerSupportBtn");
    if(footerSupportBtn) footerSupportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("upiModalOverlay").style.display = "flex";
    });

    const confirmSupportBtn = document.getElementById("confirmSupportBtn");
    if(confirmSupportBtn) confirmSupportBtn.addEventListener("click", () => {
        toast("Thank you for supporting VictorX!", "success");
        document.getElementById("upiModalOverlay").style.display = "none";
    });

    const openApiKeysBtn = document.getElementById("openApiKeysBtn");
    if(openApiKeysBtn) openApiKeysBtn.addEventListener("click", openKeysModal);

    const openConnectedBtn = document.getElementById("openConnectedBtn");
    if(openConnectedBtn) openConnectedBtn.addEventListener("click", openKeysModal);

    const dropdownKeysBtn = document.getElementById("dropdownKeysBtn");
    if(dropdownKeysBtn) dropdownKeysBtn.addEventListener("click", openKeysModal);

    const pgApiKeysBtn = document.getElementById("pgApiKeysBtn");
    if(pgApiKeysBtn) pgApiKeysBtn.addEventListener("click", openKeysModal);

    const heroPlaygroundBtn = document.getElementById("heroPlaygroundBtn");
    if(heroPlaygroundBtn) heroPlaygroundBtn.addEventListener("click", () => openPlayground());

    const heroPlaygroundBtnNav = document.getElementById("heroPlaygroundBtnNav");
    if(heroPlaygroundBtnNav) heroPlaygroundBtnNav.addEventListener("click", (e) => {
        e.preventDefault();
        openPlayground();
    });

    const dropdownDockBtn = document.getElementById("dropdownDockBtn");
    if(dropdownDockBtn) dropdownDockBtn.addEventListener("click", () => {
        document.getElementById("userDropdown").style.display = "none";
        const dockEl = document.getElementById("mydock");
        if(dockEl) dockEl.scrollIntoView({ behavior: "smooth" });
    });
    
    const userMenu = document.getElementById("userMenu");
    const userDropdown = document.getElementById("userDropdown");
    if(userMenu) {
        userMenu.addEventListener("click", (e) => {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === "none" || !userDropdown.style.display ? "block" : "none";
        });
    }
    
    document.addEventListener("click", (e) => {
        if(userDropdown && !e.target.closest("#userMenu")) {
            userDropdown.style.display = "none";
        }
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn) logoutBtn.addEventListener("click", handleLogout);

    const clearTermBtn = document.getElementById("clearTermBtn");
    if(clearTermBtn) {
        clearTermBtn.addEventListener("click", () => {
            const history = document.getElementById("termHistory");
            if(history) history.innerHTML = "";
            appendTermLine("Terminal cleared.", "text-slate-500");
        });
    }

    document.querySelectorAll(".partner-card .btn, .partner-card button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const card = e.currentTarget.closest(".partner-card");
            if(card) {
                const title = card.querySelector("h3")?.innerText || "";
                const select = document.getElementById("partnerTier");
                if(select) {
                    if(title.includes("Gold")) select.value = "Gold Partner";
                    else if(title.includes("Silver")) select.value = "Silver Partner";
                    else if(title.includes("Bronze")) select.value = "Bronze Partner";
                }
            }
            const form = document.getElementById("partnerForm");
            if(form) form.scrollIntoView({ behavior: "smooth" });
        });
    });

    const requestSlotBtn = document.getElementById("requestSlotBtn");
    if(requestSlotBtn) {
        requestSlotBtn.addEventListener("click", () => {
            const form = document.getElementById("partnerForm");
            if(form) form.scrollIntoView({ behavior: "smooth" });
            else toast("Ad slot inquiry requested", "info");
        });
    }
    
    document.addEventListener("click", (e) => {
        const pullBtn = e.target.closest(".open-pull-modal") || e.target.closest(".btn-pull");
        if(pullBtn && !pullBtn.classList.contains("installed")) {
            const modelId = pullBtn.getAttribute("data-model");
            if(modelId) openPullModal(modelId);
        }
        
        const pgBtn = e.target.closest(".launch-playground-btn");
        if(pgBtn) {
            const modelId = pgBtn.getAttribute("data-model");
            openPlayground(modelId);
        }
        
        if(e.target.closest(".btn-close")) {
            const modal = e.target.closest(".modal-overlay") || e.target.closest(".pin-overlay");
            if(modal) modal.style.display = "none";
        }

        if(e.target.classList.contains("modal-overlay") || e.target.classList.contains("pin-overlay")) {
            e.target.style.display = "none";
        }
    });

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

    const cliInput = document.getElementById("cliInput");
    if(cliInput) {
        cliInput.addEventListener("keydown", (e) => {
            if(e.key === "Enter") {
                processCliCommand(cliInput.value);
                cliInput.value = "";
            }
        });
        appendTermLine("VictorX Interactive CLI v1.4.0", "text-slate-400");
        appendTermLine("Type 'help' to see available commands.", "text-slate-500 mb-4");
    }

    const pgForm = document.getElementById("pgForm");
    if(pgForm) pgForm.addEventListener("submit", handlePlaygroundSend);

    const pgInput = document.getElementById("pgInput");
    if(pgInput) {
        pgInput.addEventListener("keydown", (e) => {
            if(e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePlaygroundSend();
            }
        });
    }

    setupAdminPIN();
    
    document.querySelectorAll(".admin-tabs .tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            switchAdminTab(e.currentTarget.dataset.target);
        });
    });
    
    document.querySelectorAll(".legal-tabs .tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".legal-panel").forEach(p => p.style.display = "none");
            document.querySelectorAll(".legal-tabs .tab-btn").forEach(b => b.classList.remove("active"));
            const target = e.currentTarget.dataset.target;
            const targetPanel = document.getElementById(target);
            if(targetPanel) targetPanel.style.display = "block";
            e.currentTarget.classList.add("active");
        });
    });

    const apiKeysForm = document.getElementById("apiKeysForm");
    if(apiKeysForm) apiKeysForm.addEventListener("submit", saveKeys);

    const saveApiKeysBtn = document.getElementById("saveApiKeysBtn");
    if(saveApiKeysBtn) saveApiKeysBtn.addEventListener("click", saveKeys);

    const clearApiKeysBtn = document.getElementById("clearApiKeysBtn");
    if(clearApiKeysBtn) clearApiKeysBtn.addEventListener("click", clearKeys);
    
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const input = e.currentTarget.parentElement.querySelector("input");
            if(input) {
                if(input.type === "password") {
                    input.type = "text";
                    e.currentTarget.innerText = "🔒";
                } else {
                    input.type = "password";
                    e.currentTarget.innerText = "👁";
                }
            }
        });
    });

    const partnerForm = document.getElementById("partnerForm");
    if(partnerForm) {
        partnerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            toast("Partnership inquiry submitted successfully!", "success");
            partnerForm.reset();
        });
    }

    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape") {
            document.querySelectorAll(".modal-overlay, .pin-overlay").forEach(m => m.style.display = "none");
        }
        if(e.ctrlKey && e.key === "k") {
            e.preventDefault();
            if(searchInput) searchInput.focus();
        }
        if(e.ctrlKey && e.key === "p") {
            e.preventDefault();
            openPlayground();
        }
    });
});
