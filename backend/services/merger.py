# backend/services/merger.py
from datetime import datetime
from typing import Dict, Any, Optional

# Correct absolute import to the mongo client using Motor
from backend.services.mongo_client import symptom_col, water_col, prediction_col
from backend.services.predictor import predict_disease  # synchronous function - call in executor from async callers if needed

async def merge_and_predict_and_store(sym_doc: Dict[str, Any], water_doc: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Merge symptom and water docs, run prediction (via predictor.predict_disease),
    store prediction into prediction_col, and mark symptom doc as processed.

    This function is async because it performs Motor DB ops. If predictor.predict_disease
    is CPU-bound sync, callers should run it in a threadpool (you already do that in app.py).
    """
    try:
        # Build merged input (choose fields your model expects)
        merged_input = {
            "location": sym_doc.get("location") or water_doc.get("location"),
            "symptoms": sym_doc.get("symptoms"),
            "water": {
                "pH": water_doc.get("pH") or water_doc.get("ph"),
                "turbidity": water_doc.get("turbidity"),
                "tds": water_doc.get("tds"),
                "chlorine": water_doc.get("chlorine"),
                "fluoride": water_doc.get("fluoride"),
                "nitrate": water_doc.get("nitrate"),
                "coliform": water_doc.get("coliform"),
                "temperature": water_doc.get("temperature"),
                "primary_water_source": water_doc.get("primary_water_source") or water_doc.get("water_source")
            },
            "sym_doc": sym_doc,
            "water_doc": water_doc,
            "merged_at": datetime.utcnow()
        }

        # NOTE: predict_disease is synchronous and should be called from a threadpool in callers.
        # Here we assume callers already run it in executor (as in your app.py). If not, do it here.
        prediction_result = predict_disease(merged_input.get("water", {}), merged_input.get("sym_doc", {}))

        pred_doc = {
            "location": merged_input["location"],
            "timestamp": datetime.utcnow(),
            "input": merged_input,
            "prediction": prediction_result,
            "symptom_id": str(sym_doc.get("_id")),
            "water_id": str(water_doc.get("_id")) if water_doc.get("_id") else None,
        }

        await prediction_col.insert_one(pred_doc)

        # mark symptom processed
        await symptom_col.update_one({"_id": sym_doc.get("_id")}, {"$set": {"processed_by_model": True, "processed_at": datetime.utcnow()}})

        return prediction_result
    except Exception as e:
        # keep error handling simple — in production, log properly
        print("merge_and_predict_and_store error:", e)
        return None
