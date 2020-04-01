import json
import datetime
month = datetime.datetime.today().month
hour = datetime.datetime.today().hour

with open('./fish.json') as f:
    data = json.load(f)

test = data['regions']['southern']
for item in test:
    months = item['months']
    hours = item['time']
    print(hours['start'], hours['end'])
    if len(months) == 1:
        if months['start'] < month and month < months['end'] and hours['start'] < hour and hour < hours['end']:
            print(item['name'])
        
    

    