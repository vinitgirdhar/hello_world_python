# preprocess.py
import pandas as pd
import json
import os

INPUT_PATH = "./dataset/nirogya_1000_household_dataset.csv"
OUTPUT_PATH = "./dataset/processed_dataset.csv"

print("Loading:", INPUT_PATH)
df = pd.read_csv(INPUT_PATH)

print("Initial shape:", df.shape)
print("Columns:", df.columns.tolist())

# -----------------------------
# 1. Convert symptoms_list (string) → list
# -----------------------------
def safe_load(x):
    try:
        return json.loads(x)
    except:
        return []

df["symptoms_list"] = df["symptoms_list"].apply(safe_load)

# -----------------------------
# 2. Create symptom flags
# -----------------------------
symptoms = [
    "diarrhea", "vomiting", "fever", "abdominal_pain",
    "jaundice", "dehydration", "fatigue", "nausea", "headache"
]

for s in symptoms:
    df[f"symptom_{s}"] = df["symptoms_list"].apply(lambda lst: 1 if s.replace("_", " ") in [x.lower() for x in lst] else 0)

# -----------------------------
# 3. Encode categorical
# -----------------------------
df = pd.get_dummies(df, columns=["district", "primary_water_source"], drop_first=True)

# -----------------------------
# 4. Remove unused text columns
# -----------------------------
df.drop(columns=["household_id", "location", "symptoms_list"], inplace=True)

print("Processed shape:", df.shape)
print("Saving to:", OUTPUT_PATH)

df.to_csv(OUTPUT_PATH, index=False)
