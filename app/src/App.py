
import bcrypt
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


fields = ['username', 'password', 'pet_name', 'pet_bday', 'pet_breed',
          'pet_weight', 'owner_name', 'owner_email', 'owner_city', 'owner_state']


# Inserts user profile into users collection.
# Returns 409 if profile already exists.
# Returns 400 if profile is missing/has extraneous attributes.
# Returns 201 if successful.
@app.route('/create_user', methods=['POST'])
def create_user():
    def validate_profile(profile):
        try:
            for field in fields:
                profile[field]
        except:
            return False

        return len(profile) == len(fields)

    profile = request.json
    print(profile)
    if not validate_profile(profile):
        return make_response(jsonify(), 400)

    profile['password'] = bcrypt.hashpw(
        profile['password'].encode('utf-8'), bcrypt.gensalt())

    if users.find_one({'username': profile['username']}) != None:
        return make_response(jsonify(), 409)

    users.insert_one(profile)
    return make_response(jsonify(), 201)


# Checks if user exists in users collection.
# Returns 404 if username not found.
# Returns 200 if username is found.
@app.route('/check_user', methods=['POST'])
def check_user():
    username = request.json['username']
    res = users.find_one({'username': username}, {'_id': False})
    if(res == None):
        return make_response(jsonify(), 404)

    return make_response(jsonify(), 200)


# Authenticates username and password
# Returns 200 and user's profile data if authentication is successful
# Returns 403 is authentication is unsuccessful
@app.route('/auth', methods=['POST'])
def auth():
    username = request.json['username']
    password = request.json['password']

    profile = users.find_one({'username': username}, {'_id': False})

    if profile is not None and bcrypt.checkpw(password.encode('utf-8'), profile['password']):
        # user exists
        del profile['password']
        return make_response(jsonify(profile), 200)

    # user does not exist
    return make_response(jsonify(), 403)


# run server
if __name__ == '__main__':
    # from IPython import embed
    # embed()
    app.run(debug=True)
