"""
MongoDB Connection Utility for Intermost Backend.
Handles connection to MongoDB Atlas with proper error handling.
"""

import os
import ssl
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from django.conf import settings
import logging
import certifi

logger = logging.getLogger(__name__)

class MongoDBConnection:
    """Singleton MongoDB connection manager."""
    
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def connect(self):
        """Establish connection to MongoDB Atlas."""
        if self._client is None:
            try:
                mongodb_uri = getattr(settings, 'MONGODB_URI', os.environ.get('MONGODB_URI'))
                mongodb_name = getattr(settings, 'MONGODB_NAME', os.environ.get('MONGODB_NAME', 'intermost_db'))
                
                self._client = MongoClient(
                    mongodb_uri,
                    serverSelectionTimeoutMS=30000,
                    connectTimeoutMS=30000,
                    socketTimeoutMS=30000,
                    maxPoolSize=50,
                    retryWrites=True,
                    tlsCAFile=certifi.where(),
                    tlsAllowInvalidCertificates=True
                )

                # Verify connection
                self._client.admin.command('ping')
                self._db = self._client[mongodb_name]
                logger.info(f"Successfully connected to MongoDB: {mongodb_name}")
                
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                logger.error(f"Failed to connect to MongoDB: {e}")
                raise
                
        return self._db
    
    @property
    def db(self):
        """Get database instance."""
        if self._db is None:
            self.connect()
        return self._db
    
    @property
    def client(self):
        """Get client instance."""
        if self._client is None:
            self.connect()
        return self._client
    
    def get_collection(self, collection_name: str):
        """Get a specific collection."""
        return self.db[collection_name]
    
    def close(self):
        """Close the MongoDB connection."""
        if self._client:
            self._client.close()
            self._client = None
            self._db = None
            logger.info("MongoDB connection closed")


# Global MongoDB instance
mongodb = MongoDBConnection()


def get_db():
    """Get MongoDB database instance."""
    return mongodb.db


def get_collection(collection_name: str):
    """Get a specific MongoDB collection."""
    return mongodb.get_collection(collection_name)
