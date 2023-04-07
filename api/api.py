from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/river", methods = ["GET"])
def river_api():
    name = request.args.get("name")

    if name is None:
        text = "No name specified"
    else:
        text = f"River of name {name} specified!"

    return jsonify({"message" : text})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
