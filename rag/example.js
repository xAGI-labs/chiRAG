import { Retriever } from './src/Retriever.js';
import { Generator } from './src/Generator.js';
import { PromptBuilder } from './src/PromptBuilder.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const TOGETHER_API_KEY = process.env.together_api_key;

// Initialize components
const retriever = new Retriever({
    together_api_key: TOGETHER_API_KEY
});

const generator = new Generator({
    model: 'togethercomputer/llama-2-7b-chat',
    temperature: 0.7,
    maxTokens: 512,
    together_api_key: TOGETHER_API_KEY
});

const promptBuilder = new PromptBuilder();

// Example documents
const documents = [
    {
        content: "The capital of France is Paris. It is known for the Eiffel Tower.",
        metadata: { source: "wiki-1" }
    },
    {
        content: "The Eiffel Tower was completed in 1889. It is 324 meters tall.",
        metadata: { source: "wiki-2" }
    },
    {
        content: "Paris is also famous for its art museums, including the Louvre.",
        metadata: { source: "wiki-3" }
    }
];

// Example usage
async function main() {
    try {
        console.log('Adding documents to retriever...');
        await retriever.addDocuments(documents);
        console.log('Documents added successfully!');

        // Example queries to test the system
        const queries = [
            "What can you tell me about the Eiffel Tower?",
            "What is the capital of France?",
            "Tell me about museums in Paris"
        ];

        for (const query of queries) {
            console.log('\n-------------------');
            console.log(`Query: ${query}`);
            
            // Retrieve relevant documents
            console.log('Retrieving relevant documents...');
            const relevantDocs = await retriever.retrieve(query);
            console.log('Retrieved documents:', relevantDocs.map(doc => doc.content));

            // Build prompt
            const prompt = promptBuilder.build(relevantDocs, query);
            console.log('Built prompt:', prompt);

            // Generate response
            console.log('Generating response...');
            const response = await generator.generate(prompt);
            console.log('Response:', response);
        }
    } catch (error) {
        console.error('Error in RAG pipeline:', error);
    }
}

console.log('Starting RAG example...');
main().then(() => console.log('Done!'));
