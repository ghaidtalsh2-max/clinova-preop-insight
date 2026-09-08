import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const openRouterKey = env.OPENROUTER_API_KEY || env.VITE_OPENROUTER_API_KEY;

const candidates = [
  'anthropic/claude-3.5-sonnet:beta',
  'anthropic/claude-3.5-sonnet-20241022',
  'anthropic/claude-3.7-sonnet',
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct',
  'openai/gpt-4o-mini'
];

async function checkModels() {
  for (const model of candidates) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Clinova'
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Say "OK"' }],
          max_tokens: 5
        })
      });
      const data = await res.json();
      console.log(`Model [${model}]: status ${res.status}`, data?.choices?.[0]?.message?.content || data?.error?.message);
      if (res.ok) {
        console.log(`>>> SUCCESS WITH MODEL: ${model}`);
        break;
      }
    } catch (e) {
      console.log(`Model [${model}] failed:`, e.message);
    }
  }
}

checkModels();
