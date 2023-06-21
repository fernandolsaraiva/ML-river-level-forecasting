import sys
import joblib
import numpy as np


def predict(last_level, station):
    """Run the predictor and return results"""

    last_level_arr = np.array(last_level).reshape(-1,1)
    random_forest = joblib.load(f"models/random_forest_{station}.joblib")
    predictions = random_forest.predict(last_level_arr)
    return predictions

    
def main():
    """Executed from the terminal"""

    predictions = predict(sys.argv[1], sys.argv[2])
    print(predictions)


if __name__ == '__main__':
    main()
