# RAG (Retrieval Augmented Generation)

A simple and modular implementation of the Retrieval Augmented Generation (RAG) workflow.

## Components

The package consists of three main components:

1. **Retriever**: Handles document retrieval and similarity search
2. **PromptBuilder**: Constructs prompts by combining retrieved context with user queries
3. **Generator**: Manages the interaction with language models for text generation

## Installation

```bash
npm install rag
```

## Usage

```javascript
import { Retriever, PromptBuilder, Generator } from 'rag';

// Initialize components
const retriever = new Retriever();
const promptBuilder = new PromptBuilder();
const generator = new Generator();

// Use the RAG workflow
const documents = await retriever.retrieve('query');
const prompt = promptBuilder.build(documents, 'query');
const response = await generator.generate(prompt);
```

## License

MIT
