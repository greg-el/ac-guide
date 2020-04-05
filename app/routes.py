from flask import render_template
from app import app
from data import get_avaliable_bugs, get_avaliable_fish

@app.route('/')
def index():
    fish = get_avaliable_fish()
    return render_template('index.html')

@app.route('/bugs')
def bug_data():
    return get_avaliable_bugs()

@app.route('/fish')
def fish_data():
    return get_avaliable_fish()

