
from flask import Flask, request, jsonify, make_response
from flask_pymongo import PyMongo

app = Flask(__name__)

with open('mongo.config', 'r') as f:
    app.config['MONGO_URI'] = f.read()
mongo = PyMongo(app)

db = mongo.db

# creates collections
users = db.users
matchups = db.matchups
goals = db.goals
tracking = db.tracking


@app.route('/')
def index():
    return '<h2>backend server</h2>'


# Returns jsonified True if username already exists in collection
@app.route('/check_user_exists/<username>', methods=['GET'])
def check_user_exists(username):
    return jsonify(users.find_one({'username': username}) != None)


# Inserts user profile into users collection.
# Returns jsonified False if user profile already exists,
# Returns jsonified True if user profile successfully added
@app.route('/create_user', methods=['POST'])
def create_user():
    profile = request.json
    if check_user_exists(profile['username']).get_json == True:
        return jsonify(False)

    users.insert_one(profile)
    return jsonify(True)

# jsonify returns Response object - to extract boolean value, use response.json


# run server
if __name__ == '__main__':
    from IPython import embed
    embed()
    app.run(debug=True)
