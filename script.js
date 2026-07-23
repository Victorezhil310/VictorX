// VictorX State & Synchronization
let state = {
    installed: ["llama-3.1-8b", "mistral-7b"],
    keys: { openrouter: "" },
    user: null,
    savedRequests: [],
    apiLogs: [],
    activeWorkbenchTab: 'body',
    adminAuthenticated: false
};

// Initial models mock data
const allModels = [
    { id: "llama-3.1-8b", name: "Llama 3.1 8B", developer: "Meta", tags: ["NLP", "Text"], params: "8B", hauled: 1500, time: "2 days ago" },
    { id: "mistral-7b", name: "Mistral 7B", developer: "Mistral AI", tags: ["NLP", "Text"], params: "7B", hauled: 3200, time: "1 week ago" },
    { id: "llama-3.3-70b", name: "Llama 3.3 70B", developer: "Meta", tags: ["NLP", "Text"], params: "70B", hauled: 500, time: "3 hours ago" }
];

async function syncDB() {
    try {
        const stored = localStorage.getItem('victorx_state');
        if (stored) {
            state = { ...state, ...JSON.parse(stored) };
        } else {
            // Fallback to fetch data.json if available
            try {
                const res = await fetch('./db/data.json');
                if (res.ok) {
                    const data = await res.json();
                    state.installed = data.installed || [];
                    state.savedRequests = data.savedRequests || [];
                    state.apiLogs = data.apiLogs || [];
                    saveState();
                }
            } catch (e) {
                console.log("No data.json found, using defaults");
            }
        }
    } catch (e) {
        console.error("DB Sync error", e);
    }
}

function saveState() {
    localStorage.setItem('victorx_state', JSON.stringify(state));
}

// Apidog API Testing Workbench Engine
function initApidogWorkbench() {
    const sendBtn = document.getElementById('apiSendBtn');
    if (sendBtn) sendBtn.addEventListener('click', handleSendApiRequest);
    
    const saveBtn = document.getElementById('apiSaveBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveApiRequest);
    
    // Tab switchers
    const tabs = document.querySelectorAll('.workbench-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            state.activeWorkbenchTab = e.target.dataset.tab;
            generateCodeSnippets();
        });
    });
}

