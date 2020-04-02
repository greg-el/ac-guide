import json
import datetime
month = datetime.datetime.today().month
hour = datetime.datetime.today().hour

with open('fish.json') as f:
    data = json.load(f)

test = data['northern']
print("You can currently catch:")

for name, data in test.items():
    months = data['months']
    hours = data['time']
    if month in months and hour in hours:
        print(name)


    