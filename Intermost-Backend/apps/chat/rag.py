"""
RAG (Retrieval Augmented Generation) Document Storage and Retrieval.
Uses Google Gemini embeddings with MongoDB for vector storage.
"""

import os
from typing import List, Optional, Dict, Any
import hashlib
import logging
from datetime import datetime
from bson import ObjectId
from django.conf import settings
import numpy as np

# Google Gemini SDK (new)
from google import genai

from apps.mongodb import get_collection

logger = logging.getLogger(__name__)

# Get API key and create client
GEMINI_API_KEY = getattr(settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def get_embedding(text: str) -> Optional[List[float]]:
    """Get embedding for a text using Gemini."""
    if not client:
        logger.error("Gemini client not initialized")
        return None
    try:
        result = client.models.embed_content(
            model="gemini-embedding-exp-03-07",
            contents=text
        )
        return result.embeddings[0].values
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        return None


def get_query_embedding(text: str) -> Optional[List[float]]:
    """Get embedding for a query using Gemini."""
    if not client:
        logger.error("Gemini client not initialized")
        return None
    try:
        result = client.models.embed_content(
            model="gemini-embedding-exp-03-07",
            contents=text
        )
        return result.embeddings[0].values
    except Exception as e:
        logger.error(f"Error generating query embedding: {e}")
        return None


def chunk_document(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """Split document into chunks for embedding."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - chunk_overlap
        if start < 0:
            start = 0
    return [c for c in chunks if c.strip()]  # Remove empty chunks


def compute_hash(text: str) -> str:
    """Compute MD5 hash of text for deduplication."""
    return hashlib.md5(text.encode('utf-8')).hexdigest()


class RAGDocumentStore:
    """
    Document store for RAG with embedding-based retrieval.
    """
    
    def __init__(self):
        self.documents_collection = get_collection('rag_documents')
        self.chunks_collection = get_collection('rag_chunks')
    
    def add_document(
        self,
        title: str,
        content: str,
        category: str = 'general',
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Add a document to the RAG store.
        Returns document ID.
        """
        # Check for duplicate
        content_hash = compute_hash(content)
        existing = self.documents_collection.find_one({'content_hash': content_hash})
        if existing:
            logger.info(f"Document with same content already exists: {existing['_id']}")
            return str(existing['_id'])
        
        # Create document record
        doc_id = ObjectId()
        document = {
            '_id': doc_id,
            'title': title,
            'content': content,
            'content_hash': content_hash,
            'category': category,
            'metadata': metadata or {},
            'chunk_count': 0,
            'is_active': True,
            'created_at': datetime.now(),
            'updated_at': datetime.now(),
        }
        
        # Chunk the document
        chunks = chunk_document(content)
        
        # Generate embeddings for chunks
        chunk_embeddings = []
        for chunk in chunks:
            embedding = get_embedding(chunk)
            if embedding:
                chunk_embeddings.append(embedding)
            else:
                logger.warning(f"Failed to generate embedding for chunk, skipping")
                chunk_embeddings.append(None)
        
        # Store chunks with embeddings
        chunk_docs = []
        for i, (chunk_text, embedding) in enumerate(zip(chunks, chunk_embeddings)):
            if embedding is None:
                continue  # Skip chunks without embeddings
            chunk_doc = {
                '_id': ObjectId(),
                'document_id': doc_id,
                'chunk_index': i,
                'text': chunk_text,
                'embedding': embedding,
                'created_at': datetime.now(),
            }
            chunk_docs.append(chunk_doc)
        
        # Save to MongoDB
        document['chunk_count'] = len(chunk_docs)
        self.documents_collection.insert_one(document)
        
        if chunk_docs:
            self.chunks_collection.insert_many(chunk_docs)
        
        logger.info(f"Added document '{title}' with {len(chunk_docs)} chunks")
        return str(doc_id)
    
    def delete_document(self, document_id: str) -> bool:
        """Delete a document and its chunks."""
        try:
            doc_oid = ObjectId(document_id)
        except:
            return False
        
        # Delete chunks
        self.chunks_collection.delete_many({'document_id': doc_oid})
        
        # Delete document
        result = self.documents_collection.delete_one({'_id': doc_oid})
        
        return result.deleted_count > 0
    
    def get_document(self, document_id: str) -> Optional[Dict]:
        """Get a document by ID."""
        try:
            doc_oid = ObjectId(document_id)
        except:
            return None
        
        doc = self.documents_collection.find_one({'_id': doc_oid})
        if doc:
            doc['_id'] = str(doc['_id'])
            doc['created_at'] = doc['created_at'].isoformat() if doc.get('created_at') else None
            doc['updated_at'] = doc['updated_at'].isoformat() if doc.get('updated_at') else None
        return doc
    
    def list_documents(
        self,
        category: Optional[str] = None,
        is_active: bool = True,
        skip: int = 0,
        limit: int = 50
    ) -> List[Dict]:
        """List all documents."""
        query = {'is_active': is_active}
        if category:
            query['category'] = category
        
        docs = list(
            self.documents_collection.find(query)
            .sort('created_at', -1)
            .skip(skip)
            .limit(limit)
        )
        
        for doc in docs:
            doc['_id'] = str(doc['_id'])
            doc['created_at'] = doc['created_at'].isoformat() if doc.get('created_at') else None
            doc['updated_at'] = doc['updated_at'].isoformat() if doc.get('updated_at') else None
            # Don't return full content in list
            if len(doc.get('content', '')) > 200:
                doc['content_preview'] = doc['content'][:200] + '...'
            else:
                doc['content_preview'] = doc.get('content', '')
            del doc['content']
            del doc['content_hash']
        
        return docs
    
    def search(self, query: str, top_k: int = 5, category: Optional[str] = None) -> List[Dict]:
        """
        Search for relevant document chunks using semantic similarity.
        Returns top_k most relevant chunks.
        """
        # Generate query embedding
        query_embedding = get_query_embedding(query)
        if not query_embedding:
            logger.error("Failed to generate query embedding")
            return []
        
        # Get all chunks (for small datasets, we do in-memory similarity)
        # For large datasets, consider using a vector database like Pinecone or Weaviate
        match_filter = {}
        if category:
            # Get document IDs for category
            doc_ids = [
                doc['_id'] for doc in 
                self.documents_collection.find({'category': category, 'is_active': True}, {'_id': 1})
            ]
            match_filter['document_id'] = {'$in': doc_ids}
        else:
            # Get all active document IDs
            doc_ids = [
                doc['_id'] for doc in 
                self.documents_collection.find({'is_active': True}, {'_id': 1})
            ]
            match_filter['document_id'] = {'$in': doc_ids}
        
        chunks = list(self.chunks_collection.find(match_filter))
        
        if not chunks:
            return []
        
        # Calculate cosine similarity
        query_vec = np.array(query_embedding)
        similarities = []
        
        for chunk in chunks:
            chunk_vec = np.array(chunk['embedding'])
            # Cosine similarity
            similarity = np.dot(query_vec, chunk_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(chunk_vec))
            similarities.append((chunk, similarity))
        
        # Sort by similarity and get top_k
        similarities.sort(key=lambda x: x[1], reverse=True)
        top_chunks = similarities[:top_k]
        
        # Format results
        results = []
        for chunk, score in top_chunks:
            # Get document info
            doc = self.documents_collection.find_one({'_id': chunk['document_id']})
            results.append({
                'chunk_id': str(chunk['_id']),
                'document_id': str(chunk['document_id']),
                'document_title': doc['title'] if doc else 'Unknown',
                'text': chunk['text'],
                'similarity_score': float(score),
            })
        
        return results
    
    def get_context_for_query(self, query: str, max_tokens: int = 2000) -> str:
        """
        Get relevant context for a query, limited by approximate token count.
        """
        results = self.search(query, top_k=10)
        
        context_parts = []
        total_chars = 0
        char_limit = max_tokens * 4  # Approximate chars per token
        
        for result in results:
            if result['similarity_score'] < 0.5:  # Skip low relevance
                continue
            
            text = result['text']
            if total_chars + len(text) > char_limit:
                break
            
            context_parts.append(f"[From: {result['document_title']}]\n{text}")
            total_chars += len(text)
        
        return "\n\n".join(context_parts)
    
    def toggle_document(self, document_id: str, is_active: bool) -> bool:
        """Toggle document active status."""
        try:
            doc_oid = ObjectId(document_id)
        except:
            return False
        
        result = self.documents_collection.update_one(
            {'_id': doc_oid},
            {'$set': {'is_active': is_active, 'updated_at': datetime.now()}}
        )
        return result.modified_count > 0
    
    def get_stats(self) -> Dict:
        """Get RAG document store statistics."""
        total_docs = self.documents_collection.count_documents({})
        active_docs = self.documents_collection.count_documents({'is_active': True})
        total_chunks = self.chunks_collection.count_documents({})
        
        # Get categories
        categories = self.documents_collection.distinct('category')
        
        return {
            'total_documents': total_docs,
            'active_documents': active_docs,
            'total_chunks': total_chunks,
            'categories': categories,
        }


# Singleton instance
_rag_store = None

def get_rag_store() -> RAGDocumentStore:
    """Get the RAG document store singleton."""
    global _rag_store
    if _rag_store is None:
        _rag_store = RAGDocumentStore()
    return _rag_store
