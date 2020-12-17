
from flask import Flask, request
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


@app.route('/check_user_exists/<username>')
def check_user_exists(username):
    return '1' if users.find_one({'username': username}) != {} else '0'


'''
    Inserts user profile into users collection.
    Returns False if user profile already exists,
    Returns True if user profile successfully added.
'''


@app.route('/create_user', methods=['POST'])
def create_user():
    profile = request.json
    if check_user_exists(profile['username']):
        return False

    users.insert_one(profile)
    return True


# run server
if __name__ == '__main__':
    app.run(debug=True)
