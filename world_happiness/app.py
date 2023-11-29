from flask import Flask, jsonify, render_template
from flask_pymongo import PyMongo
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb://localhost:27017/world_happiness_db"
mongo = PyMongo(app)
#####################################################################
# API ROUTES
#####################################################################
@app.route('/api/whr', methods=['GET'])
def whr():
    whr_data = list(mongo.db.whr.find())
    # Convert ObjectId to string representation
    for data in whr_data:
        data['_id'] = str(data['_id'])
    return jsonify(whr_data)
#####################################################################
# HTML ROUTES
#####################################################################
@app.route("/")
def home_page():
    return render_template("index.html")
if __name__ == '__main__':
    app.run(port=5000)