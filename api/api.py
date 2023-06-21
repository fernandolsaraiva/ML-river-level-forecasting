import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask import send_file
from flask_cors import CORS
import pandas as pd

from data_downloader import get_level
from predictor import predict


app = Flask(__name__)
CORS(app)


def get_data(station):
    """Actual code to get the level"""

    # no name specified -> error
    if station is None:
        return {"error": "invalid station"}

    # download dataset
    unixtime = get_level(station)

    # load dataset and get last 2 hours
    df = pd.read_csv(f"Level_{unixtime}.csv")

    df_int_val = df[["intervalo", "valor_leitura_flu"]]
    df_numpy = df_int_val.iloc[-13:].to_numpy()

    # create empty list and fill it with formatted last 2 hours
    data = []
    for i, d in enumerate(df_numpy):
        data.append([":".join(d[0].split()[1].split(":")[:-1]), d[1]])

    # predict next values based on last true value
    predicted = predict(data[-1][1], station)[0]

    # get current hour and minute
    h, m = data[-1][0].split(":")
    h = int(h)
    m = int(m)

    # Add predicted next 2 hours to the dataset
    for i in range(12):
        h = h + 1 if (m := (m + 10) % 60) == 0 else h
        data.append([f"{h:02}:{m:02}", predicted[i]])

    # remove csv file
    os.remove(f"Level_{unixtime}.csv")

    # return dictionary
    return {
        "station": station,
        "utc": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "data": data,
    }


@app.route("/river", methods=["GET"])
def river_api():
    """Get level predictions for a river"""

    # get parameter
    station = request.args.get("station")

    # try to return a valid dictionary
    try:
        return jsonify(get_data(station))
    except Exception:
        return jsonify({"error": "unknown error"})


@app.route("/model", methods=["GET"])
def download_model():
    """Send the requested model file to the user"""

    # get parameter
    station = request.args.get("station")

    # get model path
    p = os.path.join(app.root_path, f"models/random_forest_{station}.joblib")

    # send model to the user
    return send_file(p, as_attachment=True)


if __name__ == "__main__":
    # Run server on [public ip]:[non-privileged port]
    app.run(host="0.0.0.0", port=8000)