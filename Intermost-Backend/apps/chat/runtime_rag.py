import os
import json
import logging
from typing import List, Dict, Any, Optional
import numpy as np
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
from groq import Groq
from django.conf import settings

logger = logging.getLogger(__name__)

# Directory to store temporary session JSON files
TEMP_SESSIONS_DIR = os.path.join(settings.BASE_DIR, 'temp_sessions')
if not os.path.exists(TEMP_SESSIONS_DIR):
    os.makedirs(TEMP_SESSIONS_DIR)

# Initialize embedding model lazily
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        logger.info("Loading sentence-transformers model...")
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    return _embedding_model

def extract_text_from_pdf(file_obj) -> str:
    """Extracts text from an uploaded PDF file."""
    reader = PdfReader(file_obj)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Splits text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
        if start < 0:
            start = 0
    return [c for c in chunks if c.strip()]

class BrochureSessionManager:
    """Manages the lifecycle of a runtime RAG session."""
    
    @staticmethod
    def get_session_filepath(session_id: str) -> str:
        # Prevent path traversal
        clean_id = os.path.basename(session_id)
        return os.path.join(TEMP_SESSIONS_DIR, f"{clean_id}_rag.json")

    @staticmethod
    def create_session(session_id: str, file_obj) -> Dict[str, Any]:
        """Reads PDF, chunks, creates embeddings, and saves to JSON."""
        filepath = BrochureSessionManager.get_session_filepath(session_id)
        
        # Extract and chunk
        text = extract_text_from_pdf(file_obj)
        if not text.strip():
            raise ValueError("No text could be extracted from the PDF.")
            
        chunks = chunk_text(text)
        
        # Embed
        model = get_embedding_model()
        embeddings = model.encode(chunks)
        
        # Save to JSON
        data = {
            "session_id": session_id,
            "chunks": chunks,
            "embeddings": embeddings.tolist()  # Convert numpy array to list
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f)
            
        return {"success": True, "chunks_count": len(chunks)}

    @staticmethod
    def destroy_session(session_id: str) -> bool:
        """Deletes the session JSON file."""
        filepath = BrochureSessionManager.get_session_filepath(session_id)
        if os.path.exists(filepath):
            os.remove(filepath)
            return True
        return False

    @staticmethod
    def search_context(session_id: str, query: str, top_k: int = 5) -> str:
        """Finds most relevant chunks for a query from the stored JSON."""
        filepath = BrochureSessionManager.get_session_filepath(session_id)
        if not os.path.exists(filepath):
            raise FileNotFoundError("Session expired or not found. Please re-upload the brochure.")
            
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        chunks = data.get('chunks', [])
        saved_embeddings = np.array(data.get('embeddings', []))
        
        if not chunks or len(saved_embeddings) == 0:
            return ""
            
        # Embed query
        model = get_embedding_model()
        query_embedding = model.encode([query])[0]
        
        # Calculate cosine similarities
        # normalized_dot_product
        norm_query = np.linalg.norm(query_embedding)
        norm_saved = np.linalg.norm(saved_embeddings, axis=1)
        
        # Avoid division by zero
        norm_saved[norm_saved == 0] = 1e-10
        norm_query = norm_query if norm_query > 0 else 1e-10
        
        similarities = np.dot(saved_embeddings, query_embedding) / (norm_saved * norm_query)
        
        # Get top k indices
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        # Format context
        context_parts = []
        for idx in top_indices:
            if similarities[idx] > 0.1:  # Simple threshold
                context_parts.append(chunks[idx])
                
        return "\n\n...\n\n".join(context_parts)

class BrochureChat:
    """Handles the Groq LLM interaction with strict guardrails."""
    
    @staticmethod
    def ask_question(session_id: str, query: str) -> str:
        # Get context from RAG
        context = BrochureSessionManager.search_context(session_id, query)
        
        # Initialize Groq
        api_key = getattr(settings, 'GROQ_API_KEY', '') or os.environ.get('GROQ_API_KEY', '')
        if not api_key:
            raise ValueError("Groq API Key is not configured on the server.")
            
        client = Groq(api_key=api_key)
        
        system_prompt = f"""You are a strict QA assistant. You have been provided with extracted text from a document uploaded by the user.

YOUR INSTRUCTIONS:
1. First, analyze the provided context to determine if it appears to be a college brochure, university prospectus, or educational program guide. Look for mentions of courses, fees, campus, admissions, etc.
2. If the context does NOT look like a college brochure, YOU MUST reply EXACTLY with: "I can't answer these questions." and provide no other text.
3. If it IS a brochure, answer the user's question USING ONLY the provided context.
4. If the answer cannot be found in the provided context, state that you cannot find the answer in the document. Do NOT use outside knowledge.

DOCUMENT CONTEXT:
{context}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # A fast, efficient Groq model
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            temperature=0.0,
            max_tokens=1024,
        )
        
        return response.choices[0].message.content
