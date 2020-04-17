from flask import render_template
from app import app
from data import *

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

#@app.route('/login/add/<string:uid>', methods=['POST'])
#def add_user():



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
