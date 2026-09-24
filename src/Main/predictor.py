import json
import sys
from pathlib import Path

import joblib
import pandas as pd

from Feature_engineering import Feature_engineering

ROOT = Path(__file__).resolve().parent.parent
MODEL_CANDIDATES = [
    ROOT / "src" / "models" / "random_forest.pkl",
    ROOT / "models" / "random_forest.pkl",
]
MODEL_PATH = next((path for path in MODEL_CANDIDATES if path.exists()), MODEL_CANDIDATES[0])
model = joblib.load(MODEL_PATH)

FEATURE_COLUMNS = [
    "step",
    "amount",
    "oldbalanceOrg",
    "newbalanceOrig",
    "oldbalanceDest",
    "newbalanceDest",
    "hour",
    "is_night",
    "sender_balance_change",
    "receiver_balance_change",
    "orig_balance_zero",
    "dest_balance_zero",
    "type_TRANSFER",
]


def predictor(X_new, model=model):
    dataframe = X_new.copy()
    engineered = Feature_engineering(dataframe)
    engineered = engineered.reindex(columns=FEATURE_COLUMNS, fill_value=0)
    prediction = model.predict(engineered)
    probability = model.predict_proba(engineered)[:, 1]
    return prediction, probability


if __name__ == "__main__":
    raw_payload = sys.stdin.read().strip()
    if not raw_payload:
        raise SystemExit("No payload received")

    payload = json.loads(raw_payload)
    record = pd.DataFrame([payload])
    prediction, probability = predictor(record)
    result = {
        "isFraud": bool(int(prediction[0])),
        "probability": round(float(probability[0]), 4),
    }
    print(json.dumps(result))