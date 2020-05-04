from flask import render_template, request, Response
from ac import app
from data import *
from db import *
from ac import ac_firebase
from firebase_admin import auth



@app.route('/verify', methods=['POST', 'GET'])
def verify_token():
    try:
        id_token = request.headers.get('token')
        decoded_token = auth.verify_id_token(id_token, ac_firebase)
        uid = decoded_token['uid']
        return "200"
    except Exception as e:
        print(e)
        return "401"


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/add')
def add_user():
    uid = False
    try:
        id_token = request.headers.get('token')
        decoded_token = auth.verify_id_token(id_token, ac_firebase)
        uid = decoded_token['uid']
    except Exception as e:
        print(e)
        return "401"
    if uid:
        add_to_db(uid)
        return "200"

@app.route('/get')
def get_user_data():
    uid = False
    try:
        id_token = request.headers.get('token')
        decoded_token = auth.verify_id_token(id_token, ac_firebase)
        uid = decoded_token['uid']
    except Exception as e:
        print(e)
        return "401"
    if uid:
        try:
            data = get_from_db(uid)
            return data
        except NoSuchUidError as e:
            data = {'detail': 'The UID request does not exist in the database.'}
            return jsonify(data), 400

@app.route('/remove/<string:uid>', methods=['POST'])
def remove_user(uid):
    remove_from_db(uid)

@app.route('/update', methods=['POST', 'GET'])
def update_user_data():
    uid = False
    try:
        id_token = request.headers.get('token')
        decoded_token = auth.verify_id_token(id_token, ac_firebase)
        uid = decoded_token['uid']
    except Exception as e:
        print(e)
        return "401"
    if uid:
        species = request.headers.get('species')
        critter = request.headers.get('critter')
        value = request.headers.get('value')
        print(uid, species, critter, value)
        update_inventory(uid, species, critter, value)
        return "200"
    


@app.route('/bugs/<string:request>')
def bug_data(request):
    if request == "available":
        return get_available_bugs()
    elif request == "unavailable":
        return get_unavailable_bugs()
    elif request == "all":
        return get_all_bugs()


@app.route('/fish/<string:request>')
def fish_data(request):
    if request == "available":
        return get_available_fish()
    elif request == "unavailable":
        return get_unavailable_fish()
    elif request == "all":
        return get_all_fish()

@app.route('/villagers-sorted')
def villager_data():
    return get_sorted_villagers()

@app.route('/villagers-sorted/<int:n>')
def villager_data_n(n):
    return get_n_sorted_villagers(n)

@app.route('/villagers-sorted-after/<int:n>')
def villager_data_after_n(n):
    return get_n_after_sorted_villagers(n)
