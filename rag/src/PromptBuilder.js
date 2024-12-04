export class PromptBuilder {
  constructor(options = {}) {
    this.options = options;
  }

  build(documents, query) {
    const context = documents.map(doc => doc.content).join('\n\n');
    return `Context: ${context}\n\nQuestion: ${query}`;
  }
}
