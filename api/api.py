from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

from data_downloader import getLevel


app = Flask(__name__)
CORS(app)


def get_data(station):

    # no name specified -> error
    if station is None:
        return {"error": "invalid station"}

    # load dataset and get last 2 hours (mock)
    # df = pd.read_csv("./data/dados_plu_2023-04-12_2023-04-12.csv")

    # download dataset
    getLevel(station)

    # load dataset and get last 2 hours
    df = pd.read_csv("Level.csv")

    df_int_val = df[["intervalo", "valor_leitura_flu"]]
    df_numpy = df_int_val.iloc[-13:].to_numpy()

    # create empty list and fill it with formatted last 2 hours
    data = []
    for i, d in enumerate(df_numpy):
        data.append([":".join(d[0].split()[1].split(":")[:-1]), d[1]])

    # get current hour and minute
    h, m = data[-1][0].split(":")
    h = int(h)
    m = int(m)

    # generate next 2 hours with dummy values
    for i in range(12):
        h = h + 1 if (m := (m + 10) % 60) == 0 else h
        data.append([f"{h:02}:{m:02}", data[-1][1] + 10])

    # return dictionary
    return {
        "station": station,
        "utc": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "data": data,
    }


@app.route("/river", methods=["GET"])
def river_api():

    # get parameter
    station = request.args.get("station")
    print(station)

    # try to return a valid dictionary
    try:
        return jsonify(get_data(station))
    except Exception:
        return jsonify({"error": "unknown error"})


if __name__ == "__main__":
    # Run server on [public ip]:[non-privileged port]
    app.run(host="0.0.0.0", port=8000)
