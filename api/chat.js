module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing DEEPSEEK_API_KEY' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const messages = Array.isArray(body && body.messages) ? body.messages : [];

    if (!messages.length) {
      return res.status(400).json({ error: 'messages are required' });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const apiError = data && data.error && data.error.message ? data.error.message : 'DeepSeek request failed';
      return res.status(response.status).json({ error: apiError });
    }

    const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content.trim()
      : '';

    if (!reply) {
      return res.status(502).json({ error: 'DeepSeek returned an empty reply' });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate reply' });
  }
};
