import unittest
from psycopg2 import sql
from psycopg2.extensions import AsIs
import testing.postgresql
import json
import sys
from db import *


class TestDatabaseMethods(unittest.TestCase):
    def setUp(self):
        self.postgres = testing.postgresql.Postgresql()
        conn = psycopg2.connect(**self.postgres.dsn())
        cur = conn.cursor()
        cur.execute("""
        CREATE TABLE inventory (
            uid varchar(28) PRIMARY KEY,
            pocket jsonb
        );
        """)

        self.test_uid = "yfgCi6FUA0b0i26rWLEXUSuV7cu1"
        with open("../app/data/prod_default.json", "r") as f:
            json_data = json.dumps(json.load(f))

        cur.execute("INSERT INTO inventory (uid, pocket) VALUES(%s, %s)", (self.test_uid, json_data))
        conn.commit()
        conn.close()
        cur.close()

    def test_get(self):
        conn = psycopg2.connect(**self.postgres.dsn())

        with open("../app/data/default_pocket.json", "r") as f:
            json_data = json.loads(f.readline())

        db_data = get_from_db(conn, "yfgCi6FUA0b0i26rWLEXUSuV7cu1")
        update_inventory(conn, self.test_uid, "bugs", "ant", 0)
        self.assertEqual(get_from_db(conn, self.test_uid)['bugs']['ant'], 0)

        conn.commit()
        conn.close()

    def test_update_create(self):
        conn = psycopg2.connect(**self.postgres.dsn())

        update_inventory(conn, self.test_uid, "bugs", "ant", 1)
        self.assertEqual(get_from_db(conn, self.test_uid)['bugs']['ant'], 1)

        update_inventory(conn, self.test_uid, "bugs", "ant", 0)
        self.assertEqual(get_from_db(conn, self.test_uid)['bugs']['ant'], 0)

        update_inventory(conn, self.test_uid, "bugs", "bar", 0)
        self.assertEqual(get_from_db(conn, self.test_uid)['bugs']['bar'], 0)


    def test_update(self):
        conn = psycopg2.connect(**self.postgres.dsn())
        update_inventory(conn, self.test_uid, 'bugs', 'ant', 0)
        db_data = get_from_db(conn, self.test_uid)
        self.assertEqual(db_data['bugs']['ant'], 0)

        update_inventory(conn, self.test_uid, "bugs", "ant", 1)
        set_to_1_test = get_from_db(conn, self.test_uid)
        self.assertEqual(set_to_1_test['bugs']['ant'], 1)

        update_inventory(conn, self.test_uid, "bugs", "ant", 0)
        set_to_0_test = get_from_db(conn, self.test_uid)
        self.assertEqual(set_to_0_test['bugs']['ant'], 0)

        conn.commit()
        conn.close()

    def test_remove_user(self):
        conn = psycopg2.connect(**self.postgres.dsn())

        self.test_uid = "yfgCi6FUA0b0i26rWLEXUSuV7cu1"
        remove_from_db(conn, self.test_uid)
        self.assertRaises(TypeError, get_from_db, conn, self.test_uid)
        
            
    def tearDown(self):
        self.postgres.stop()

if __name__ == "__main__":
    unittest.main()
