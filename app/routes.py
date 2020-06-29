from flask import render_template, request, Response, abort, redirect, jsonify
from ac import app
from data import *
from db import *
from ac import ac_firebase
from firebase_admin import auth
from ac import mypool


@app.route('/verify', methods=['POST', 'GET'])
def verify_token():
    id_token = request.headers.get('token')
    expires_in datetime.timedelta(weeks=2)
    try:
        session_cookie = auth.create_session_cookie(id_token, expires_in)
        response = jsonify({'status': 'success'})
        expires = datetime.datetime.now() + expires_in
        response.set_cookie(
            'session', session_cookie, expires=expires, httponly=True, secure=True
        )
        return response
    except Exception as e:
        return abort(401, 'Failed to create a session cookie')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/add')
def add_user():
    session_cookie = request.headers.get('token')
    if not session_cookie:
        return redirect('/login')
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        conn = mypool.getconn()
        add_to_db(conn, uid)
        mypool.putconn(conn)
    except auth.InvalidSessionCookieError:
        return redirect('/login')

@app.route('/get')
def get_user_data():
    session_cookie = request.headers.get('token')
    if not session_cookie:
        return redirect('/login')
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        requested_data = request.headers.get('group')
        conn = mypool.getconn()
        data = get_from_db(conn, uid, requested_data)
        mypool.putconn(conn)
        return data
    except NoSuchUidError as e:
        data = {'detail': 'The UID request does not exist in the database.'}
        return jsonify(data), 400
    except auth.InvalidSessionCookieError:
        return redirect('/login')

@app.route('/remove/<string:uid>', methods=['POST'])
def remove_user(uid):
    remove_from_db(uid)

@app.route('/update', methods=['POST', 'GET'])
def update_user_data():
    session_cookie = request.headers.get('token')
    if not session_cookie:
        return redirect('/login')
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        group = request.headers.get('group')
        item = request.headers.get('item')
        value = request.headers.get('value')
        conn = mypool.getconn()
        update_inventory(conn, uid, group, item, value)
        mypool.putconn(conn)
        return jsonify({'status': 'success'})
    except auth.InvalidSessionCookieError
        return redirect('/login')
    


@app.route('/bugs/<string:call>')
def bug_data(call):
    if call == "available":
        hour = int(request.headers.get("hour"))
        month = int(request.headers.get("month"))
        return get_available_bugs(hour=hour, month=month)
    elif call == "unavailable":
        hour = int(request.headers.get("hour"))
        month = int(request.headers.get("month"))
        return get_unavailable_bugs(hour=hour, month=month)
    elif call == "all":
        return get_all_bugs()


@app.route('/fish/<string:call>')
def fish_data(call):
    if call == "available":
        hour = int(request.headers.get("hour"))
        month = int(request.headers.get("month"))
        return get_available_fish(hour=hour, month=month)
    elif call == "unavailable":
        hour = int(request.headers.get("hour"))
        month = int(request.headers.get("month"))
        return get_unavailable_fish(hour=hour, month=month)
    elif call == "all":
        return get_all_fish()


@app.route('/villagers-sorted', methods=['POST', 'GET'])
def villager_data_n():
    n = request.headers.get("n")
    day = request.headers.get("day")
    month = request.headers.get("month")
    return get_n_sorted_villagers(int(month), int(day), int(n))

@app.route('/villagers-sorted-after/<int:n>')
def villager_data_after_n(n):
    return get_n_after_sorted_villagers(n)
