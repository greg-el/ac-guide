import unittest
from psycopg2 import sql
from psycopg2.extensions import AsIs
import testing.postgresql
import json
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

        test_uid = "yfgCi6FUA0b0i26rWLEXUSuV7cu1"
        with open("default_pocket.json", "r") as f:
            json_data = json.dumps(json.load(f))

        cur.execute("INSERT INTO inventory (uid, pocket) VALUES(%s, %s)", (test_uid, json_data))
        conn.commit()
        conn.close()
        cur.close()

    def test_get(self):
        conn = psycopg2.connect(**self.postgres.dsn())
        cur = conn.cursor()

        with open("default_pocket.json", "r") as f:
            json_data = json.loads(f.readline())

        db_data = get_from_db(cur, "yfgCi6FUA0b0i26rWLEXUSuV7cu1")
        self.assertEqual(json_data['fish']['Frog'], db_data['fish']['Frog'])
        self.assertEqual(json_data['fish']['Anchovy'], db_data['fish']['Anchovy'])
        self.assertEqual(json_data['bugs']['Brown cicada'], db_data['bugs']['Brown cicada'])
        self.assertEqual(json_data['bugs']['Ant'], db_data['bugs']['Ant'])

        conn.commit()
        conn.close()
        cur.close()


    def test_update(self):
        conn = psycopg2.connect(**self.postgres.dsn())
        cur = conn.cursor()

        test_uid = "yfgCi6FUA0b0i26rWLEXUSuV7cu1"

        db_data = get_from_db(cur, test_uid)
        self.assertEqual(db_data['bugs']['Ant'], 0)

        update_inventory(cur, test_uid, "bugs", "Ant", 1)
        set_to_1_test = get_from_db(cur, test_uid)
        self.assertEqual(set_to_1_test['bugs']['Ant'], 1)

        update_inventory(cur, test_uid, "bugs", "Ant", 0)
        set_to_0_test = get_from_db(cur, test_uid)
        self.assertEqual(set_to_0_test['bugs']['Ant'], 0)

        conn.commit()
        conn.close()
        cur.close()

    def test_remove_user(self):
        conn = psycopg2.connect(**self.postgres.dsn())
        cur = conn.cursor()

        test_uid = "yfgCi6FUA0b0i26rWLEXUSuV7cu1"
        self.assertEqual(True, remove_from_db(cur, test_uid))
        self.assertRaises(TypeError, get_from_db, cur, test_uid)
        
            
    def tearDown(self):
        self.postgres.stop()

if __name__ == "__main__":
    unittest.main()

