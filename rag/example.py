from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain.llms import Together
from langchain.chains import RetrievalQA
import os
from dotenv import load_dotenv
import together

class RAGExample:
    def __init__(self, api_key):
        # Set Together AI API key
        together.api_key = os.getenv("together_api_key")
        
        # Initialize embedding model (using a model from Together AI)
        self.embeddings = HuggingFaceEmbeddings(
            model_name="togethercomputer/m2-bert-80M-8k-retrieval",
            model_kwargs={'device': 'cpu','trust_remote_code': True}
        )
        
        self.text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        # Initialize Together AI LLM
        self.llm = Together(
            model="togethercomputer/llama-2-7b-chat",
            temperature=0.7,
            max_tokens=512,
            together_api_key= os.getenv("together_api_key")
        )
        self.vector_store = None

    def add_documents(self, documents):
        """Add documents to the vector store"""
        texts = self.text_splitter.split_text("\n".join(documents))
        self.vector_store = FAISS.from_texts(texts, self.embeddings)
    
    def query(self, question):
        """Query the RAG system"""
        if not self.vector_store:
            return "Please add documents first"
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever()
        )
        return qa_chain.run(question)

if __name__ == "__main__":
    # Replace with your Together AI API key
    API_KEY = os.getenv("together_api_key")
    
    # Create RAG instance
    rag = RAGExample(API_KEY)
    
    # Example documents
    documents = [
        "The capital of France is Paris. It is known for the Eiffel Tower.",
        "The Eiffel Tower was completed in 1889. It is 324 meters tall.",
        "Paris is also famous for its art museums, including the Louvre."
    ]
    
    # Add documents to the system
    rag.add_documents(documents)
    
    # Example query
    question = "What can you tell me about the Eiffel Tower?"
    answer = rag.query(question)
    print(f"Question: {question}")
    print(f"Answer: {answer}")
