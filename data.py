from flask import jsonify, request
import json
import datetime
from operator import itemgetter
MONTH = datetime.datetime.today().month
DATE = datetime.datetime.today().day
hour = datetime.datetime.today().hour


def get_avaliable_fish():
    out = {}
    with open('fish.json') as f:
        fish_data = json.load(f)

    if request.cookies.get('hemisphere') == "north":
        fish = fish_data['northern']
    elif request.cookies.get('hemisphere') == "south":
        fish = fish_data['southern']
    else:
        fish = fish_data['northern']
    
    for name, data in fish.items():
        months = data['months']
        hours = data['time']
        if MONTH in months and hour in hours:
                out[name] = {'price': data['price'],'location': data['location'], 'shadow': data['shadow'], 'icon': data['icon']}

    return jsonify(out)


def get_avaliable_bugs():
    out = {}
    with open('bugs.json') as f:
        bug_data = json.load(f)

    if request.cookies.get('hemisphere') == "north":
        bugs = bug_data['northern']
    elif request.cookies.get('hemisphere') == "south":
        bugs = bug_data['southern']
    else:
        bugs = bug_data['northern']

    for name, data in bugs.items():
        months = data['months']
        hours = data['time']
        if MONTH in months and hour in hours:
            out[name] = {'price': data['price'],'location': data['location'], 'icon': data['icon']}
                
    return jsonify(out)

def get_sorted_villagers(): 
    with open('villagers-sorted.json') as f:
        villager_data = json.load(f)

    return jsonify(villager_data)
