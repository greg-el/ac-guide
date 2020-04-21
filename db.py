import psycopg2

def setup():
    try:
        conn = psycopg2.connect(dbname="ac-guide", user="postgres")
    except Exception as e:
        print(e)
        exit(1)

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
        exit(1)

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
        conn.close()
    cur.close()
    conn.close()

def update_inventory(cur, uid, pocket, state):
    try:
        cur.execute("UPDATE inventory SET pocket = (%s) WHERE uid = (%s)", (pocket, uid))
    except Exception as e:
        print(e)
        cur.close()
        conn.close()
    out = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()


def get_from_db(cur, uid):
    try:
        cur.execute("SELECT pocket FROM inventory WHERE uid = (%s)", (uid, ))
    except Exception as e:
        print(e)
        cur.close()
        conn.close()
    out = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return out

def remove_from_db(cur, uid):
    try:
        cur.execute("DELETE * FROM inventory WHERE uid = (%s)", (uid, ))
    except Exception as e:
        print(e)
        cur.close()
        conn.close()
    conn.commit()
    cur.close()
    conn.close()
