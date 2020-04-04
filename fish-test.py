import json
import datetime
month = datetime.datetime.today().month
hour = datetime.datetime.today().hour

with open('fish.json') as f:
    fish_data = json.load(f)



fish = fish_data['northern']
print("You can currently catch:")

for name, data in fish.items():
    months = data['months']
    hours = data['time']
    if month in months and hour in hours:
        print(name)


with open('bugs.json') as f:
    bug_data = json.load(f)

bugs = bug_data['northern']
print("You can catch:")

longest = 0
for name, data in bugs.items():
    months = data['months']
    hours = data['time']
    if month in months and hour in hours:
        if len(name) > longest:
            longest = len(name)+2


for name, data in bugs.items():
    months = data['months']
    hours = data['time']
    if month in months and hour in hours:
            gap = (longest-len(name)) * " "
            print(f"{name}{gap}{data['location']}")
            