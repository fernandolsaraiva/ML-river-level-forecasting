import sys
import joblib
import numpy as np


def predict(last_val, estacao):
    """Run the predictor and return results"""
    last_val_arr = np.array(last_val).reshape(-1,1)
    random_forest = joblib.load(f"models/random_forest_{estacao}.joblib")
    predictions = random_forest.predict(last_val_arr)
    return predictions

    
def main():
    """Executed from the terminal"""
    predictions = predict(sys.argv[1], sys.argv[2])
    print(predictions)


if __name__ == '__main__':
    main()
