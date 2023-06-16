# API Usage instruction

- First, read `README_CONFIG_SERVER.md`
- With the server configured and dependencies installed in a virtual environment, follow the steps below.

## Download trained models
Download the trained random forest models and put them inside the `models` folder.

## Start the API
Run `nohup python3 api.py &` to start the background Flask process.

## Call the API
- Send a GET request like `https://PUBLIC_IP:8000/river?station=1000958`
- It returns a JSON with the last 12 true values and 12 predicted values
