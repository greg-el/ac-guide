from flask import render_template, request, Response, abort, redirect, jsonify
from webapp.ac import app
from webapp.data import *
from webapp.db import *
from firebase_admin import auth, exceptions
from webapp.ac import mypool
import datetime


@app.route('/session', methods=['POST', 'GET'])
def get_session_cookie():
    id_token = request.headers.get('token')
    expires_in = datetime.timedelta(weeks=2)
    try:
        session_cookie = auth.create_session_cookie(id_token, expires_in)
        response = jsonify({'status': 'success'})
        expires = datetime.datetime.now() + expires_in
        response.set_cookie(
            'session', session_cookie, expires=expires, httponly=True, secure=True
        )
        return response
    except exceptions.FirebaseError:
        return abort(401, 'Failed to create a session cookie')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/logout')
def session_logout():
    response = Response(redirect('/login'))
    response.set_cookie('session', expires=0)
    return response


@app.route('/add')
def add_user():
    session_cookie = request.cookies.get('session')
    if not session_cookie:
        return redirect('/login')
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        uid = decoded_claims['user_id']
        conn = mypool.getconn()
        add_to_db(conn, uid)
        mypool.putconn(conn)
        return jsonify({"detail": "Success"}), 200
    except auth.InvalidSessionCookieError:
        return redirect('/login')


@app.route('/get')
def get_user_data():
    session_cookie = request.cookies.get('session')
    if not session_cookie:
        return redirect('/login')
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        requested_data = request.headers.get('group')
        uid = decoded_claims['user_id']
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
    session_cookie = request.cookies.get('session')
    if not session_cookie:
        return redirect('/login')
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        uid = decoded_claims['user_id']
        headers = request.headers
        group, item, value = headers.get('group'), headers.get('item'), headers.get('value')
        conn = mypool.getconn()
        if group == "chores":
            update_chores(conn, uid, item, value)
        elif group == "fish":
            update_fish(conn, uid, item, value)
        elif group == "bugs":
            update_bugs(conn, uid, item, value)
        elif group == "dive":
            update_dive(conn, uid, item, value)
        mypool.putconn(conn)
        return jsonify({'status': 'success'})
    except auth.InvalidSessionCookieError:
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
