from bs4 import BeautifulSoup
import requests
import re
import calendar
import json
import urllib
import datetime
from operator import itemgetter

def get_fish_data(url, out):
    soup = BeautifulSoup(open(url), 'html.parser')
    test = soup.find_all("tr")
    for item in test:
        temp_dict = {}
        td = item.find_all("td")

        temp_dict['name_formatted'] = td[0].text.strip()
        name = re.sub("[\'\s-]", '', td[0].text.strip()).lower()
        temp_dict['price'] = td[2].text.strip()

        location_split = td[3].text.strip().split(")")
        if len(location_split) == 1:
            temp_dict['location'] = location_split[0].strip()
        if len(location_split) == 2:
            if location_split[1] == "":
                temp_dict['location'] = location_split[0].strip() + ")"
            else:
                temp_dict['location'] = location_split[0].strip() + ")"
                temp_dict['locationAlt'] = location_split[1].strip()



        temp_dict['shadow'] = td[4].text.strip()

        if td[5].text.strip() == "All day":
            temp_dict['time'] = [i for i in range(24)]
        else:
            time = re.sub(" ", "", td[5].text)
            if "&" in time:
                periods = time.split("&")
                regex = re.compile("(\d)(\w\w)-(\d)(\w\w)")
                time_list = []
                for item in periods:
                    span = regex.match(item)
                    start = int(span.group(1))
                    end = int(span.group(3))

                    if span.group(2) == "PM":
                        start = int(span.group(1)) + 12
                    if span.group(4) == "PM":
                        end = int(span.group(3)) + 12

                    if start > end:
                        time_list = time_list + [x for x in range(start, 24)]
                        time_list = time_list + [x for x in range(0, end)]
                    else:
                        time_list = time_list + [x for x in range(start, end)]

                temp_dict['time'] = time_list
            else:
                time = re.sub(" ", "", td[5].text)
                regex = re.compile("(\d)(\w\w)-(\d)(\w\w)")
                span = regex.match(time)
                time_list = []
                start = int(span.group(1))
                end = int(span.group(3))

                if span.group(2) == "PM":
                    start = int(span.group(1)) + 12
                if span.group(4) == "PM":
                    end = int(span.group(3)) + 12

                if start > end:
                    time_list = time_list + [x for x in range(start, 24)]
                    time_list = time_list + [x for x in range(0, end)]
                else:
                    time_list = time_list + [x for x in range(start, end)]

                temp_dict['time'] = time_list

        months = []
        for i in range(6, 18):
            if td[i].text.strip() != "-":
                months.append(i-6)

        temp_dict['months'] = months

        temp_dict['icon'] = "./static/image/fish/" + name + ".webp"

        if url == "./fish-north":
            out['northern'][name] = temp_dict
        else:
            out['southern'][name] = temp_dict

    return out


def get_bug_data(url, out):
    soup = BeautifulSoup(open(url), 'html.parser')
    test = soup.find_all("tr")
    for item in test:
        temp_dict = {}
        td = item.find_all("td")

        temp_dict['name_formatted'] = td[0].text.strip()
        name = re.sub("[\'\s-]", '', td[0].text.strip()).lower()
        temp_dict['price'] = td[2].text.strip()
        temp_dict['location'] = td[3].text.strip()

        if td[4].text.strip() == "All day":
            temp_dict['time'] = [i for i in range(24)]
        else:
            time = re.sub(" ", "", td[4].text)
            if "&" in time:
                periods = time.split("&")
                regex = re.compile("(\d)(\w\w)-(\d)(\w\w)")
                time_list = []
                for item in periods:
                    span = regex.match(item)
                    start = int(span.group(1))
                    end = int(span.group(3))

                    if span.group(2) == "PM":
                        start = int(span.group(1)) + 12
                    if span.group(4) == "PM":
                        end = int(span.group(3)) + 12

                    if start > end:
                        time_list = time_list + [x for x in range(start, 24)]
                        time_list = time_list + [x for x in range(0, end)]
                    else:
                        time_list = time_list + [x for x in range(start, end)]

                temp_dict['time'] = time_list
            else:
                time = re.sub(" ", "", td[4].text)
                regex = re.compile("(\d+)(\w\w)-(\d+)(\w\w)")
                span = regex.match(time)
                time_list = []
                start = int(span.group(1))
                end = int(span.group(3))

                if span.group(2) == "PM":
                    start = int(span.group(1)) + 12
                if span.group(4) == "PM":
                    end = int(span.group(3)) + 12

                if start > end:
                    time_list = time_list + [x for x in range(start, 24)]
                    time_list = time_list + [x for x in range(0, end)]
                else:
                    time_list = time_list + [x for x in range(start, end)]

                temp_dict['time'] = time_list

        months = []
        for i in range(5, 17):
            if td[i].text.strip() != "-":
                months.append(i-6)

        temp_dict['months'] = months

        temp_dict['icon'] = "./static/image/bugs/" + name + ".webp"

        if url == "./bugs-north":
            out['northern'][name] = temp_dict
        else:
            out['southern'][name] = temp_dict

    return out


