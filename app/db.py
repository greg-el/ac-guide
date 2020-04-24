import psycopg2
from psycopg2.extensions import AsIs
import json
from sqlalchemy import create_engine

import os
from ac import mypool


def add_to_db(uid):
    conn = mypool.connect()
    cur = conn.cursor()
    with open("./data/prod_default.json", "r") as f:
        pocket = json.dumps(f.readlines())

    cur.execute("INSERT INTO inventory (uid, pocket) VALUES (%s, %s)", (uid, pocket))
    conn.close()

def update_inventory(cur, uid, species, critter, value):
    cur.execute("""UPDATE inventory
    SET pocket = jsonb_set(pocket, '{%s, %s}', '%s', TRUE) 
    WHERE uid = (%s);""", (AsIs(species), AsIs(critter), value, uid))



def get_from_db(uid):
    conn = mypool.connect()
    cur = conn.cursor()
    cur.execute("SELECT pocket FROM inventory WHERE uid = (%s)", (uid, ))
    return cur.fetchone()[0]



def remove_from_db(cur, uid):
    cur.execute("DELETE FROM inventory WHERE uid = (%s)", (uid, ))
