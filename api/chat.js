export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, messages, apiKey } = req.body;

  if (!messages || !model) {
    return res.status(400).json({ error: 'Missing required fields: model, messages' });
  }

  try {
    let apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    let authHeader = `Bearer ${apiKey}`;

    if (!apiKey) {
      await new Promise(r => setTimeout(r, 800));
      return res.status(200).json({
        id: 'chatcmpl-mock',
        choices: [
          {
            message: {
              role: 'assistant',
              content: `This is a simulated response from ${model}. To get real inference, please configure your OpenRouter API Key in the Keys menu.`
            }
          }
        ]
      });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://victor-x.vercel.app',
        'X-Title': 'Open Source Model Hub'
      },
      body: JSON.stringify({
        model: model,
        messages: messages
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Internal server error processing chat request.' });
  }
}
