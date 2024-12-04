export class Generator {
  constructor(options = {}) {
    this.options = options;
  }

  async generate(prompt) {
    // Basic implementation - can be extended to use different LLM providers
    return 'Generated response';
  }
}
