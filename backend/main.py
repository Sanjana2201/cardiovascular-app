# python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload  [for backend]
# npm run dev [for frontend]

import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

app = FastAPI(
    title="CardioCare AI - Cardiovascular Disease Prediction API",
    description="Machine Learning API for Cardiovascular Disease Risk Assessment",
    version="2.0.0"
)

# Enable CORS for React frontend (supports default Vite port 5173 and all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve paths for model and scaler
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

# Load model and scaler lazily with error handling
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("[SUCCESS] Model and Scaler loaded successfully!")
except Exception as e:
    model = None
    scaler = None
    print(f"[ERROR] Error loading model or scaler: {e}")


class CardioInput(BaseModel):
    age: float = Field(..., ge=1, le=120, description="Age in years (e.g., 50)")
    gender: int = Field(..., ge=1, le=2, description="Gender: 1 = Female, 2 = Male")
    height: float = Field(..., ge=100, le=250, description="Height in cm (e.g., 165)")
    weight: float = Field(..., ge=30, le=250, description="Weight in kg (e.g., 70)")
    ap_hi: int = Field(..., ge=60, le=240, description="Systolic Blood Pressure (mmHg)")
    ap_lo: int = Field(..., ge=40, le=160, description="Diastolic Blood Pressure (mmHg)")
    cholesterol: int = Field(..., ge=1, le=3, description="Cholesterol level: 1=Normal, 2=Above Normal, 3=Well Above Normal")
    gluc: int = Field(..., ge=1, le=3, description="Glucose level: 1=Normal, 2=Above Normal, 3=Well Above Normal")
    smoke: int = Field(..., ge=0, le=1, description="Smoking status: 0=No, 1=Yes")
    alco: int = Field(..., ge=0, le=1, description="Alcohol consumption: 0=No, 1=Yes")
    active: int = Field(..., ge=0, le=1, description="Physical activity: 0=No, 1=Yes")


def analyze_health_metrics(data: CardioInput, prob: float):
    # Calculate BMI
    height_m = data.height / 100.0
    bmi = round(data.weight / (height_m ** 2), 1)
    
    if bmi < 18.5:
        bmi_cat = "Underweight"
    elif bmi < 25.0:
        bmi_cat = "Normal Weight"
    elif bmi < 30.0:
        bmi_cat = "Overweight"
    else:
        bmi_cat = "Obesity"

    # Blood Pressure Category
    if data.ap_hi < 120 and data.ap_lo < 80:
        bp_cat = "Normal"
    elif 120 <= data.ap_hi <= 129 and data.ap_lo < 80:
        bp_cat = "Elevated"
    elif (130 <= data.ap_hi <= 139) or (80 <= data.ap_lo <= 89):
        bp_cat = "Hypertension Stage 1"
    elif data.ap_hi >= 140 or data.ap_lo >= 90:
        bp_cat = "Hypertension Stage 2"
    else:
        bp_cat = "High Risk"

    # Risk Level Categorization
    if prob < 0.25:
        risk_level = "Low Risk"
        risk_color = "#10B981" # Green
        badge_type = "success"
    elif prob < 0.50:
        risk_level = "Moderate Risk"
        risk_color = "#F59E0B" # Yellow/Amber
        badge_type = "warning"
    elif prob < 0.75:
        risk_level = "High Risk"
        risk_color = "#F97316" # Orange
        badge_type = "danger"
    else:
        risk_level = "Very High Risk"
        risk_color = "#EF4444" # Red
        badge_type = "critical"

    # Identify Key Risk Factors & Recommendations
    risk_factors = []
    recommendations = []

    if data.ap_hi >= 130 or data.ap_lo >= 85:
        risk_factors.append({
            "factor": "Elevated Blood Pressure",
            "detail": f"BP is {data.ap_hi}/{data.ap_lo} mmHg ({bp_cat}).",
            "impact": "High"
        })
        recommendations.append("Monitor blood pressure regularly and limit sodium intake (< 2,300 mg/day).")

    if data.cholesterol > 1:
        chol_desc = "Above Normal" if data.cholesterol == 2 else "Well Above Normal"
        risk_factors.append({
            "factor": "High Cholesterol",
            "detail": f"Cholesterol level is {chol_desc}.",
            "impact": "High" if data.cholesterol == 3 else "Medium"
        })
        recommendations.append("Adopt a heart-healthy diet rich in soluble fiber, fruits, and unsaturated fats.")

    if data.gluc > 1:
        gluc_desc = "Above Normal" if data.gluc == 2 else "Well Above Normal"
        risk_factors.append({
            "factor": "Elevated Blood Glucose",
            "detail": f"Glucose level is {gluc_desc}.",
            "impact": "High" if data.gluc == 3 else "Medium"
        })
        recommendations.append("Consult a physician for a fasting blood sugar test and manage refined carbs.")

    if bmi >= 25.0:
        risk_factors.append({
            "factor": "Overweight / Obesity",
            "detail": f"BMI is {bmi} kg/m² ({bmi_cat}).",
            "impact": "High" if bmi >= 30 else "Medium"
        })
        recommendations.append("Aim for a gradual weight reduction of 5-10% through diet and daily movement.")

    if data.smoke == 1:
        risk_factors.append({
            "factor": "Tobacco Smoking",
            "detail": "Active smoking directly damages blood vessel linings and accelerates plaque buildup.",
            "impact": "High"
        })
        recommendations.append("Seek smoking cessation support programs or nicotine replacement therapy.")

    if data.alco == 1:
        risk_factors.append({
            "factor": "Alcohol Consumption",
            "detail": "Regular alcohol consumption can raise blood pressure and contribute to heart strain.",
            "impact": "Medium"
        })
        recommendations.append("Limit alcohol intake or abstain to maintain optimal cardiovascular health.")

    if data.active == 0:
        risk_factors.append({
            "factor": "Physical Inactivity",
            "detail": "Lack of regular exercise increases risk of arterial stiffness and metabolic decline.",
            "impact": "Medium"
        })
        recommendations.append("Incorporate at least 150 minutes of moderate aerobic exercise (brisk walking) per week.")

    if data.age >= 55:
        risk_factors.append({
            "factor": "Age Factor",
            "detail": f"Age is {int(data.age)} years. Natural vessel elasticity decreases with age.",
            "impact": "Low"
        })

    if not recommendations:
        recommendations.append("Maintain your excellent healthy lifestyle, balanced nutrition, and regular annual checkups!")

    return {
        "bmi": bmi,
        "bmi_category": bmi_cat,
        "bp_category": bp_cat,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "badge_type": badge_type,
        "risk_factors": risk_factors,
        "recommendations": recommendations
    }


