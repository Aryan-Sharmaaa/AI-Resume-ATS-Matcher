"""RAG extension point.

Recommended flow:
1. Split extracted resume text into section-aware chunks.
2. Embed chunks and job requirements.
3. Retrieve top matching chunks per requirement.
4. Give only retrieved evidence to the LLM.
5. Require structured JSON and never allow unsupported resume claims.
"""
