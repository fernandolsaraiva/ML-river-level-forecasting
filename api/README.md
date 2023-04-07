# Operate API

### Opening ports

To run a public API, it is necessary to have a public IP and an accessible open port. Some ports, such as 80 and 443 require privileges to run, which is cumbersome to use with a virtual environment. The solution is to use a port that does not require high privileges, such as port 8000.

If the VPS uses an external infrastructure manager, such as Oracle VPS, login into the manager and add an **Ingress Rule** for port 8000 with the following parameters:
```
Stateless: No
Source: 0.0.0.0/0
IP Protocol: TCP
Source Port Range: All
Destination Port Range: 8000
```

After that, `ssh` into the cloud instance and run the following commands:
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo ufw allow 8000/tcp
```

To test if the system is accessible, first run:
```bash
python3 -m http.server 8000
```

And then, with your web browser, connect to:
```
[PUBLIC IP]:8000
```

You should see a listing of the directory where the server was opened.

### venv

It is convenient to have a virtual environment to isolate the packages from the project

To create a venv (virtual environment):
```bash
python3 -m venv .env
```

To enable the venv, go to `.env/bin` and run:
```bash
source activate
```

To disable the venv just type:
```bash
deactivate
```

### Dependencies

To run the API, flask is needed. With venv activated, run:

```
pip3 install -r requirements.txt
```

Or if a `requirements.txt` file is not available, run:
```bash
pip3 install flask
```

In the case a `requirements.txt` file was not available, it is a good practice to create one (venv activated and dependencies installed) with:
```bash
pip3 freeze > requirements.txt
```

### Running a Flask application

After the ports have been opened and a venv with flask is installed, be sure that the app runs on the public IP address of the machine and targets port 8000. For instance:

```python
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
```

Saving the above as `api.py`, to run it type the following in the terminal:
```bash
python3 api.py
```

Remember that you must be inside the virtual environment.

### Sending requests to the Flask application

With the application running, you can send requests normally:
```bash
curl GET "[PUBLIC IP]:8000/river?name=test_river"
```

Or type the URL in the browser:
```
[PUBLIC IP]:8000/river?name="test_river"
```
