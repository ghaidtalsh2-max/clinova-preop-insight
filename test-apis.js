import fs from 'fs';

// Read .env manually
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
const speechmaticsKey = env.SPEECHMATICS_API_KEY || env.VITE_SPEECHMATICS_API_KEY;
const model = env.OPENROUTER_MODEL || env.VITE_OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

console.log('Testing OpenRouter Key exists:', !!openRouterKey, 'prefix:', openRouterKey?.slice(0, 10));
console.log('Testing Speechmatics Key exists:', !!speechmaticsKey, 'length:', speechmaticsKey?.length);

async function testOpenRouter() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Clinova - PreOp Insight'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Say "OpenRouter Connected for Clinova"' }],
        max_tokens: 30
      })
    });
    console.log('OpenRouter Response Status:', res.status);
    const data = await res.json();
    console.log('OpenRouter Output:', JSON.stringify(data));
  } catch (err) {
    console.error('OpenRouter Error:', err);
  }
}

async function testSpeechmatics() {
  try {
    // Speechmatics temporary key / usage endpoint check
    // Official Speechmatics endpoint for temp key: POST https://mp.speechmatics.com/v1/api_keys?type=rt
    const res = await fetch('https://mp.speechmatics.com/v1/api_keys?type=rt', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${speechmaticsKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ttl: 3600 })
    });
    console.log('Speechmatics Temp Key Status:', res.status);
    const data = await res.json();
    console.log('Speechmatics Output:', JSON.stringify(data));
  } catch (err) {
    console.error('Speechmatics Error:', err);
  }
}

async function run() {
  await testOpenRouter();
  await testSpeechmatics();
}

run();
