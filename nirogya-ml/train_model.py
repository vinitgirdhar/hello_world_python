# train_model.py
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

INPUT = "./dataset/processed_dataset.csv"
OUTPUT = "./models/disease_prediction_model.joblib"

print("Loading processed dataset:", INPUT)
df = pd.read_csv(INPUT)

print("Shape:", df.shape)

# -----------------------------
# Prepare X, y
# -----------------------------
y = df["disease_label"]
X = df.drop(columns=["disease_label"])

print("X shape:", X.shape)
print("Target classes:", y.unique())

# -----------------------------
# Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -----------------------------
# Model pipeline
# -----------------------------
model = Pipeline([
    ("scaler", StandardScaler()),
    ("rf", RandomForestClassifier(
        n_estimators=500,
        max_depth=12,
        class_weight="balanced",
        random_state=42
    ))
])

# -----------------------------
# Train
# -----------------------------
print("Training...")
model.fit(X_train, y_train)

# -----------------------------
# Evaluate
# -----------------------------
acc = model.score(X_test, y_test)
print("\nTest Accuracy:", acc)

# -----------------------------
# Save
# -----------------------------
joblib.dump(model, OUTPUT)
print("Saved model to:", OUTPUT)
