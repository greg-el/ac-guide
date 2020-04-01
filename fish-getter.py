from bs4 import BeautifulSoup
import requests
import re
import calendar
import json

month_abbr = {
    "Jan":1,
    "Feb":2,
    "Mar":3,
    "April":4,
    "Apr":4,
    "May":5,
    "June":6,
    "July":7,
    "Aug":8,
    "Sept":9,
    "Oct":10,
    "Nov":11,
    "Dec":12
}

url = "https://www.gamespot.com/articles/animal-crossing-new-horizons-fish-guide/1100-6474887/"
r = requests.get(url)
soup = BeautifulSoup(r.content, 'html.parser')
test = soup.find_all("tbody")
count = 0
out = ""
south = 0
for item in test:
    for tr in item.find_all("tr"):
        td = tr.find_all("td")
        #name
        if td[0].text == "Anchovy" and not south:
            print("\"northern\":[")
            south = 1
        elif td[0].text == "Anchovy":
            print("], \"southern\":[")

        out += f"\"name\": \"{td[0].text}\","

        #months
        if td[1].text == "All year":
                out += "\"months\": [{\"start\": 0, \"end\": 12}],"
        elif " " not in td[1].text:
            out += f"\"months\": [{{\"start\": {month_abbr[td[1].text]}, \"end\": {month_abbr[td[1].text]}}}],"
        else:
            if "," in td[1].text:
                comma_split = td[1].text.split(",")
                span_1 = comma_split[0]
                span_2 = comma_split[1]
                months_1 = span_1.split("-")
                months_2 = span_2.split("-")
                out += (f"\"months\": ["
                        "{"
                            f"\"start\": {month_abbr[months_1[0].strip()]},"
                            f"\"end\": {month_abbr[months_1[1].strip()]}"
                        "},"
                        "{"
                            f"\"start\": {month_abbr[months_2[0].strip()]},"
                            f"\"end\": {month_abbr[months_2[1].strip()]}"
                        "}],")
            else:
                months = td[1].text.split("-")
                out += f"\"months\": [{{\"start\":{month_abbr[months[0].strip()]}, \"end\": {month_abbr[months[1].strip()]}}}],"

        #location
        out += f"\"location\": \"{td[2].text}\","

        #time
        if td[3].text == "All day":
                out += "\"time\": {\"start\": 0, \"end\": 24},"
        else:
            hours = re.compile("(\d)\s(\w+)\s-\s(\d)\s(\w+)")
            result = hours.match(td[3].text)
            start = 0
            end = 0
            if result:
                if result.group(2) == "PM":
                    start = int(result.group(1))+12
                    end = result.group(3)
                elif result.group(4) == "PM":
                    start = result.group(1)
                    end = int(result.group(3))+12
                out += f"\"time\": {{\"start\": {start}, \"end\": {end}}},"

        #price
        out += f"\"price\": \"{td[4].text}\""

        print(f"{{{out}}},")
        out = ""
print("]}]}")


        #for td in tr.find_all("td"):
        #    if count < 5:
        #        if count == 0:
        #            out += f"\"name\": {{\"{td.text}\"}}")
        #        if count == 1:
        #            if td.text == "All year":
        #                out += "\"start\": 0, \"end\": 12")
        #                count += 1
        #            elif " " not in td.text:
        #                out += f"\"months\": [{{\"start\": {month_abbr[td.text]}, \"end\": {month_abbr[td.text]}]")
        #                count+=1
        #            else:
        #                if "," in td.text:
        #                    comma_split = td.text.split(",")
        #                    span_1 = comma_split[0]
        #                    span_2 = comma_split[1]
        #                    months_1 = span_1.split("-")
        #                    months_2 = span_2.split("-")
        #                    output = (f"\"months\": ["
        #                            "{"
        #                                f"\"start\": {month_abbr[months_1[0].strip()]},"
        #                                f"\"end\": {month_abbr[months_1[1].strip()]}"
        #                            "},"
        #                            "{"
        #                                f"\"start\": {month_abbr[months_2[0].strip()]},"
        #                                f"\"end\": {month_abbr[months_2[1].strip()]}"
        #                            "}],")
        #                    out += output)
        #                    count+=1
        #                else:
        #                    months = td.text.split("-")
        #                    out += f"\"months\": [{{\"start\":{month_abbr[months[0].strip()]}, \"end\": {month_abbr[months[1].strip()]}}}]")
        #                    count+=1
        #        elif count == 2:
        #            out += f"\"location\": \"{td.text}\"")
        #            count+=1
        #        elif count == 3:
        #            if td.text == "All day":
        #                out += "\"time\": { \"start\": 0, \"end\": 24}")
        #                count += 1
        #            else:
        #                hours = re.compile("(\d)\s(\w+)\s-\s(\d)\s(\w+)")
        #                result = hours.match(td.text)
        #                start = 0
        #                end = 0
        #                if result:
        #                    if result.group(2) == "PM":
        #                        start = int(result.group(1))+12
        #                        end = result.group(3)
        #                    elif result.group(4) == "PM":
        #                        start = result.group(1)
        #                        end = int(result.group(3))+12
        #                    out += f"\"time\": {{ \"start\": {start}, \"end\": {end}}}")
        #                    count += 1
        #        
        #        else:
        #            out += td.text)
        #            count +=1
        #    else:
        #        print(out)
        #        out = []
        #        count = 1
        #        out += td.text)
                




                
                #out += td.text)
                #count += 1

            #else:



