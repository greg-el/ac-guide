from flask import render_template
from app import app
from data import get_avaliable_bugs, get_avaliable_fish, get_sorted_villagers, get_n_sorted_villagers, get_unavaliable_fish

@app.route('/')
def index():
    fish = get_avaliable_fish()
    return render_template('index.html')

@app.route('/bugs')
def bug_data():
    return get_avaliable_bugs()

@app.route('/fish/<string:avaliable>')
def fish_data(avaliable):
    print(avaliable)
    if avaliable == "avaliable":
        return get_avaliable_fish()
    elif avaliable == "unavaliable":
        return get_unavaliable_fish()

@app.route('/villagers-sorted')
def villager_data():
    return get_sorted_villagers()

@app.route('/villagers-sorted/<int:n>')
def villager_data_n(n):
    return get_n_sorted_villagers(n)