import json
from app.config import settings

def enabled() -> bool:
    return bool(settings.gemini_api_key)

def generate_json(prompt: str):
    if not enabled():
        return None
    try:
        from google import genai
        client = genai.Client(api_key=settings.gemini_api_key)
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
        return json.loads(response.text)
    except Exception:
        return None

def optimize_bullet(bullet: str, job_description: str = "") -> dict:
    prompt = f"""Rewrite this resume bullet for clarity, impact and ATS relevance.
Never invent metrics, numbers, tools, responsibilities, or achievements.
Preserve all factual claims. Return JSON with keys optimizedBullet, changes (array), keywordsAdded (array).
Bullet: {bullet}
Job description: {job_description}"""
    result = generate_json(prompt)
    if result:
        return result
    cleaned = bullet.strip().rstrip(".")
    return {
        "optimizedBullet": cleaned + ".",
        "changes": ["Kept the original factual content; configure GEMINI_API_KEY for AI rewriting."],
        "keywordsAdded": []
    }
