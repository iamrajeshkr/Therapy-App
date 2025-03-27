import json
import httpx
from typing import List, Dict, Any, Optional

from app.core.config import settings

THERAPY_SYSTEM_PROMPT = """
You are a mindfulness therapy assistant focused on providing supportive guidance for mental well-being.
Your role is to help users practice mindfulness, manage stress, and develop healthy coping mechanisms.

Guidelines:
1. Be empathetic, supportive, and non-judgmental in all responses.
2. Focus on evidence-based approaches like mindfulness, cognitive behavioral therapy techniques, and stress reduction.
3. Provide practical exercises and suggestions that users can implement.
4. Maintain a calm, reassuring tone throughout conversations.
5. Respect user privacy and maintain confidentiality.
6. Recognize your limitations - you are not a replacement for professional mental health treatment.
7. If users express serious mental health concerns, gently suggest they seek professional help.
8. Keep responses brief and concise - typically 2-3 short paragraphs maximum.
9. Offer techniques for managing difficult emotions and cultivating positive mental states.
10. Avoid lengthy theoretical explanations - focus on practical advice.
11. Maintain continuity with previous parts of the conversation.

IMPORTANT: If the user expresses thoughts of self-harm, suicide, harming others, or appears to be in a mental health crisis,
emphasize that you cannot provide emergency support and encourage them to contact emergency services, a crisis helpline,
or a mental health professional immediately.
"""

SUMMARIZATION_PROMPT = """
Summarize the key points from this conversation in a concise way that preserves the most important context for continuing the conversation.
Focus on:
1. The user's main concerns, feelings, or issues
2. Any personal details or background information shared
3. The therapeutic approaches or techniques that have been discussed
4. Any commitments, suggestions, or exercises that were proposed

Keep the summary brief but informative.
"""

async def summarize_conversation(conversation_history: List[Dict[str, str]]) -> str:
    """
    Summarize the conversation history to preserve context while reducing token count
    """
    if len(conversation_history) < 3:
        # Not enough conversation to summarize yet
        return ""
    
    # Format the conversation for summarization
    conversation_text = "\n\n".join([
        f"{msg['role'].upper()}: {msg['content']}" 
        for msg in conversation_history
    ])
    
    # Create the summarization request
    messages = [
        {"role": "system", "content": SUMMARIZATION_PROMPT},
        {"role": "user", "content": conversation_text}
    ]
    
    # Make the API call to summarize
    url = f"{settings.OLLAMA_BASE_URL}/api/chat"
    payload = {
        "model": settings.OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.3,  # Lower temperature for more focused summary
            "top_p": 0.9,
            "num_predict": 200,  # Limit summary length
        }
    }
    
    # Make API request
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=10.0)
            response.raise_for_status()
            result = response.json()
            return result["message"]["content"]
        except Exception as e:
            print(f"Error during summarization: {e}")
            return ""  # Return empty summary if there's an error

async def get_therapy_response(
    conversation_history: List[Dict[str, str]], 
    conversation_summary: Optional[str] = None
) -> str:
    """
    Get a therapy response from the LLM with conversation memory
    
    Args:
        conversation_history: List of message objects with role and content
        conversation_summary: Optional pre-generated summary of earlier conversation
        
    Returns:
        The model's response as a string
    """
    # Format the conversation history
    formatted_messages = [{"role": "system", "content": THERAPY_SYSTEM_PROMPT}]
    
    # If we have a summary, add it to provide context from earlier conversation
    if conversation_summary:
        formatted_messages.append({
            "role": "system", 
            "content": f"Earlier conversation summary:\n{conversation_summary}\n\nContinue the conversation based on this context."
        })
    
    # Add recent conversation history
    # For longer conversations, only include the most recent messages (last 6)
    recent_messages = conversation_history[-6:] if len(conversation_history) > 6 else conversation_history
    
    for message in recent_messages:
        formatted_messages.append({
            "role": message["role"],
            "content": message["content"]
        })
    
    # Prepare request to Ollama API
    url = f"{settings.OLLAMA_BASE_URL}/api/chat"
    payload = {
        "model": settings.OLLAMA_MODEL,
        "messages": formatted_messages,
        "stream": False,
        "options": {
            "temperature": 0.8,     # Slightly higher for more varied responses
            "top_p": 0.9,
            "top_k": 40,
            "num_ctx": 2048,
            "num_predict": 256,
        }
    }
    
    # Make API request
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=20.0)
            response.raise_for_status()
            result = response.json()
            return result["message"]["content"]
        except (httpx.RequestError, json.JSONDecodeError, KeyError) as e:
            # Fallback response in case of error
            return f"I'm having trouble connecting to my therapy assistant right now. Please try again in a moment. Error: {str(e)}" 