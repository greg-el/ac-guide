import psycopg2
from psycopg2.extensions import AsIs
import json
from ac import mypool


def add_to_db(uid):
    conn = mypool.getconn()
    cur = conn.cursor()
    with open("./data/prod_default.json", "r") as f:
        pocket = json.load(f)

    pocket = json.dumps(pocket)
    cur.execute("INSERT INTO inventory (uid, pocket) VALUES (%s, %s)", (uid, pocket))
    conn.commit()
    conn.close()

def update_inventory(cur, uid, species, critter, value):
    conn = mypool.connect()
    cur = conn.cursor()
    cur.execute("""UPDATE inventory
    SET pocket = jsonb_set(pocket, '{%s, %s}', '%s', TRUE) 
    WHERE uid = (%s);""", (AsIs(species), AsIs(critter), value, uid))
    conn.commit()
    conn.close()



def get_from_db(uid):
    conn = mypool.connect()
    cur = conn.cursor()
    cur.execute("SELECT pocket FROM inventory WHERE uid = (%s)", (uid, ))
    test = cur.fetchone()[0]
    conn.commit()
    conn.close()



def remove_from_db(uid):
    conn = mypool.connect()
    cur = conn.cursor()
    cur.execute("DELETE FROM inventory WHERE uid = (%s)", (uid, ))
    conn.commit()
    conn.close()