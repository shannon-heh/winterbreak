import base64
import bcrypt
from flask import Flask, request, jsonify, make_response, render_template
from flask_pymongo import PyMongo
import googlemaps
from datetime import datetime

app = Flask(__name__)

# MongoDB API Key
with open('mongo.config', 'r') as f:
    app.config['MONGO_URI'] = f.read()
mongo = PyMongo(app)

# Google API Key
with open('google.config', 'r') as f:
    gmaps = googlemaps.Client(key=f.read())


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

    pet_matchups = {
        'username': profile['username'],
        'password': profile['password'],
        'ignored': {},
        'saved': {}
    }

    users.insert_one(profile)
    images.insert_one(image_profile)
    qualities.insert_one(pet_qualities)
    matchups.insert_one(pet_matchups)
    return make_response(jsonify(), 201)


# Deletes user profile into users collection.
# Returns 403 if unauthorized.
# Returns 200 if successful.
@app.route('/delete_user', methods=['POST'])
def delete_user():
    username = request.json['username']
    password = request.json['password']

    profile = users.find_one({'username': username}, {'_id': False})

    if profile is None or not bcrypt.checkpw(password.encode('utf-8'), profile['password']):
        return make_response(jsonify(), 403)

    users.delete_one({'username': username})
    images.delete_one({'username': username})
    qualities.delete_one({'username': username})
    matchups.delete_one({'username': username})

    return make_response(jsonify(), 200)


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
    image_type = request.json['image_type']  # 'pet' or 'owner'

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


# Gets next closest non-ignored non-saved match to current user.
# Returns 403 if unauthorized.
# Returns 404 if no match found (user deleted profile).
# Returns 200 if closest match found.
@ app.route('/get_match_profile', methods=['POST'])
def get_match_profile():
    username = request.json['username']
    password = request.json['password']
    match_username = request.json['match_username']

    this_user = users.find_one({'username': username}, {'_id': False})
    match_user = users.find_one({'username': match_username}, {'_id': False})

    if this_user is None or not bcrypt.checkpw(password.encode('utf-8'), this_user['password']):
        return make_response(jsonify(), 403)

    # no match found (user probably deleted profile)
    if match_user is None:
        return make_response(jsonify(), 404)

    this_user_loc = f"{this_user['owner-city']}, {this_user['owner-state']}"
    now = datetime.now()

    match_user_loc = f"{match_user['owner-city']}, {match_user['owner-state']}"
    directions_result = gmaps.directions(this_user_loc,
                                         match_user_loc,
                                         mode="driving",
                                         avoid="ferries",
                                         departure_time=now)

    match_user['duration'] = directions_result[0]['legs'][0]['duration']['text']
    match_user['distance'] = directions_result[0]['legs'][0]['distance']['text']
    del match_user['password']

    return make_response(jsonify(match_user), 200)


# Moves a match from saved to ignored, or vice versa.
# Returns 403 if unauthorized.
# Returns 200 if match status successfuly updated
@ app.route('/update_match_status', methods=['POST'])
def update_match_status():
    username = request.json['username']
    password = request.json['password']
    match_username = request.json['match_username']
    action = request.json['action']  # 'ignore' or 'save'

    pet_matchups = matchups.find_one({'username': username}, {'_id': False})

    if pet_matchups is None or not bcrypt.checkpw(password.encode('utf-8'), pet_matchups['password']):
        return make_response(jsonify(), 403)

    if action == 'ignore':
        pet_matchups['ignored'][match_username] = 0
        if match_username in pet_matchups['saved']:
            del pet_matchups['saved'][match_username]

        matchups.update_one({'username': username}, {
                            '$set': {'ignored': pet_matchups['ignored'], 'saved': pet_matchups['saved']}})

    # if action is 'save'
    else:
        pet_matchups['saved'][match_username] = 0
        if match_username in pet_matchups['ignored']:
            del pet_matchups['ignored'][match_username]

        matchups.update_one({'username': username}, {
                            '$set': {'ignored': pet_matchups['ignored'], 'saved': pet_matchups['saved']}})

    return make_response(jsonify(), 200)


# Gets next closest non-ignored non-saved match to current user.
# Returns 403 if unauthorized.
# Returns 404 if no matches found.
# Returns 200 if closest match found.
@ app.route('/get_next_match', methods=['POST'])
def get_next_match():
    username = request.json['username']
    password = request.json['password']

    this_user = users.find_one({'username': username}, {'_id': False})
    pet_matchups = matchups.find_one({'username': username}, {'_id': False})

    if pet_matchups is None or not bcrypt.checkpw(password.encode('utf-8'), pet_matchups['password']):
        return make_response(jsonify(), 403)

    ignored = pet_matchups['ignored']
    saved = pet_matchups['saved']
    all_users = list(users.find({}, {'_id': False}))

    # return 404 if no matches found
    if len(saved) == len(all_users)-1 or len(all_users) <= 1:
        return make_response(jsonify(), 404)

    # when all users have been ignored or saved, start over
    if len(ignored) + len(saved) == len(all_users)-1:
        ignored = {}
        matchups.update_one({'username': username}, {'$set': {'ignored': {}}})

    this_user_loc = f"{this_user['owner-city']}, {this_user['owner-state']}"
    now = datetime.now()

    # iterate through all users and calculate travel distance/duration from current user
    # return user profile with minimum duration
    min_duration_val = float('inf')
    min_duration_text = ""
    min_distance_text = ""
    min_match = {}
    for user in all_users:
        curr_username = user['username']

        # check that user has not been seen or is not oneself
        if curr_username in ignored or curr_username in saved or curr_username == username:
            continue

        curr_user_loc = f"{user['owner-city']}, {user['owner-state']}"
        directions_result = gmaps.directions(this_user_loc,
                                             curr_user_loc,
                                             mode="driving",
                                             avoid="ferries",
                                             departure_time=now)

        distance_text = directions_result[0]['legs'][0]['distance']['text']
        duration_val = directions_result[0]['legs'][0]['duration']['value']
        duration_text = directions_result[0]['legs'][0]['duration']['text']

        if duration_val < min_duration_val:
            min_distance_text = distance_text
            min_duration_text = duration_text
            min_match = user

    min_match['duration'] = min_duration_text
    min_match['distance'] = min_distance_text
    del min_match['password']

    return make_response(jsonify(min_match), 200)


# Run server
if __name__ == '__main__':
    app.run(debug=True)
