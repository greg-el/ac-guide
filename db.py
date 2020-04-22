import psycopg2
import json

def setup():
    try:
        conn = psycopg2.connect(dbname="ac-guide", user="postgres")
    except Exception as e:
        print(e)

    cur = conn.cursor()

    try:
        cur.execute("""
        CREATE TABLE inventory (
            uid varchar(28) PRIMARY KEY,
            pocket jsonb
        );
        """)
    except Exception as e:
        print(e)

    conn.commit()
    cur.close()
    conn.close()


def add_test_data():
    try:
        conn = psycopg2.connect(dbname="ac-guide", user="postgres")
    except Exception as e:
        print(e)

    cur = conn.cursor()
    test_uid = "yfgCi6FUA0b0i26rWLEXUSuV7cu1"
    with open("test_data.json", "r") as f:
        json_data = json.dumps(json.load(f))

    cur.execute("INSERT INTO inventory (uid, pocket) VALUES(%s, %s)", (test_uid, json_data))
    conn.commit()
    cur.close()
    conn.close()

def connect_to_db(db):
    conn = psycopg2.connect(db)
    cur = conn.cursor()
    return cur


def add_to_db(cur, uid):
    try:
        cur.execute("INSERT INTO inventory (uid, pocket) VALUES (%s, %s)", (uid, pocket))
    except Exception as e:
        print(e)
        cur.close()
    cur.close()

def update_inventory(cur, uid, pocket, state):
    try:
        cur.execute("UPDATE inventory SET pocket = (%s) WHERE uid = (%s)", (pocket, uid))
    except Exception as e:
        print(e)
        cur.close()
    out = cur.fetchone()
    cur.close()


def get_from_db(cur, uid):
    try:
        cur.execute("SELECT pocket FROM inventory WHERE uid = (%s)", (uid, ))
    except Exception as e:
        print(e)
    out = cur.fetchone()
    return out

def remove_from_db(cur, uid):
    try:
        cur.execute("DELETE * FROM inventory WHERE uid = (%s)", (uid, ))
    except Exception as e:
        print(e)
        cur.close()
    cur.close()

