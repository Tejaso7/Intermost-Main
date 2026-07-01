import os
import json
import logging
import math
from collections import Counter
from typing import List, Dict, Any, Optional
from PyPDF2 import PdfReader
from groq import Groq
from django.conf import settings

logger = logging.getLogger(__name__)

# Directory to store temporary session JSON files
TEMP_SESSIONS_DIR = os.path.join(settings.BASE_DIR, 'temp_sessions')
if not os.path.exists(TEMP_SESSIONS_DIR):
    os.makedirs(TEMP_SESSIONS_DIR)

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

def get_tfidf_similarity(query: str, documents: List[str]) -> List[float]:
    """Simple, pure-Python TF-IDF cosine similarity search engine."""
    # Tokenizer
    def tokenize(text: str) -> List[str]:
        return [w for w in text.lower().split() if w.isalnum()]
    
    query_tokens = tokenize(query)
    doc_tokens_list = [tokenize(doc) for doc in documents]
    
    # Build vocabulary
    all_tokens = set(query_tokens)
    for doc_tokens in doc_tokens_list:
        all_tokens.update(doc_tokens)
        
    # Calculate IDF
    idf = {}
    N = len(documents)
    if N == 0:
        return []
        
    for token in all_tokens:
        df = sum(1 for doc_tokens in doc_tokens_list if token in doc_tokens)
        # Avoid log(0)
        idf[token] = math.log((1 + N) / (1 + df)) + 1
        
    # Helper to calculate TF-IDF vector
    def get_vector(tokens: List[str]) -> Dict[str, float]:
        counts = Counter(tokens)
        vector = {}
        for token, count in counts.items():
            vector[token] = count * idf.get(token, 0.0)
        return vector
        
    query_vector = get_vector(query_tokens)
    doc_vectors = [get_vector(doc_tokens) for doc_tokens in doc_tokens_list]
    
    # Calculate magnitudes
    def magnitude(v: Dict[str, float]) -> float:
        return math.sqrt(sum(val ** 2 for val in v.values()))
        
    q_mag = magnitude(query_vector)
    if q_mag == 0:
        return [0.0] * N
        
    # Calculate cosine similarity for each document
    similarities = []
    for d_vec in doc_vectors:
        d_mag = magnitude(d_vec)
        if d_mag == 0:
            similarities.append(0.0)
        else:
            # Dot product
            overlap_tokens = set(query_vector.keys()) & set(d_vec.keys())
            dot = sum(query_vector[token] * d_vec[token] for token in overlap_tokens)
            similarities.append(dot / (q_mag * d_mag))
            
    return similarities

class BrochureSessionManager:
    """Manages the lifecycle of a runtime RAG session using pure-Python indexing."""
    
    @staticmethod
    def get_session_filepath(session_id: str) -> str:
        # Prevent path traversal
        clean_id = os.path.basename(session_id)
        return os.path.join(TEMP_SESSIONS_DIR, f"{clean_id}_rag.json")

    @staticmethod
    def create_session(session_id: str, file_obj) -> Dict[str, Any]:
        """Reads PDF, chunks, and saves to JSON."""
        filepath = BrochureSessionManager.get_session_filepath(session_id)
        
        # Extract and chunk
        text = extract_text_from_pdf(file_obj)
        if not text.strip():
            raise ValueError("No text could be extracted from the PDF.")
            
        chunks = chunk_text(text)
        
        # Save to JSON
        data = {
            "session_id": session_id,
            "chunks": chunks,
            "embeddings": []  # Kept empty for schema backward-compatibility
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
        """Finds most relevant chunks for a query using TF-IDF."""
        filepath = BrochureSessionManager.get_session_filepath(session_id)
        if not os.path.exists(filepath):
            raise FileNotFoundError("Session expired or not found. Please re-upload the brochure.")
            
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        chunks = data.get('chunks', [])
        if not chunks:
            return ""
            
        # Calculate similarities
        similarities = get_tfidf_similarity(query, chunks)
        
        # Sort indices by score
        sorted_indices = sorted(range(len(similarities)), key=lambda i: similarities[i], reverse=True)
        top_indices = sorted_indices[:top_k]
        
        # Format context
        context_parts = []
        for idx in top_indices:
            if similarities[idx] > 0.05:  # Simple threshold
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
