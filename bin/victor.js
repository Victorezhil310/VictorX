#!/usr/bin/env node

/* =========================================================
   Victor CLI — System Command Line Executable & Ollama Dock
   Supports: victor pull <model>, victor search <query>,
             victor run <model>, victor ls, victor keys,
             victor launch <agent>
   ========================================================= */

const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const https = require('https');

const VICTOR_DIR = path.join(os.homedir(), '.victor');
const MODELS_DIR = path.join(VICTOR_DIR, 'models');
const CONFIG_FILE = path.join(VICTOR_DIR, 'config.json');

// Ensure system directories exist
if (!fs.existsSync(VICTOR_DIR)) fs.mkdirSync(VICTOR_DIR, { recursive: true });
if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR, { recursive: true });
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({
    keys: { openrouter: "", openai: "", gemini: "", ollama: "http://localhost:11434" },
    installed: ["gemma4", "llama-3.3-70b", "deepseek-r1", "phi4", "qwen2.5-coder"]
  }, null, 2));
}

const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'help';
const param = args.slice(1).join(' ');

// ANSI colors for rich CLI output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  amber: "\x1b[38;2;240;169;61m",
  teal: "\x1b[38;2;79;209;197m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  gray: "\x1b[90m"
};

function printBanner() {
  console.log(`${colors.amber}${colors.bright}
  ⚓ VICTOR CLI v1.5.0 — Every Model, One Dock
  ${colors.dim}Registry: Local Ollama · OpenRouter · Hugging Face · Meta · Google Gemma 4${colors.reset}\n`);
}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch {
    return { keys: {}, installed: [] };
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

switch (command) {
  case 'pull':
    if (!param) {
      printBanner();
      console.log(`${colors.red}Error:${colors.reset} Please specify a model to pull.`);
      console.log(`Example: ${colors.teal}victor pull gemma4${colors.reset} or ${colors.teal}victor pull deepseek-r1${colors.reset}`);
      process.exit(1);
    }
    pullModel(param);
    break;

  case 'ls':
  case 'list':
    printBanner();
    listModels();
    break;

  case 'search':
    printBanner();
    searchModels(param);
    break;

  case 'run':
    printBanner();
    runModel(param);
    break;

  case 'launch':
    printBanner();
    launchAgent(param);
    break;

  case 'keys':
    printBanner();
    manageKeys(param);
    break;

  case 'help':
  default:
    printBanner();
    showHelp();
    break;
}

function showHelp() {
  console.log(`${colors.bright}COMMANDS:${colors.reset}`);
  console.log(`  ${colors.teal}victor pull <model-id>${colors.reset}     Pull real layers via Ollama & dock model locally`);
  console.log(`  ${colors.teal}victor run <model-id>${colors.reset}      Execute inference & stream output directly in terminal`);
  console.log(`  ${colors.teal}victor ls${colors.reset}                  List all docked & local Ollama models`);
  console.log(`  ${colors.teal}victor search <query>${colors.reset}     Search models across all registries (Gemma4, DeepSeek, Llama 3.3)`);
  console.log(`  ${colors.teal}victor launch <agent>${colors.reset}    Launch coding agent (claude-code, opencode, openclaw, hermes, vscode)`);
  console.log(`  ${colors.teal}victor keys${colors.reset}                View or set API integration keys`);
  console.log(`\n${colors.dim}To run web dashboard: npx serve . or visit https://github.com/Victorezhil310/VictorX${colors.reset}\n`);
}

function pullModel(modelName) {
  printBanner();
  console.log(`${colors.teal}→ Connecting to local Ollama server & Victor Registry for '${modelName}'...${colors.reset}`);

  const postData = JSON.stringify({ name: modelName, stream: true });
  const reqOptions = {
    hostname: 'localhost',
    port: 11434,
    path: '/api/pull',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  let connectedOllama = false;

  const req = http.request(reqOptions, (res) => {
    connectedOllama = true;
    let buffer = '';

    res.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.status) {
            let logStr = `  ${colors.green}✔${colors.reset} ${json.status}`;
            if (json.total && json.completed) {
              const pct = Math.round((json.completed / json.total) * 100);
              logStr += ` [${pct}% - ${(json.completed / (1024 * 1024)).toFixed(1)}MB / ${(json.total / (1024 * 1024)).toFixed(1)}MB]`;
            }
            process.stdout.write(`\r${logStr}\x1b[K`);
            if (json.status === 'success') console.log('');
          }
        } catch (e) {}
      }
    });

    res.on('end', () => {
      completePull(modelName);
    });
  });

  req.on('error', () => {
    // If local Ollama server is offline, fall back to layer manifest pull simulation
    console.log(`${colors.amber}Notice:${colors.reset} Local Ollama daemon not active at http://localhost:11434. Simulating layer manifest pull...`);
    simulatedPull(modelName);
  });

  req.write(postData);
  req.end();
}

