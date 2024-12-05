export class Generator {
  constructor(options = {}) {
    this.options = options;
    this.apiKey = options.together_api_key;
    this.model = options.model || 'togethercomputer/llama-2-7b-chat';
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 512;
  }

  async generate(prompt) {
    try {
      const response = await fetch('https://api.together.xyz/inference', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.output.choices[0].text;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
}
