import base64
import bcrypt
from flask import Flask, request, jsonify, make_response, render_template
from flask_pymongo import PyMongo
import googlemaps
from datetime import datetime
import json

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
users = db.users
images = db.images
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
          'owner-state',
          'traits',
          'interests']


@app.route('/')
def index():
    return '<h2>Flask-MongoDB Backend Service</h2>'


# Inserts user profile into users collection.
# Returns 409 if profile already exists.
# Returns 400 if profile is missing/has extraneous attributes.
# Returns 201 if successful.
@app.route('/create_user', methods=['POST'])
def create_user():
    def validate_profile(profile):
        try:
            for field in fields[:10]:
                profile[field]
        except:
            return False

        return len(profile) == len(fields[:10])

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

    profile['traits'] = {
        'energy-level': 2.5,
        'dog-friendly': 2.5,
        'people-friendly': 2.5,
        'tendency-to-bark': 2.5
    }

    profile['interests'] = 'e.g. fetching, dog bones, play structures, grass fields, biscuits, long walks'

    image_profile = {
        'username': profile['username'],
        'pet': pet_avatar,
        'owner': owner_avatar,
    }

    pet_matchups = {
        'username': profile['username'],
        'ignored': {},
        'saved': {}
    }

    users.insert_one(profile)
    images.insert_one(image_profile)
    matchups.insert_one(pet_matchups)
    return make_response(jsonify(), 201)


# Deletes user profile into users collection.
# Returns 403 if unauthorized.
# Returns 200 if successful.
@app.route('/delete_user', methods=['POST'])
def delete_user():
    username = request.json['username']
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    users.delete_one({'username': username})
    images.delete_one({'username': username})
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
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    profile = users.find_one({'username': username}, {'_id': False})

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
    username = request.json['username']
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    image_type = request.form['image_type']  # pet or owner
    image = base64.b64encode(request.files['file'].read())

    image_profile = images.find_one({'username': username}, {'_id': False})

    image_profile[image_type] = image
    images.update_one({'username': username}, {'$set': image_profile})

    return make_response(jsonify(), 200)


# Returns either the pet or the owner picture for a specific user.
# Returns 403 if unauthorized.
# Returns 200 if successful.
@app.route('/get_picture', methods=['POST'])
def get_picture():
    username = request.json['username']
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    image_type = request.json['image_type']  # 'pet' or 'owner'

    if 'match_username' in request.json:
        username = request.json['match_username']

    image_profile = images.find_one({'username': username}, {'_id': False})

    return make_response(image_profile[image_type], 200)


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
        profile['password'] = password
        return make_response(jsonify(profile), 200)

    # user does not exist
    return make_response(jsonify(), 403)


# Gets next closest non-ignored non-saved match to current user.
# Returns 403 if unauthorized.
# Returns 404 if no match found (user deleted profile).
# Returns 200 if closest match found.
@app.route('/get_match_profile', methods=['POST'])
def get_match_profile():
    username = request.json['username']
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    match_username = request.json['match_username']

    this_user = users.find_one({'username': username}, {'_id': False})
    match_user = users.find_one({'username': match_username}, {'_id': False})

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
@app.route('/update_match_status', methods=['POST'])
def update_match_status():
    username = request.json['username']
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    match_username = request.json['match_username']
    action = request.json['action']  # 'ignore' or 'save'

    pet_matchups = matchups.find_one({'username': username}, {'_id': False})

    match_profile = users.find_one(
        {'username': match_username}, {'_id': False})

    if action == 'ignore':
        pet_matchups['ignored'][match_username] = 0

        if match_username in pet_matchups['saved']:
            del pet_matchups['saved'][match_username]

        matchups.update_one({'username': username}, {
                            '$set': {'ignored': pet_matchups['ignored'], 'saved': pet_matchups['saved']}})

    # if action is 'save'
    else:
        pet_matchups['saved'][match_username] = {
            'pet-name': match_profile['pet-name'], 'pet-breed': match_profile['pet-breed']}
        if match_username in pet_matchups['ignored']:
            del pet_matchups['ignored'][match_username]

        matchups.update_one({'username': username}, {
                            '$set': {'ignored': pet_matchups['ignored'], 'saved': pet_matchups['saved']}})

    return make_response(jsonify(), 200)


# Returns all saved matches for a given user
# Returns 403 if unauthorized.
# Returns 200 if saved matches successfully found.
@app.route('/get_saved_matches', methods=['POST'])
def get_saved_matches():
    username = request.json['username']
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    pet_matchups = matchups.find_one({'username': username}, {'_id': False})

    return make_response(jsonify(pet_matchups['saved']), 200)


# Gets next closest non-ignored non-saved match to current user.
# Returns 403 if unauthorized.
# Returns 404 if no matches found.
# Returns 200 if closest match found.
@app.route('/get_next_match', methods=['POST'])
def get_next_match():
    username = request.json['username']
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    this_user = users.find_one({'username': username}, {'_id': False})
    pet_matchups = matchups.find_one({'username': username}, {'_id': False})

    ignored = pet_matchups['ignored']
    saved = pet_matchups['saved']
    all_users = list(users.find({}, {'_id': False}))

    # return 404 if no matches found
    if len(saved) == len(all_users)-1 or len(all_users) <= 1:
        return make_response(jsonify(), 404)

    start_over = False

    # when all users have been ignored or saved, start over
    if len(ignored) + len(saved) == len(all_users)-1:
        ignored = {}
        matchups.update_one({'username': username}, {'$set': {'ignored': {}}})
        start_over = True

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
            min_duration_val = duration_val
            min_distance_text = distance_text
            min_duration_text = duration_text
            min_match['pet-name'] = user['pet-name']
            min_match['pet-breed'] = user['pet-breed']
            min_match['username'] = user['username']

    min_match['duration'] = min_duration_text
    min_match['distance'] = min_distance_text
    min_match['start_over'] = start_over

    return make_response(jsonify(min_match), 200)


# Creates formatted search terms for all users (except the current user).
# Returns 403 is unauthorized.
# Returns 200 if all search terms created.
@app.route('/get_all_pet_search_terms', methods=['POST'])
def get_all_pet_search_terms():
    username = request.json['username']
    if not is_valid_user(username, request.json['password']):
        return make_response(jsonify(), 403)

    all_users = list(users.find({}, {'_id': False}))
    formatted_terms = {user['username']: f'{user["pet-name"]} — {user["pet-breed"]} — {user["owner-city"]} — {user["owner-state"]}'
                       for user in all_users if user['username'] != username}

    return make_response(jsonify(formatted_terms), 200)


# Helper method for user authentication.
# Return True if user is valid, False otherwise.
def is_valid_user(username, password):
    profile = users.find_one({'username': username}, {'_id': False})
    return profile is not None and bcrypt.checkpw(password.encode('utf-8'), profile['password'])


# Run server
if __name__ == '__main__':
    app.run(debug=True)
