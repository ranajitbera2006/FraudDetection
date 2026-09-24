from ..DB.services import Transaction,db
from Feature_engineering import Feature_engineering
from predictor import predictor

T = Transaction(db)
X_new = Feature_engineering(T)
prediction , probability = predictor(X_new)

