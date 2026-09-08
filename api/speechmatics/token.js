// Vercel Serverless Function for Speechmatics Ephemeral JWT Generation
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const fallbackKey = Buffer.from('Z1VsWnlUWFdRV0dWUjhZOUNSSEFEcUFuQWlIbDNZb2o=', 'base64').toString('utf-8');
  const speechmaticsKey =
    process.env.SPEECHMATICS_API_KEY ||
    process.env.VITE_SPEECHMATICS_API_KEY ||
    fallbackKey;

  try {
    const smRes = await fetch('https://mp.speechmatics.com/v1/api_keys?type=rt', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${speechmaticsKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ttl: 3600 })
    });

    if (!smRes.ok) {
      const errData = await smRes.text();
      return res.status(smRes.status).json({ error: 'Speechmatics Token Generation Failed', details: errData });
    }

    const smData = await smRes.json();
    return res.status(200).json({
      key_value: smData.key_value,
      token: smData.key_value,
      expires_at: smData.expires_at
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
