export class Retriever {
  constructor(options = {}) {
    this.options = options;
    this.apiKey = options.together_api_key;
    this.documents = [];
  }

  async getEmbedding(text) {
    try {
      const response = await fetch('https://api.together.xyz/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'togethercomputer/m2-bert-80M-8k-retrieval',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error getting embedding:', error);
      throw error;
    }
  }

  async addDocuments(documents) {
    for (const doc of documents) {
      const embedding = await this.getEmbedding(doc.content);
      this.documents.push({
        ...doc,
        embedding,
      });
    }
  }

  async retrieve(query, topK = 2) {
    try {
      // Get query embedding
      const queryEmbedding = await this.getEmbedding(query);

      // Calculate cosine similarity with all documents
      const similarities = this.documents.map(doc => ({
        document: doc,
        score: this.cosineSimilarity(queryEmbedding, doc.embedding),
      }));

      // Sort by similarity score and get top K results
      return similarities
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => item.document);
    } catch (error) {
      console.error('Error retrieving documents:', error);
      throw error;
    }
  }

  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}
