import psycopg2
from psycopg2.extensions import AsIs
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


def connect_to_db(db):
    conn = psycopg2.connect(db)
    cur = conn.cursor()
    return cur


def add_to_db(cur, uid):
    with open("prod_default.json", "r") as f:
        pocket = json.dumps(f.readlines())
    cur.execute("INSERT INTO inventory (uid, pocket) VALUES (%s, %s)", (uid, pocket))


def update_inventory(cur, uid, species, critter, value):
    cur.execute("""UPDATE inventory
    SET pocket = jsonb_set(pocket, '{%s, %s}', '%s', TRUE) 
    WHERE uid = (%s);""", (AsIs(species), AsIs(critter), value, uid))



def get_from_db(cur, uid):
    cur.execute("SELECT pocket FROM inventory WHERE uid = (%s)", (uid, ))
    return cur.fetchone()[0]



def remove_from_db(cur, uid):
    cur.execute("DELETE FROM inventory WHERE uid = (%s)", (uid, ))


