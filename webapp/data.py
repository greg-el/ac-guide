from flask import jsonify, request
import json
from operator import itemgetter


def get_all_fish():
    fish = None
    with open('./webapp/data/fish.json') as f:
        fish_data = json.load(f)
    if request.cookies.get('hemisphere') == "north":
        fish = fish_data['northern']
    elif request.cookies.get('hemisphere') == "south":
        fish = fish_data['southern']
    return fish


def get_available_fish(hour, month):
    out = {}
    with open('./webapp/data/fish.json') as f:
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
        if month in months and hour in hours: 
            out[name] = {
                'name_formatted': data['name_formatted'],
                'price': data['price'],
                'location': data['location'],
                'shadow': data['shadow'],
                'time': data['time']
                }

    return jsonify(out)


def get_unavailable_fish(hour, month):
    out = {}
    with open('./webapp/data/fish.json') as f:
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
        if month not in months or hour not in hours:
            out[name] = {
                'price': data['price'],
                'location': data['location'],
                'shadow': data['shadow'],
                'icon': data['icon'],
                'time': data['time']
            }

    return jsonify(out)


def get_all_bugs():
    bug = None
    with open('./webapp/data/bugs.json') as f:
        bug_data = json.load(f)
    if request.cookies.get('hemisphere') == "north":
        bug = bug_data['northern']
    elif request.cookies.get('hemisphere') == "south":
        bug = bug_data['southern']
    return bug


def get_available_bugs(hour, month):
    out = {}
    with open('./webapp/data/bugs.json') as f:
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
        if month in months and hour in hours:
            out[name] = {
                'price': data['price'],
                'location': data['location']
             }
                
    return jsonify(out)


def get_unavailable_bugs(hour, month):
    out = {}
    with open('./webapp/data/bugs.json') as f:
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
        if month not in months or hour not in hours:
            out[name] = {
                'price': data['price'],
                'location': data['location'],
                'icon': data['icon']
            }
                
    return jsonify(out)


def sorted_villager_gen(month, date):  # Sorts villagers into birthdays ordered by closest to current time to furthest
    month_name = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }

    MONTH = month


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
    with open('./webapp/data/villagers.json') as f:
        villager_data = json.load(f)

    villager_list = []

    for name, data in villager_data.items():
        date = str(data['date'])
        if len(date) == 1:
            date = "0"+date
        villager_list.append([
            name,
            data['gender'],
            data['personality'],
            data['species'],
            month_normalisation[data['month']],
            date,
            data['catchphrase'],
            data['icon']
        ])

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

        if item[4] == month and int(item[5]) < date :
            index_to_delete.append(index)

        index += 1

    for item in index_to_delete:
        sorted_month.append(sorted_month[item])
       
    for item in reversed(index_to_delete):
        del sorted_month[item]

    count = 0
    for item in sorted_month:
        out[count] = {'name': item[0],
                      'gender': item[1],
                      'personality': item[2],
                      'species': item[3],
                      'month': month_name[month_denormalisation[item[4]]],
                      'date': int(item[5]),
                      'catchphrase': item[6],
                      'icon': item[7]}
        count += 1

    return jsonify(out)


def get_n_sorted_villagers(month, date, n):
    month_name = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }

    MONTH = month

    month_normalisation = {}
    month_denormalisation = {}
    dict_month = month-1
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
    with open('./webapp/data/villagers.json') as f:
        villager_data = json.load(f)

    villager_list = []

    for name, data in villager_data.items():
        date = str(data['date'])
        if len(date) == 1:
            date = "0"+date
        villager_list.append([name, data['name_formatted'], data['gender'], data['personality'], data['species'], month_normalisation[data['month']], date, data['catchphrase']])

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

        if item[4] == month and int(item[5]) < date :
            index_to_delete.append(index)

        index += 1

    for item in index_to_delete:
        sorted_month.append(sorted_month[item])
       
    for item in reversed(index_to_delete):
        del sorted_month[item]

    count = 0
    for item in sorted_month:
        out[count] = {
            'name': item[0],
            'name_formatted': item[1],
            'gender': item[2],
            'personality': item[3],
            'species': item[4],
            'month': month_name[month_denormalisation[item[5]]],
            'date': int(item[6]),
            'catchphrase': item[7]}

        count += 1

    output = {}
    if n == 0:
        n = len(villager_data)
    for i in range(n):
        data = out[i]
        output[i] = data

    return jsonify(output)


def get_n_after_sorted_villagers(n):
    out = {}
    with open('./webapp/data/villagers-sorted.json') as f:
        villager_data = json.load(f)

    for i in range(n, len(villager_data)):
        data = villager_data[str(i)]
        out[i] = data

    return jsonify(out)



