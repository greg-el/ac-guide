import json
import datetime
month = datetime.datetime.today().month
hour = datetime.datetime.today().hour

with open('./fish.json') as f:
    data = json.load(f)

test = data['regions']['southern']
print("You can currently catch:")
for item in test:
    #print(item)
    months = item['months']
    hours = item['time']
    #print(item)
    #print(hours['start'], hours['end'])
    #print(months[0]['start'], months[0]['end'])
    
    if len(months) == 1:
        if months[0]['start'] < month and month < months[0]['end']:
            #print(item)
            if hours['start'] > hours['end']:
                if hours['start'] > hour and hour <= 24 or  hour < hours['end']:
                    print(f"{item['name']} at the {item['location']}")
            else:
                if hours['start'] < hour and hours['end'] > hour:
                    print(f"Y{item['name']} at the {item['location']}")
        
    

    