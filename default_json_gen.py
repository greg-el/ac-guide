import json

def main():
    out = {}

    with open("fish.json", "r") as f:
        fish_json = json.loads(f.readline())

    fish = {}
    for name in fish_json['northern']:
        fish[name] = 0


    bugs = {}
    with open("bugs.json", "r") as f:
        bugs_json = json.loads(f.readline())

    for name in bugs_json['northern']:
        bugs[name] = 0

    out['fish'] = fish
    out['bugs'] = bugs

    with open("default_pocket.json", "w") as f:
        json.dump(out, f)


if __name__ == "__main__":
    main()