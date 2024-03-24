from flask import Flask, jsonify
from scraper import run_scraper

app = Flask(__name__)


@app.route("/")
def hello_world():
    info = run_scraper()

    return jsonify({"data": info})
