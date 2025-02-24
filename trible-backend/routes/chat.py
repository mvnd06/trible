import os
import openai
from fastapi import APIRouter, HTTPException
from scripts.script_loader import load_script, get_step
from dotenv import load_dotenv

# Init - OpenAI Client
load_dotenv()  # Load API key from .env filez
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

@router.get("/chat/{script_id}/step/{step_id}")
def get_chat_step(script_id: str, step_id: int):
    script = load_script(script_id)
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")

    step = get_step(script, step_id)
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")

    return {
        "step_id": step["step_id"],
        "customer_prompt": step["customer_prompt"],
        "allowed_variations": step.get("allowed_variations", []),
        "next_step_id": step.get("next_step_id")
    }

def ai_validate_response(user_input, expected_responses, step_context):
    """
    Uses OpenAI to validate responses flexibly and generate natural, customer-like replies.
    """
    prompt = f"""
        You are roleplaying as a customer troubleshooting an issue with a support engineer in a live chat support session.

        ----
        **Customer's Current Problem:** "{step_context}"
        **Expected Correct Responses (Examples, not strict rules):** {expected_responses}
        **Support Engineer's Response:** "{user_input}"
        ----

        Analyze the support engineer's response.

        ### **RULES FOR EVALUATING THE RESPONSE:**
        1. **If the support engineer's response matches or is semantically similar to any expected responses, you MUST reply with ONLY the exact word: "correct".**
        - **DO NOT add extra words, explanations, or punctuation.**  
        - **DO NOT generate a natural response if the answer is correct.**
        - **If the response is correct, or close to correct: return `"correct"` immediately.**
        - **If you fail to follow this rule, you are making a mistake.**
        
        2. **If the response is incorrect or slightly off, do NOT say "That’s incorrect".**  
        - Instead, act like a real customer:
            - If the response is **confusing**, express **mild frustration or uncertainty**.
            - If the response is **completely wrong**, politely challenge it and **repeat your original question**.

        3. **You must NEVER repeat any of the expected correct responses verbatim unless responding with "correct".**

        4. **You must follow these rules exactly. Any deviation is an error.**

        ### **IMPORTANT**
        - If the response is correct → Respond with **only** `"correct"`.  
        - If the response is incorrect → Generate a natural customer reply.  
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": prompt}]
        )
        return response.choices[0].message.content.strip()

    except openai.OpenAIError as e:
        print("❌ OpenAI API Error:", str(e))
        return "Hmm, I’m not sure. Can you explain that differently?"


@router.post("/chat/{script_id}/step/{step_id}")
def post_chat_response(script_id: str, step_id: int, user_message: dict):
    script = load_script(script_id)
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")

    step = get_step(script, step_id)
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")

    user_input = user_message.get("message", "").strip()

    expected_responses = step.get("expected_responses", [])
    ai_response = ai_validate_response(user_input, expected_responses, step["customer_prompt"])

    if ai_response.lower() == "correct":
        next_step_id = step.get("next_step_id")
        if not next_step_id:
            return {"message": "Scenario completed!", "next_step_id": None}

        next_step = get_step(script, next_step_id)
        if not next_step:
            raise HTTPException(status_code=404, detail="Next step not found")

        return {
            "message": next_step["customer_prompt"],
            "next_step_id": next_step["step_id"],
            "correct_answer": True,
        }
    
    # If AI determines the response is incorrect, return the AI-generated natural reply
    return {
        "message": ai_response,
        "next_step_id": step_id,  # Stay on the same step
        "correct_answer": False,
    }
