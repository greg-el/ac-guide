import psycopg2
from psycopg2.extensions import AsIs
import json


class NoSuchUidError(Exception):
    pass


def add_to_db(conn, uid):
    cur = conn.cursor()
    with open("./data/prod_default.json", "r") as f:
        pocket = json.load(f)

    pocket = json.dumps(pocket)
    cur.execute("INSERT INTO inventory (uid, pocket) VALUES (%s, %s)", (uid, pocket))
    cur.close()
    conn.commit()


def update_inventory(conn, uid, species, critter, value):
    cur = conn.cursor()
    cur.execute("""UPDATE inventory
    SET pocket = jsonb_set(pocket, '{%s, %s}', '%s', TRUE) 
    WHERE uid = (%s);""", (AsIs(species), AsIs(critter), AsIs(value), uid))
    conn.commit()


def get_from_db(conn, uid, requested_data):
    print(requested_data)
    cur = conn.cursor()
    cur.execute("SELECT pocket->>(%s) FROM inventory WHERE uid = (%s)", (requested_data, uid))
    data = cur.fetchone()[0]
    if data == None:
        raise NoSuchUidError
    
    cur.close()
    return data


def remove_from_db(conn, uid):
    cur = conn.cursor()
    cur.execute("DELETE FROM inventory WHERE uid = (%s)", (uid, ))
    conn.commit()
    