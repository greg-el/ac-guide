import psycopg2

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
            pocket json
        );
        """)
    except Exception as e:
        print(e)

    conn.commit()
    cur.close()
    conn.close()




def add_to_db(uid, json):
    conn = psycopg2.connect("dbname=users user=postgres")
    cur = conn.cursor()
    cur.execute("INSERT INTO users (uid, json) VALUES (%s, %s)", (uid, json))
    conn.commit()
    cur.close()
    conn.close()

def get_from_db(uid):
    conn = psycopg2.connect("dbname=users user=postgres")
    cur = conn.cursor()
    cur.execute("SELECT FROM users WHERE uid = (uid) VALUES (%s)", (uid, ))
    conn.commit()
    cur.close()
    conn.close()

setup()