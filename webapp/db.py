import psycopg2
from psycopg2.extensions import AsIs
from psycopg2.extras import register_uuid
import json
import uuid


class NoSuchUidError(Exception):
    pass


def add_to_db(conn, firebase_user_id):
    cur = conn.cursor()
    with open("./webapp/data/prod_default.json", "r") as f:
        pocket = json.load(f)

    register_uuid()
    uid = uuid.uuid4()
    pocket = json.dumps(pocket)
    cur.execute("INSERT INTO inventory (uid, pocket, firebase_user_id) VALUES (%s, %s, %s)",
                (uid, pocket, firebase_user_id))
    cur.close()
    conn.commit()


def update_inventory(conn, uid, group, item, value):
    cur = conn.cursor()
    cur.execute("""UPDATE inventory
    SET pocket = jsonb_set(pocket, '{%s, %s}', '%s', TRUE) 
    WHERE uid = (%s);""", (AsIs(group), AsIs(item), AsIs(value), uid))
    conn.commit()


def get_from_db(conn, uid, requested_data):
    cur = conn.cursor()
    cur.execute("SELECT pocket->>(%s) FROM inventory WHERE uid = (%s)", (requested_data, uid))
    data = cur.fetchone()[0]
    if data is None:
        raise NoSuchUidError
    
    cur.close()
    return data


def remove_from_db(conn, uid):
    cur = conn.cursor()
    cur.execute("DELETE FROM inventory WHERE uid = (%s)", (uid, ))
    conn.commit()
