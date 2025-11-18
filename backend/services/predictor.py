# backend/services/predictor.py
import os
from pathlib import Path
import joblib
import numpy as np
import pandas as pd

# Path to model (can override with MODEL_PATH env var)
MODEL_PATH = os.getenv("MODEL_PATH", "backend/models/disease_prediction_model.joblib")

# Load model (this is synchronous)
try:
    _model = joblib.load(Path(MODEL_PATH))
    print("Predictor: model loaded from", MODEL_PATH)
except Exception as e:
    _model = None
    print("Predictor: failed to load model:", e)

# EXACT expected features (from your model)
EXPECTED_FEATURES = [
    'ph', 'turbidity', 'tds', 'chlorine', 'fluoride', 'nitrate', 'coliform',
    'temperature', 'diarrhea', 'vomiting', 'fever', 'abdominal_pain', 'jaundice',
    'dehydration', 'fatigue', 'nausea', 'headache', 'symptom_diarrhea',
    'symptom_vomiting', 'symptom_fever', 'symptom_abdominal_pain',
    'symptom_jaundice', 'symptom_dehydration', 'symptom_fatigue',
    'symptom_nausea', 'symptom_headache', 'district_Dibrugarh',
    'district_Jorhat', 'district_Kamrup Metro', 'district_Sonitpur',
    'primary_water_source_Municipal tap water', 'primary_water_source_Pond water',
    'primary_water_source_River water', 'primary_water_source_Tube well',
    'primary_water_source_Well water'
]

DISTRICT_CATS = ["Dibrugarh", "Jorhat", "Kamrup Metro", "Sonitpur"]
WATER_SOURCE_CATS = ["Municipal tap water", "Pond water", "River water", "Tube well", "Well water"]

def _safe_float(x):
    try:
        return float(x)
    except Exception:
        return 0.0

def _normalize_symptoms(symptoms):
    if symptoms is None:
        return []
    if isinstance(symptoms, str):
        parts = [s.strip() for s in symptoms.split(",") if s.strip()]
        return [p.lower() for p in parts]
    return [str(s).lower() for s in symptoms]

def build_feature_dict(w_doc: dict, s_doc: dict):
    # start with zeros
    base = {k: 0.0 for k in EXPECTED_FEATURES}

    # water numeric features
    ph_val = None
    if w_doc:
        ph_val = w_doc.get("pH", None) if "pH" in w_doc else w_doc.get("ph", None)
    base['ph'] = _safe_float(ph_val)
    base['turbidity'] = _safe_float(w_doc.get("turbidity", 0) if w_doc else 0)
    base['tds'] = _safe_float(w_doc.get("tds", 0) if w_doc else 0)
    base['chlorine'] = _safe_float(w_doc.get("chlorine", 0) if w_doc else 0)
    base['fluoride'] = _safe_float(w_doc.get("fluoride", 0) if w_doc else 0)
    base['nitrate'] = _safe_float(w_doc.get("nitrate", 0) if w_doc else 0)
    base['coliform'] = _safe_float(w_doc.get("coliform", 0) if w_doc else 0)
    base['temperature'] = _safe_float(w_doc.get("temperature", 0) if w_doc else 0)

    # symptom flags
    symptoms_list = _normalize_symptoms(s_doc.get("symptoms") if s_doc else [])
    base['diarrhea'] = 1.0 if any("diarrh" in s for s in symptoms_list) else 0.0
    base['vomiting'] = 1.0 if any("vomit" in s for s in symptoms_list) else 0.0
    base['fever'] = 1.0 if any("fever" in s for s in symptoms_list) else 0.0
    base['abdominal_pain'] = 1.0 if any(("abdominal pain" in s or "stomach pain" in s) for s in symptoms_list) else 0.0
    base['jaundice'] = 1.0 if any("jaundice" in s for s in symptoms_list) else 0.0
    base['dehydration'] = 1.0 if any("dehydra" in s for s in symptoms_list) else 0.0
    base['fatigue'] = 1.0 if any("fatigue" in s for s in symptoms_list) else 0.0
    base['nausea'] = 1.0 if any("nausea" in s for s in symptoms_list) else 0.0
    base['headache'] = 1.0 if any("headache" in s for s in symptoms_list) else 0.0

    # duplicate symptom_ columns
    base['symptom_diarrhea'] = base['diarrhea']
    base['symptom_vomiting'] = base['vomiting']
    base['symptom_fever'] = base['fever']
    base['symptom_abdominal_pain'] = base['abdominal_pain']
    base['symptom_jaundice'] = base['jaundice']
    base['symptom_dehydration'] = base['dehydration']
    base['symptom_fatigue'] = base['fatigue']
    base['symptom_nausea'] = base['nausea']
    base['symptom_headache'] = base['headache']

    # district one-hot (case-insensitive match)
    district = None
    if s_doc:
        district = s_doc.get("district") or s_doc.get("district_name") or s_doc.get("village_district")
    if not district and w_doc:
        district = w_doc.get("district")
    if isinstance(district, str):
        district = district.strip().lower()
    for d in DISTRICT_CATS:
        key = f"district_{d}"
        base[key] = 1.0 if district and district == d.lower() else 0.0

    # primary water source one-hot (case-insensitive)
    src = None
    if w_doc:
        src = w_doc.get("primary_water_source") or w_doc.get("water_source") or w_doc.get("primaryWaterSource")
    if isinstance(src, str):
        src = src.strip().lower()
    for s in WATER_SOURCE_CATS:
        key = f"primary_water_source_{s}"
        base[key] = 1.0 if src and src == s.lower() else 0.0

    return base

def predict_disease(w_doc: dict, s_doc: dict):
    """
    Synchronous predict function returning label and features dict.
    Call it inside run_in_executor from async code.
    """
    if _model is None:
        raise RuntimeError("Model not loaded")

    feature_dict = build_feature_dict(w_doc or {}, s_doc or {})

    # Build DataFrame with columns ordered exactly as EXPECTED_FEATURES
    df = pd.DataFrame([feature_dict], columns=EXPECTED_FEATURES)

    # Predict using pipeline (DataFrame preserves feature names; avoids warnings)
    pred = _model.predict(df)
    return {"predicted_disease": pred[0], "features": feature_dict}
