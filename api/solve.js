export default async function handler(req, res) {
    const { image, prompt } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/png;base64,${image}`
                            }
                        },
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                }],
                max_tokens: 4096
            })
        });
        const data = await response.json();

        // Transform Groq response to match expected format
        const transformedData = {
            candidates: [{
                content: {
                    parts: [{
                        text: data.choices?.[0]?.message?.content || data.error?.message || 'No response'
                    }]
                }
            }]
        };

        res.status(200).json(transformedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
