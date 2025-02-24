import json
import os

SCRIPTS_DIR = "scripts"

# Load a script from the scripts/ directory
def load_script(script_id):
    script_path = os.path.join(SCRIPTS_DIR, f"{script_id}.json")
    if not os.path.exists(script_path):
        return None
    with open(script_path, "r") as file:
        return json.load(file)

# Get a specific step
def get_step(script, step_id):
    for step in script["steps"]:
        if step["step_id"] == step_id:
            return step
    return None
