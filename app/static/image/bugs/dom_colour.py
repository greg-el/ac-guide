import colorgram


import os
with open("dominant.txt", "a") as f:
        f.write("var fishDominant = [")
directory = os.listdir(os.getcwd())
for i in range(len(directory)) :
   with open(os.path.join(os.getcwd(), directory[i]), 'r'):
        if directory[i] == "dominant.txt" or directory[i] == "dom_colour.py":
           continue
        colors = colorgram.extract(directory[i], 6)
        c = colors[1].rgb
        print(c)
        if i == len(directory)-1:
            with open("dominant.txt", "a") as f:
                f.write(f"\"rgb({c.r}, {c.g}, {c.b})\"]")
        else:
            print(directory[i], c)
            with open("dominant.txt", "a") as f:
                f.write(f"\"rgb({c.r}, {c.g}, {c.b})\",")

