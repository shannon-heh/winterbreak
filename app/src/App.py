import base64
import bcrypt
from flask import Flask, request, jsonify, make_response, render_template
from flask_pymongo import PyMongo

app = Flask(__name__)

with open('mongo.config', 'r') as f:
    app.config['MONGO_URI'] = f.read()
mongo = PyMongo(app)

db = mongo.db

# creates collections
users = db.users  # user profile
images = db.images  # profile pics
qualities = db.qualities  # pet traits & interests
matchups = db.matchups
goals = db.goals
tracking = db.tracking

# user profile attributes
fields = ['username',
          'password',
          'pet-name',
          'pet-bday',
          'pet-breed',
          'pet-weight',
          'owner-name',
          'owner-email',
          'owner-city',
          'owner-state']


@app.route('/')
def index():
    return '<h1>Flask-MongoDB Backend Service</h1>'


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
    if not validate_profile(profile):
        return make_response(jsonify(), 400)

    profile['password'] = bcrypt.hashpw(
        profile['password'].encode('utf-8'), bcrypt.gensalt())

    if users.find_one({'username': profile['username']}) != None:
        return make_response(jsonify(), 409)

    with open("images/pet_default.png", "rb") as f:
        pet_avatar = base64.b64encode(f.read())

    with open("images/owner_default.png", "rb") as f:
        owner_avatar = base64.b64encode(f.read())

    image_profile = {
        'username': profile['username'],
        'password': profile['password'],
        'pet': pet_avatar,
        'owner': owner_avatar,
    }

    pet_qualities = {
        'username': profile['username'],
        'password': profile['password'],
        'traits': {
            'energy-level': 2.5,
            'dog-friendly': 2.5,
            'people-friendly': 2.5,
            'tendency-to-bark': 2.5
        },
        'interests': 'e.g. fetching, dog bones, play structures, grass fields, biscuits, long walks'
    }

    users.insert_one(profile)
    images.insert_one(image_profile)
    qualities.insert_one(pet_qualities)
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


# Updates specific user profile attributes.
# Returns 403 if unauthorized.
# Return 200 if successful.
@app.route('/update_profile', methods=['POST'])
def update_profile():
    username = request.json['username']
    password = request.json['password']

    profile = users.find_one({'username': username}, {'_id': False})

    if profile is None or not bcrypt.checkpw(password.encode('utf-8'), profile['password']):
        return make_response(jsonify(), 403)

    for field in request.json.keys():
        if field not in fields:
            continue
        profile[field] = request.json[field]

    del profile['username']
    del profile['password']

    users.update_one({'username': username}, {'$set': profile})

    return make_response(jsonify(profile), 200)


# Updates either the pet or the owner picture for a specific user.
# Returns 403 if unauthorized.
# Returns 200 if successful.
@app.route('/update_picture', methods=['POST'])
def update_picture():
    username = request.form['username']
    password = request.form['password']
    image_type = request.form['image_type']  # pet or owner
    image = base64.b64encode(request.files['file'].read())

    image_profile = images.find_one({'username': username}, {'_id': False})

    if image_profile is None or not bcrypt.checkpw(password.encode('utf-8'), image_profile['password']):
        return make_response(jsonify(), 403)

    image_profile[image_type] = image

    images.update_one({'username': username}, {'$set': image_profile})

    return make_response(jsonify(), 200)


# Returns either the pet or the owner picture for a specific user.
# Returns 403 if unauthorized.
# Returns 200 if successful.
@app.route('/get_picture', methods=['POST'])
def get_picture():
    username = request.json['username']
    password = request.json['password']
    image_type = request.json['image_type']  # pet or owner

    image_profile = images.find_one({'username': username}, {'_id': False})

    if image_profile is None or not bcrypt.checkpw(password.encode('utf-8'), image_profile['password']):
        return make_response(jsonify(), 403)

    return make_response(image_profile[image_type], 200)


# Updates either pet traits or pet interests.
# Returns 403 if unauthorized.
# Returns 200 if successful.
@app.route('/update_qualities', methods=['POST'])
def update_qualities():
    username = request.json['username']
    password = request.json['password']
    traits = request.json['traits']
    interests = request.json['interests']

    pet_qualities = qualities.find_one({'username': username}, {'_id': False})

    if pet_qualities is None or not bcrypt.checkpw(password.encode('utf-8'), pet_qualities['password']):
        return make_response(jsonify(), 403)

    pet_qualities['traits'] = traits
    pet_qualities['interests'] = interests

    # print(pet_qualities[traits_or_interests])
    # print(pet_qualities)

    qualities.update_one({'username': username}, {'$set': pet_qualities})

    return make_response(jsonify(), 200)


# Returns all pet qualities (traits and interests).
# Returns 403 if unauthorized.
# Returns 200 if successful.
@ app.route('/get_qualities', methods=['POST'])
def get_qualities():
    username = request.json['username']
    password = request.json['password']

    pet_qualities = qualities.find_one({'username': username}, {'_id': False})

    if pet_qualities is None or not bcrypt.checkpw(password.encode('utf-8'), pet_qualities['password']):
        return make_response(jsonify(), 403)

    del pet_qualities['username']
    del pet_qualities['password']

    return make_response(pet_qualities, 200)


# Authenticates username and password
# Returns 200 and user's profile data if authentication is successful
# Returns 403 is authentication is unsuccessful
@ app.route('/auth', methods=['POST'])
def auth():
    username = request.json['username']
    password = request.json['password']

    profile = users.find_one({'username': username}, {'_id': False})

    if profile is not None and bcrypt.checkpw(password.encode('utf-8'), profile['password']):
        # user exists
        profile['password'] = password
        return make_response(jsonify(profile), 200)

    # user does not exist
    return make_response(jsonify(), 403)


# Run server
if __name__ == '__main__':
    app.run(debug=True)