@app.get("/")
def home():
    return {
        "status": "online",
        "title": "CardioCare AI Backend API",
        "description": "API for Cardiovascular Disease Prediction powered by Scikit-Learn Logistic Regression model.",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)",
            "sample": "/sample (GET)"
        }
    }


@app.get("/health")
def health():
    if model is None or scaler is None:
        return {
            "status": "error",
            "message": "Model or scaler file missing!",
            "model_loaded": False
        }
    return {
        "status": "healthy",
        "message": "FastAPI service is running and ML model is ready for inference.",
        "model_loaded": True
    }


@app.get("/sample")
def get_sample_patients():
    return {
        "healthy_sample": {
            "age": 35,
            "gender": 1,
            "height": 165,
            "weight": 60.0,
            "ap_hi": 115,
            "ap_lo": 75,
            "cholesterol": 1,
            "gluc": 1,
            "smoke": 0,
            "alco": 0,
            "active": 1
        },
        "at_risk_sample": {
            "age": 58,
            "gender": 2,
            "height": 175,
            "weight": 92.0,
            "ap_hi": 155,
            "ap_lo": 98,
            "cholesterol": 3,
            "gluc": 2,
            "smoke": 1,
            "alco": 1,
            "active": 0
        }
    }


@app.post("/predict")
def predict(data: CardioInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="ML Model or Scaler is not initialized.")

    try:
        # Age conversion: years to days as expected by trained scaler & model
        age_days = data.age * 365.25

        # Create DataFrame matching scaler's feature structure
        input_df = pd.DataFrame([{
            "id": 0,
            "age": age_days,
            "gender": data.gender,
            "height": data.height,
            "weight": data.weight,
            "ap_hi": data.ap_hi,
            "ap_lo": data.ap_lo,
            "cholesterol": data.cholesterol,
            "gluc": data.gluc,
            "smoke": data.smoke,
            "alco": data.alco,
            "active": data.active
        }])

        # Standard scale input features
        scaled_features = scaler.transform(input_df)

        # Run Logistic Regression model
        prediction_val = int(model.predict(scaled_features)[0])
        probability_val = float(model.predict_proba(scaled_features)[0][1])

        # Analyze patient metrics & generate insights
        analysis = analyze_health_metrics(data, probability_val)

        return {
            "prediction": prediction_val,
            "has_disease": bool(prediction_val == 1),
            "result_title": "Cardiovascular Disease Detected" if prediction_val == 1 else "No Cardiovascular Disease Detected",
            "probability_percent": round(probability_val * 100, 2),
            "probability_raw": round(probability_val, 4),
            "risk_level": analysis["risk_level"],
            "risk_color": analysis["risk_color"],
            "badge_type": analysis["badge_type"],
            "bmi": analysis["bmi"],
            "bmi_category": analysis["bmi_category"],
            "bp_category": analysis["bp_category"],
            "risk_factors": analysis["risk_factors"],
            "recommendations": analysis["recommendations"],
            "patient_summary": {
                "age": data.age,
                "gender": "Female" if data.gender == 1 else "Male",
                "blood_pressure": f"{data.ap_hi}/{data.ap_lo} mmHg",
                "cholesterol": "Normal" if data.cholesterol == 1 else ("Above Normal" if data.cholesterol == 2 else "Well Above Normal"),
                "glucose": "Normal" if data.gluc == 1 else ("Above Normal" if data.gluc == 2 else "Well Above Normal"),
                "smoker": "Yes" if data.smoke == 1 else "No",
                "alcohol": "Yes" if data.alco == 1 else "No",
                "physically_active": "Yes" if data.active == 1 else "No"
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
