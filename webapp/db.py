from psycopg2.extensions import AsIs
from psycopg2.extras import register_uuid, Json
import uuid


class NoSuchUidError(Exception):
    pass


def add_to_db(conn, uid):
    cur = conn.cursor()
    chores = fish = bugs = dive = Json({})
    cur.execute("INSERT INTO inventory (firebase_user_id, chores, fish, bugs, dive) VALUES (%s, %s, %s, %s, %s)",
                (uid, chores, fish, bugs, dive))
    cur.close()
    conn.commit()


def update_chores(conn, uid, item, value):
    cur = conn.cursor()
    cur.execute("""UPDATE chores
    SET chores = jsonb_set(chores, '{%s, %s}', '%s', TRUE) 
    WHERE firebase_user_id = (%s);""", (AsIs(item), AsIs(value), uid))
    conn.commit()


def update_fish(conn, uid, item, value):
    cur = conn.cursor()
    cur.execute("""UPDATE fish
    SET fish = jsonb_set(fish, '{%s, %s}', '%s', TRUE) 
    WHERE firebase_user_id = (%s);""", (AsIs(item), AsIs(value), uid))
    conn.commit()


def update_bugs(conn, uid, item, value):
    cur = conn.cursor()
    cur.execute("""UPDATE bugs
    SET bugs = jsonb_set(bugs, '{%s, %s}', '%s', TRUE) 
    WHERE firebase_user_id = (%s);""", (AsIs(item), AsIs(value), uid))
    conn.commit()


def update_dive(conn, uid, item, value):
    cur = conn.cursor()
    cur.execute("""UPDATE dive
    SET dive = jsonb_set(dive, '{%s, %s}', '%s', TRUE) 
    WHERE firebase_user_id = (%s);""", (AsIs(item), AsIs(value), uid))
    conn.commit()


def get_from_db(conn, uid, requested_data):
    cur = conn.cursor()
    cur.execute("SELECT %s FROM inventory WHERE firebase_user_id = %s", (AsIs(requested_data), str(uid)))
    data = cur.fetchone()[0]
    if data is None:
        raise NoSuchUidError
    
    cur.close()
    return data


def remove_from_db(conn, uid):
    cur = conn.cursor()
    cur.execute("DELETE FROM inventory WHERE firebase_user_id = (%s)", (uid, ))
    conn.commit()
