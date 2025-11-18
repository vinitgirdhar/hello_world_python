# diagnose_model.py
import joblib, pprint, os
MODEL_PATH = os.getenv("MODEL_PATH", "backend/models/disease_prediction_model.joblib")
print("Using MODEL_PATH:", MODEL_PATH)
m = joblib.load(MODEL_PATH)
print("Model type:", type(m))

try:
    from sklearn.pipeline import Pipeline
    if isinstance(m, Pipeline):
        print("Pipeline steps:", list(m.named_steps.keys()))
except Exception:
    pass

for attr in ("n_features_in_", "feature_names_in_", "get_feature_names_out"):
    if hasattr(m, attr):
        print(f"{attr}:", getattr(m, attr))

try:
    if hasattr(m, "named_steps"):
        for name, step in m.named_steps.items():
            print("Step:", name, type(step))
            if hasattr(step, "n_features_in_"):
                print(" ", name, "n_features_in_:", step.n_features_in_)
            if hasattr(step, "feature_names_in_"):
                print(" ", name, "feature_names_in_:", getattr(step, "feature_names_in_"))
except Exception as e:
    print("Inner inspect error:", e)

if hasattr(m, "feature_names_in_"):
    fn = getattr(m, "feature_names_in_")
    try:
        print("len(feature_names_in_) =", len(fn))
        pprint.pprint(fn)
    except Exception:
        print(fn)
