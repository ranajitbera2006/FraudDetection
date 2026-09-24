import joblib

model = joblib.load(r"..\models\random_forest.pkl")

def predictor(X_new,model = model):
    prediction = model.predict(X_new)
    probability = model.predict_proba(X_new)

    return prediction , probability