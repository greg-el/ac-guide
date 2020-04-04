from flask import render_template
from app import app
from data import get_avaliable_bugs, get_avaliable_fish

@app.route('/')
def index():
    fish = get_avaliable_fish()
    return render_template('index.html', fish=fish)

@app.route('/bugs')
def bug_data():
    bugs = get_avaliable_bugs()
    return bugs

