from flask import Flask, jsonify
import json
from scraper import run_scraper

app = Flask(__name__)


@app.route("/")
def hello_world():
    data = run_scraper()

    with open("./data.json", "w+") as file:
        json.dump(data, file)

    return jsonify({"success": True})
