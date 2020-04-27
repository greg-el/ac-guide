from flask import render_template, request
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
        return('', )
    except Exception as e:
        print(e)
        return "failure"


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/add/<string:uid>')
def add_user(uid):
    add_to_db(uid)
    return('', 204)

@app.route('/get/<string:uid>')
def get_user_data(uid):
    return get_from_db(uid)

@app.route('/remove/<string:uid>', methods=['POST'])
def remove_user(uid):
    remove_from_db(uid)

@app.route('/update/<string:uid>/<string:pocket>/<string:value>', methods=['POST'])
def update_user_data(uid, pocket):
    update_inventory(uid, pocket, value)


@app.route('/bugs/<string:request>')
def bug_data(request):
    if request == "avaliable":
        return get_avaliable_bugs()
    elif request == "unavaliable":
        return get_unavaliable_bugs()
    elif request == "all":
        return get_all_bugs()


@app.route('/fish/<string:request>')
def fish_data(request):
    if request == "avaliable":
        return get_avaliable_fish()
    elif request == "unavaliable":
        return get_unavaliable_fish()
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
