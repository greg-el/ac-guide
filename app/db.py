import psycopg2
from psycopg2.extensions import AsIs
import json
from ac import mypool

class NoSuchUidError(Exception):
    pass


def add_to_db(uid):
    conn = mypool.getconn()
    cur = conn.cursor()
    with open("./data/prod_default.json", "r") as f:
        pocket = json.load(f)

    pocket = json.dumps(pocket)
    cur.execute("INSERT INTO inventory (uid, pocket) VALUES (%s, %s)", (uid, pocket))
    conn.commit()
    putconn(conn)

def update_inventory(uid, species, critter, value):
    conn = mypool.getconn()
    cur = conn.cursor()
    cur.execute("""UPDATE inventory
    SET pocket = jsonb_set(pocket, '{%s, %s}', '%s', TRUE) 
    WHERE uid = (%s);""", (AsIs(species), AsIs(critter), AsIs(value), uid))
    conn.commit()
    putconn(conn)



def get_from_db(uid):
    conn = mypool.getconn()
    cur = conn.cursor()
    cur.execute("SELECT pocket FROM inventory WHERE uid = (%s)", (uid, ))
    if not cur.fetchone():
        raise NoSuchUidError


    data = cur.fetchone()[0]
    cur.close()
    putconn(conn)
    return data

    
def remove_from_db(uid):
    conn = mypool.connect()
    cur = conn.cursor()
    cur.execute("DELETE FROM inventory WHERE uid = (%s)", (uid, ))
    conn.commit()
    putconn(conn)