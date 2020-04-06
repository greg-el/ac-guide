from flask import jsonify, request
import json
import datetime
month = datetime.datetime.today().month
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
        print("something went wrong with cookies")
    
    for name, data in fish.items():
        months = data['months']
        hours = data['time']
        if month in months and hour in hours:
                out[name] = {'price': data['price'],'location': data['location'], 'shadow': data['shadow'], 'icon': data['icon']}

    return jsonify(out)



def get_avaliable_bugs():
    out = {}
    with open('bugs.json') as f:
        bug_data = json.load(f)

    bugs = bug_data['northern']

    for name, data in bugs.items():
        months = data['months']
        hours = data['time']
        if month in months and hour in hours:
            out[name] = {'price': data['price'],'location': data['location']}
                
    return jsonify(out)