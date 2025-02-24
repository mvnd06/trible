from fastapi import APIRouter, HTTPException
from scripts.script_loader import load_script, get_step

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
