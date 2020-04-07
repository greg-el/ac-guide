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

def get_villagers(): #Sorts villagers into birthdays ordered by closest to current time to furthest
    month_normalisation = {}
    month_denormalisation = {}
    dict_month = MONTH-1
    for i in range(12):
        if dict_month > 11:
            dict_month = 0

        if i < 10:
            month_normalisation[dict_month] = "0"+str(i)
            month_denormalisation["0"+str(i)] = dict_month+1
        else:
            month_normalisation[dict_month] = str(i)
            month_denormalisation[str(i)] = dict_month+1
        dict_month += 1

    
    out = {}
    with open('villagers.json') as f:
        villager_data = json.load(f)

    villager_data = villager_data

    villager_list = []

    for name, data in villager_data.items():
        date = str(data['date'])
        if len(date) == 1:
            date = "0"+date
        villager_list.append([name, data['gender'], data['personality'], data['species'], month_normalisation[data['month']], date, data['catchphrase'], data['icon']])

    sorted_day = sorted(villager_list, key=itemgetter(5))
    sorted_month = sorted(sorted_day, key=itemgetter(4))

    index_to_delete = []
    index = 0
    for item in sorted_month:
        month = month_normalisation[MONTH-1]
        if len(str(month)) == 1:
            month = "0"+str(month)
        else:
            month = str(month)

        if item[4] == month and int(item[5]) < DATE :
            index_to_delete.append(index)

        index += 1

    for item in index_to_delete:
        sorted_month.append(sorted_month[item])
       
    for item in reversed(index_to_delete):
         del sorted_month[item]


    for item in sorted_month:
        out[item[0]] = {'gender': item[1], 'personality': item[2], 'month': month_denormalisation[item[4]], 'date': int(item[5]), 'catchphrase':item[6], 'icon':item[7]}


    return jsonify(out)

get_villagers()