async function handleSendApiRequest() {
    const url = document.getElementById('apiUrl')?.value || "https://openrouter.ai/api/v1/chat/completions";
    const method = document.getElementById('apiMethod')?.value || "POST";
    const bodyContent = document.getElementById('apiRequestBody')?.value || "{}";
    
    const startTime = performance.now();
    let status = 200;
    let size = 0;
    let responseData = {};
    
    try {
        if (url.includes('openrouter.ai') && state.keys.openrouter) {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${state.keys.openrouter}`
            };
            const res = await fetch(url, { method, headers, body: bodyContent });
            status = res.status;
            responseData = await res.json();
            size = JSON.stringify(responseData).length;
        } else {
            // Mock Response
            status = 200;
            responseData = {
                id: "chatcmpl-mock",
                object: "chat.completion",
                created: Date.now(),
                choices: [{ index: 0, message: { role: "assistant", content: "This is a mock response. Please add an OpenRouter API key for real requests." }, finish_reason: "stop" }]
            };
            size = JSON.stringify(responseData).length;
        }
    } catch (err) {
        status = 500;
        responseData = { error: err.message };
    }
    
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    
    displayApiResponse(responseData, status, latency, size);
    
    // Log
    state.apiLogs.push({ url, method, status, latency, time: new Date().toISOString() });
    saveState();
}

function displayApiResponse(data, status, latency, size) {
    const viewer = document.getElementById('apiResponseViewer');
    const statusBadge = document.getElementById('apiResponseStatus');
    const timeBadge = document.getElementById('apiResponseTime');
    const sizeBadge = document.getElementById('apiResponseSize');
    
    if (viewer) viewer.textContent = JSON.stringify(data, null, 2);
    if (statusBadge) {
        statusBadge.textContent = `${status} ${status === 200 ? 'OK' : 'Error'}`;
        statusBadge.className = status === 200 ? 'badge-green' : 'badge-red';
    }
    if (timeBadge) timeBadge.textContent = `${latency} ms`;
    if (sizeBadge) sizeBadge.textContent = `${size} B`;
}

function saveApiRequest() {
    const url = document.getElementById('apiUrl')?.value;
    const method = document.getElementById('apiMethod')?.value;
    const body = document.getElementById('apiRequestBody')?.value;
    
    state.savedRequests.push({ id: `req-${Date.now()}`, name: "Saved Request", method, url, body });
    saveState();
    alert("Request saved successfully!");
}

function generateCodeSnippets() {
    const url = document.getElementById('apiUrl')?.value || "https://api.example.com";
    const method = document.getElementById('apiMethod')?.value || "GET";
    const body = document.getElementById('apiRequestBody')?.value || "";
    
    const snippetBlock = document.getElementById('generatedCodeSnippet');
    if (!snippetBlock) return;
    
    let code = "";
    // Simplified snippet generation
    code += `// cURL\ncurl -X ${method} ${url} -d '${body}'\n\n`;
    code += `// JavaScript (fetch)\nfetch("${url}", {\n  method: "${method}",\n  body: JSON.stringify(${body})\n});\n`;
    
    snippetBlock.textContent = code;
}

function testModelInApidog(modelId) {
    const urlInput = document.getElementById('apiUrl');
    const bodyInput = document.getElementById('apiRequestBody');
    
    if (urlInput) urlInput.value = "https://openrouter.ai/api/v1/chat/completions";
    if (bodyInput) {
        bodyInput.value = JSON.stringify({
            model: modelId,
            messages: [{ role: "user", content: "Hello!" }]
        }, null, 2);
    }
    
    document.getElementById('workbench-section')?.scrollIntoView({ behavior: 'smooth' });
    generateCodeSnippets();
}

// Hugging Face Model Registry & Search Engine
function renderGrid(searchQuery = "", sortOrder = "most_hauled") {
    const grid = document.getElementById('modelsGrid');
    if (!grid) return;
    
    let filtered = allModels.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (sortOrder === "newest") filtered.sort((a, b) => b.time.localeCompare(a.time));
    else if (sortOrder === "params") filtered.sort((a, b) => parseInt(b.params) - parseInt(a.params));
    else filtered.sort((a, b) => b.hauled - a.hauled);
    
    grid.innerHTML = filtered.map(m => `
        <div class="model-card">
            <h3>${m.name}</h3>
            <p>${m.developer}</p>
            <div class="actions">
                <button onclick="openPullModal('${m.id}')">Pull Model</button>
                <button onclick="testModelInApidog('${m.id}')">⚡ Test in Apidog</button>
                <button onclick="openPlayground('${m.id}')">Launch Playground</button>
            </div>
        </div>
    `).join('');
}

function renderInstalledGrid() {
    const grid = document.getElementById('installedGrid');
    if (!grid) return;
    
    const installedModels = allModels.filter(m => state.installed.includes(m.id));
    grid.innerHTML = installedModels.map(m => `
        <div class="model-card">
            <h3>${m.name}</h3>
            <button onclick="openPlayground('${m.id}')">Launch Playground</button>
        </div>
    `).join('');
}

// Model Pull Simulator
function openPullModal(modelId) {
    const modal = document.getElementById('pullModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('pullModelId').textContent = modelId;
    }
}

function startPullSimulation() {
    const modelId = document.getElementById('pullModelId')?.textContent;
    const bar = document.getElementById('pullProgressBar');
    if (!modelId || !bar) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        bar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            if (!state.installed.includes(modelId)) {
                state.installed.push(modelId);
                saveState();
                renderInstalledGrid();
            }
            alert(`Model ${modelId} pulled successfully!`);
            document.getElementById('pullModal').style.display = 'none';
        }
    }, 200);
}

// AI Playground
function openPlayground(modelId) {
    const modal = document.getElementById('playgroundModal');
    if (modal) modal.style.display = 'flex';
    // init playground context
}

function handlePlaygroundSend() {
    const input = document.getElementById('playgroundInput')?.value;
    const chat = document.getElementById('playgroundChat');
    if (!input || !chat) return;
    
    chat.innerHTML += `<div class="msg user">${input}</div>`;
    
    setTimeout(() => {
        chat.innerHTML += `<div class="msg ai">This is a simulated response. Set API Key to chat with real models.</div>`;
    }, 500);
}

// Admin Control Panel
function initAdminPanel() {
    const btn = document.getElementById('adminPinBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            document.getElementById('adminPinOverlay').style.display = 'flex';
        });
    }
}

function verifyAdminPin() {
    const pin = document.getElementById('adminPinInput')?.value;
    if (pin === "20032004") {
        state.adminAuthenticated = true;
        document.getElementById('adminPinOverlay').style.display = 'none';
        document.getElementById('adminDashboardOverlay').style.display = 'flex';
    } else {
        alert("Invalid PIN");
    }
}

// Auth & Modals
function setupModals() {
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal-overlay').style.display = 'none';
        });
    });
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        }
    });
    
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    await syncDB();
    initApidogWorkbench();
    renderGrid();
    renderInstalledGrid();
    initAdminPanel();
    setupModals();
});

// Expose globally
window.openPullModal = openPullModal;
window.startPullSimulation = startPullSimulation;
window.testModelInApidog = testModelInApidog;
window.openPlayground = openPlayground;
window.handlePlaygroundSend = handlePlaygroundSend;
window.verifyAdminPin = verifyAdminPin;
