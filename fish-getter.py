from bs4 import BeautifulSoup
import requests
import re
import calendar
import json



out = {
    "northern": {},
    "southern": {}
    }

fish_north = "fish-north"
fish_south = "fish-south"
bugs_url = "https://www.gamespot.com/articles/animal-crossing-new-horizons-bugs-guide-how-to-cat/1100-6475001/"


def get_data(url, out):
    soup = BeautifulSoup(open(url), 'html.parser')
    test = soup.find_all("tr")
    for item in test:
        temp_dict = {}
        td = item.find_all("td")

        name = td[0].text.strip()
        temp_dict['price'] = td[2].text.strip()
        temp_dict['location'] = td[3].text.strip()
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

        if url == "fish-north":
            out['northern'][name] = temp_dict
        else:
            out['southern'][name] = temp_dict

    return out

    

out = get_data(fish_north, out)
out = get_data(fish_south, out)

json_file = json.dumps(out)

with open('fish.json', 'w') as f:
    json.dump(out, f)