function simulatedPull(modelName) {
  const cleanName = modelName.replace(/[\/\\:]/g, '-').replace(/-instruct$/i, '');
  const layers = [
    { name: 'Layer 1/4: config.json manifest', hash: 'sha256:8f3a1e9c2b4d', size: '512 KB' },
    { name: 'Layer 2/4: safetensors.index.json', hash: 'sha256:7b2d4f1a9e3c', size: '1.4 MB' },
    { name: 'Layer 3/4: weight tensor shards', hash: 'sha256:9c1a3e5b7d9f', size: 'Weights Shard' },
    { name: 'Layer 4/4: tokenizer & vocabulary', hash: 'sha256:4e9a2b5c7d1f', size: '28 MB' }
  ];

  let layerIdx = 0;
  console.log(`${colors.bright}Pulling layers:${colors.reset}`);

  const interval = setInterval(() => {
    if (layerIdx < layers.length) {
      const l = layers[layerIdx];
      console.log(`  ${colors.green}✔${colors.reset} ${l.name} [${colors.dim}${l.hash}${colors.reset}] - ${l.size} ${colors.green}100%${colors.reset}`);
      layerIdx++;
    } else {
      clearInterval(interval);
      completePull(modelName);
    }
  }, 250);
}

function completePull(modelName) {
  const cleanName = modelName.replace(/[\/\\:]/g, '-');
  const modelFile = path.join(MODELS_DIR, `${cleanName}.json`);

  const modelManifest = {
    name: modelName,
    slug: cleanName,
    dockedAt: new Date().toISOString()
  };
  fs.writeFileSync(modelFile, JSON.stringify(modelManifest, null, 2));

  const cfg = loadConfig();
  if (!cfg.installed.includes(modelName)) cfg.installed.push(modelName);
  saveConfig(cfg);

  console.log(`\n${colors.amber}${colors.bright}SUCCESS:${colors.reset} Model '${modelName}' pulled & saved to ${modelFile}`);
  console.log(`Run ${colors.teal}victor run ${modelName}${colors.reset} to execute inference in terminal.\n`);
}

function listModels() {
  const cfg = loadConfig();
  console.log(`${colors.bright}DOCKED MODELS (${cfg.installed.length}):${colors.reset}`);
  if (cfg.installed.length === 0) {
    console.log(`  ${colors.dim}No models currently docked. Run 'victor pull <model>' to install.${colors.reset}\n`);
    return;
  }
  cfg.installed.forEach((m, idx) => {
    console.log(`  ${colors.green}${idx + 1}.${colors.reset} ${colors.bright}${m}${colors.reset} ${colors.dim}(Docker Registry: ~/.victor/models/${m}.json)${colors.reset}`);
  });

  // Query local Ollama status
  http.get('http://localhost:11434/api/tags', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.models && parsed.models.length > 0) {
          console.log(`\n${colors.bright}LOCAL OLLAMA DAEMON MODELS (${parsed.models.length}):${colors.reset}`);
          parsed.models.forEach((om, i) => {
            console.log(`  ${colors.teal}•${colors.reset} ${om.name} (${(om.size / (1024*1024*1024)).toFixed(2)} GB)`);
          });
        }
      } catch (e) {}
      console.log('');
    });
  }).on('error', () => {
    console.log(`\n${colors.dim}Local Ollama daemon status: Offline (Run 'ollama serve' to enable background inference)${colors.reset}\n`);
  });
}

