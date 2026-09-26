# CardioPredict – Cardiovascular Disease Prediction System

## 📌 Overview

CardioPredict is a Machine Learning based web application that predicts the risk of cardiovascular disease using patient health information.

The project uses **React** for the frontend and **FastAPI + Python** for the backend.

## 🌐 Live Demo

**Live Application:**[(https://cardiovascular-app.vercel.app/)]

The application is deployed and available online for live testing.


## 🛠️ Technologies

* Python
* FastAPI
* React + Vite
* Scikit-learn
* Pandas
* NumPy
* JavaScript
* HTML & CSS

## 🤖 Machine Learning Model

**Logistic Regression** is used for cardiovascular disease prediction.

### Model Performance

* Accuracy: **72.34%**
* Precision: **74.54%**
* Recall: **67.98%**
* F1 Score: **71.11%**

## 📂 Project Structure

```text
CardioVascular_Project/
│
├── backend/
│   ├── main.py
│   ├── model.pkl
│   ├── scaler.pkl
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── style.css
    ├── package.json
    └── index.html
```

## 🚀 Run Project

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5000
```

Frontend:

```text
http://127.0.0.1:5000
```

## 🔗 API

### Prediction

```text
POST /predict
```

The API accepts patient health information and returns the predicted cardiovascular disease result and probability.

## ⚠️ Disclaimer

This project is developed for **academic and educational purposes only**. It is not intended to provide medical diagnosis or replace professional medical advice.
