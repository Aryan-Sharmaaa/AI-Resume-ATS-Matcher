"""Optional pgvector/Gemini embedding extension point.

The deterministic ATS scorer works without embeddings. For production semantic
retrieval, generate embeddings for resume chunks and JD requirements, store them
in PostgreSQL with pgvector, then combine vector similarity with keyword scores.
"""