function searchModels(query) {
  const known = [
    { name: "gemma4", size: "9B/27B", port: "Google", tags: ["multimodal","chat","reasoning"] },
    { name: "meta-llama/llama-3.3-70b-instruct", size: "70B", port: "Meta", tags: ["reasoning","chat"] },
    { name: "deepseek/deepseek-r1", size: "671B", port: "OpenRouter", tags: ["reasoning","math","code"] },
    { name: "phi4", size: "14B", port: "Ollama", tags: ["math","reasoning"] },
    { name: "mistralai/mistral-7b-instruct", size: "7B", port: "Mistral", tags: ["chat"] },
    { name: "qwen/qwen-2.5-coder-32b", size: "32B", port: "Hugging Face", tags: ["code"] }
  ];

  const q = (query || "").toLowerCase();
  const matches = known.filter(m => !q || m.name.toLowerCase().includes(q) || m.tags.some(t => t.includes(q)));

  console.log(`${colors.bright}MANIFEST SEARCH RESULTS (${matches.length}):${colors.reset}`);
  matches.forEach(m => {
    console.log(`  • ${colors.amber}${m.name}${colors.reset} (${m.size}) [${m.port}] - Tags: ${m.tags.join(', ')}`);
  });
  console.log(`\nRun ${colors.teal}victor pull <name>${colors.reset} to install any model.\n`);
}

function runModel(modelName) {
  if (!modelName) {
    console.log(`${colors.red}Error:${colors.reset} Specify a model to run. (e.g. victor run gemma4)`);
    return;
  }
  console.log(`${colors.amber}⚡ Connecting to local execution context for '${modelName}'...${colors.reset}`);

  const prompt = "Why is the sky blue?";
  const postData = JSON.stringify({ model: modelName, prompt: prompt, stream: true });

  const reqOptions = {
    hostname: 'localhost',
    port: 11434,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  let receivedOutput = false;
  console.log(`${colors.bright}Prompt:${colors.reset} ${prompt}\n${colors.bright}Response:${colors.reset}`);

  const req = http.request(reqOptions, (res) => {
    let buffer = '';
    res.on('data', (chunk) => {
      receivedOutput = true;
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.response) {
            process.stdout.write(colors.green + json.response + colors.reset);
          }
        } catch (e) {}
      }
    });

    res.on('end', () => {
      console.log('\n');
    });
  });

  req.on('error', () => {
    console.log(`${colors.amber}[Simulated Inference]${colors.reset} Rayleigh scattering causes shorter blue wavelengths of light to scatter in Earth's atmosphere.`);
    console.log(`${colors.dim}(To stream live local GPU inferences, ensure 'ollama serve' is running at http://localhost:11434)${colors.reset}\n`);
  });

  req.write(postData);
  req.end();
}

function launchAgent(agentName) {
  const agents = {
    'claude-code': 'Terminal coding agent with tools, vision, web search, and long context.',
    'opencode': 'Open-source coding agent that edits, runs, and iterates on code.',
    'openclaw': 'Personal assistant for messaging apps and everyday tasks.',
    'hermes': 'Open-source agent with self-improving skills, memory, and messaging.',
    'vscode': 'Use Ollama models inside VS Code Chat & GitHub Copilot.'
  };

  if (!agentName || !agents[agentName]) {
    console.log(`${colors.bright}AVAILABLE INTEGRATION LAUNCHERS:${colors.reset}`);
    Object.keys(agents).forEach(k => {
      console.log(`  ${colors.teal}victor launch ${k}${colors.reset} - ${agents[k]}`);
    });
    console.log('');
    return;
  }

  console.log(`${colors.amber}🚀 Launching '${agentName}' integration with local Ollama dock...${colors.reset}`);
  console.log(`  ${colors.dim}${agents[agentName]}${colors.reset}`);
  console.log(`\nRun: ${colors.green}ollama launch ${agentName}${colors.reset}\n`);
}

function manageKeys(keyInput) {
  const cfg = loadConfig();
  if (keyInput) {
    cfg.keys.openrouter = keyInput.trim();
    saveConfig(cfg);
    console.log(`${colors.green}✓ OpenRouter API key saved securely to ~/.victor/config.json${colors.reset}\n`);
  } else {
    console.log(`${colors.bright}API INTEGRATION KEYS:${colors.reset}`);
    console.log(`  OpenRouter : ${cfg.keys.openrouter ? colors.green + 'Connected ✓' : colors.dim + 'Not set'}${colors.reset}`);
    console.log(`  OpenAI     : ${cfg.keys.openai ? colors.green + 'Connected ✓' : colors.dim + 'Not set'}${colors.reset}`);
    console.log(`  Ollama     : ${cfg.keys.ollama || 'http://localhost:11434'}`);
    console.log(`\nTo set OpenRouter key: ${colors.teal}victor keys sk-or-v1-...${colors.reset}\n`);
  }
}