def get_villager_data(out):
    month_num = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    }


    soup = BeautifulSoup(open("./data/villagers"), 'html.parser')
    test = soup.find_all("tr")
    for item in test:
        temp_dict = {}
        td = item.find_all("td")

        name = td[0].text.strip("\n")
        gender_personality = td[2].text.strip().split(" ")
        temp_dict['gender'] = "f" if gender_personality[0] == "\u2640" else "m"
        temp_dict['personality'] = gender_personality[1]
        temp_dict['species'] = td[3].text.strip()

        birth_month_date = td[4].text.strip().split(" ")
        temp_dict['month'] = month_num[birth_month_date[0]]
        temp_dict['date'] = birth_month_date[1][:-2:]
        temp_dict['catchphrase'] = td[5].text.strip().strip('"')

        name.replace("SporkNACracklePAL", "Spork-Crackle")
        name.replace("JacobNAJakeyPAL", "Jacob-Jakey")
        temp_dict['icon'] = f"./static/image/villagers/{name}.webp"

        out[name] = temp_dict

    return out


def save_villager_icons():
    soup = BeautifulSoup(open("./data/villagers"), 'html.parser')
    test = soup.find_all("tr")
    for item in test:
        temp_dict = {}
        td = item.find_all("td")
        name = td[0].text.strip("\n")
        name.replace("SporkNACracklePAL", "Spork-Crackle")
        name.replace("JacobNAJakeyPAL", "Jacob-Jakey")
        for link in td[1].find_all("a", href=True):
            try:
                urllib.request.urlretrieve(link['href'], f"./static/image/villagers/{name}.webp")
            except e:
                print("Error downloading")


def sorted_villager_gen():#Sorts villagers into birthdays ordered by closest to current time to furthest
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

    MONTH = datetime.datetime.today().month
    DATE = datetime.datetime.today().day
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

    count = 0
    for item in sorted_month:
        out[count] = {'name': item[0], 'gender': item[1], 'personality': item[2], 'species': item[3], 'month': month_name[month_denormalisation[item[4]]], 'date': int(item[5]), 'catchphrase':item[6], 'icon':item[7]}
        count+=1

    with open('villagers-sorted.json', 'w') as f:
        json.dump(out, f)


def run_fish():
    out = {
        "northern": {},
        "southern": {}
        }

    fish_north = "./fish-north"
    fish_south = "./fish-south"

    fish = get_fish_data(fish_north, out)
    fish = get_fish_data(fish_south, out)

    with open('../app/data/fish.json', 'w') as f:
        json.dump(fish, f)


def run_bugs():
    out = {
    "northern": {},
    "southern": {}
    }

    bugs_north = "./bugs-north"
    bugs_south = "./bugs-south"


    bugs = get_bug_data(bugs_north, out)
    bugs = get_bug_data(bugs_south, out)

    with open('../app/data/bugs.json', 'w') as f:
        json.dump(bugs, f)


def run_villager():
    out = {}
    get_villager_data(out)
    villagers = get_villager_data(out)

    with open('villagers.json', 'w') as f:
        json.dump(villagers, f)


run_fish()
